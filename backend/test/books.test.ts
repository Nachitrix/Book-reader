import mongoose from 'mongoose';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

jest.setTimeout(30000);

// Helper function to create a test file
const createTestFile = (content = 'test content', ext = '.pdf') => {
  const tempDir = path.join(process.cwd(), 'uploads/test');
  fs.mkdirSync(tempDir, { recursive: true });
  
  const filePath = path.join(tempDir, `test-${uuidv4()}${ext}`);
  fs.writeFileSync(filePath, content);
  
  return {
    path: filePath,
    cleanup: () => {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error cleaning up test file:', error);
      }
    }
  };
};

// Import app after setting up test environment
import app from '../src/app';
import User from '../src/models/User';
import Book from '../src/models/Book';

describe('Book API', () => {
  let authToken: string;
  let testUser: any;
  let testBook: any;
  
  beforeAll(async () => {
    // Register a test user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    };
    
    // Register user
    await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    // Login to get auth token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });
    
    authToken = loginRes.body.token;
    testUser = await User.findOne({ email: userData.email });
  });
  
  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await Book.deleteMany({});
    
    // Close MongoDB connection
    await mongoose.connection.close();
  });
  
  afterEach(async () => {
    // Clean up books after each test
    await Book.deleteMany({});
  });
  
  describe('POST /api/books', () => {
    it('should upload a book with valid data', async () => {
      const { path: filePath, cleanup } = createTestFile();
      
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author')
        .field('description', 'Test Description')
        .field('isPublic', 'true')
        .attach('file', filePath);
      
      cleanup();
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe('Test Book');
      expect(res.body.data.author).toBe('Test Author');
      expect(res.body.data.description).toBe('Test Description');
      expect(res.body.data.isPublic).toBe(true);
    });
    
    it('should return 400 if no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author');
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Please upload a file');
    });
    
    it('should return 400 for unsupported file types', async () => {
      const { path: filePath, cleanup } = createTestFile('invalid content', '.xyz');
      
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author')
        .attach('file', filePath);
      
      cleanup();
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Unsupported file type');
    });
  });
  
  describe('GET /api/books', () => {
    it('should get all books for the authenticated user', async () => {
      // Create a test book
      const { path: filePath, cleanup } = createTestFile();
      
      const uploadRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author')
        .attach('file', filePath);
      
      cleanup();
      testBook = uploadRes.body.data;
      
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Test Book');
      
      // Check pagination metadata
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('totalPages');
    });
    
    it('should return books with title, author, format, and coverImage fields (US-2.2)', async () => {
      // Create a test book
      const { path: filePath, cleanup } = createTestFile();
      
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author')
        .attach('file', filePath);
      
      cleanup();
      
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Verify all required fields are present
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const book = res.body.data[0];
      expect(book).toHaveProperty('_id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('format');
      expect(book).toHaveProperty('coverImage');
    });
    
    it('should return empty array if no books exist', async () => {
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(0);
    });
  });
  
  describe('GET /api/books/:id', () => {
    it('should get a single book by ID', async () => {
      // Create a test book
      const { path: filePath, cleanup } = createTestFile();
      
      const uploadRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author')
        .attach('file', filePath);
      
      cleanup();
      testBook = uploadRes.body.data;
      
      const res = await request(app)
        .get(`/api/books/${testBook._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(testBook.title);
    });

    it('should return detailed book information with all metadata fields (US-2.3)', async () => {
      // Upload a test book with complete metadata
      const { path: filePath } = createTestFile();
      
      const completeBook = {
        title: 'Complete Test Book',
        author: 'Test Author',
        description: 'A detailed description of the test book',
        isPublic: 'true',
      };
      
      const uploadRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', completeBook.title)
        .field('author', completeBook.author)
        .field('description', completeBook.description)
        .field('isPublic', completeBook.isPublic)
        .attach('file', filePath);
      
      const bookId = uploadRes.body.data._id;
      
      const res = await request(app)
        .get(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      // Verify response structure and required fields
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Book should have all required metadata fields
      const book = res.body.data;
      expect(book).toHaveProperty('_id');
      expect(book).toHaveProperty('title');
      expect(book.title).toBe(completeBook.title);
      expect(book).toHaveProperty('author');
      expect(book.author).toBe(completeBook.author);
      expect(book).toHaveProperty('description');
      expect(book.description).toBe(completeBook.description);
      expect(book).toHaveProperty('format');
      expect(['pdf', 'epub', 'mobi']).toContain(book.format);
      expect(book).toHaveProperty('filePath');
      expect(book).toHaveProperty('fileSize');
      expect(book.fileSize).toBeGreaterThan(0);
      expect(book).toHaveProperty('userId');
      expect(book).toHaveProperty('isPublic');
      expect(book).toHaveProperty('coverImage');
      expect(book).toHaveProperty('createdAt');
      expect(book).toHaveProperty('updatedAt');
    });
    
    it('should return 404 for non-existent book', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/books/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/books/:id', () => {
    it('should update book metadata', async () => {
      // Create a test book
      const { path: filePath, cleanup } = createTestFile();
      
      const uploadRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Original Title')
        .field('author', 'Original Author')
        .field('description', 'Original Description')
        .field('isPublic', 'false')
        .attach('file', filePath);
      
      cleanup();
      const bookId = uploadRes.body.data._id;
      
      // Update the book
      const updateData = {
        title: 'Updated Title',
        author: 'Updated Author',
        description: 'Updated Description',
        isPublic: 'true'
      };
      
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.author).toBe(updateData.author);
      expect(res.body.data.description).toBe(updateData.description);
      expect(res.body.data.isPublic).toBe(true);
    });
  });
  
  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      // Create a test book
      const { path: filePath, cleanup } = createTestFile();
      
      const uploadRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Book to Delete')
        .field('author', 'Test Author')
        .attach('file', filePath);
      
      cleanup(); // Clean up the original test file
      
      const bookId = uploadRes.body.data._id;
      
      // Delete the book
      const deleteRes = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      
      // Verify book is deleted
      const getRes = await request(app)
        .get(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getRes.status).toBe(404);
    });
  });
});