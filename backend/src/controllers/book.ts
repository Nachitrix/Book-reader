import { Request, Response, NextFunction, RequestHandler } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import Book, { IBook } from '../models/Book';
import { IUser } from '../types/express';
import { cleanupUploads } from '../middleware/upload';

// Custom type for controller functions that return responses
export type ControllerHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

// @desc    Upload a new book
// @route   POST /api/books
// @access  Private
export const uploadBook: ControllerHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const user = req.user as IUser;
    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1) as 'pdf' | 'epub' | 'mobi';
    const originalName = req.file.originalname;
    
    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(originalName)}`;
    const newPath = path.join(path.dirname(req.file.path), uniqueFilename);
    
    try {
      // Rename the file to include a unique identifier
      await fs.rename(req.file.path, newPath);
      
      // Create book in database with the new path
      const book = await Book.create({
        title: req.body.title || path.basename(originalName, path.extname(originalName)),
        author: req.body.author,
        description: req.body.description,
        format: fileExt,
        filePath: newPath.replace(process.cwd(), ''), // Store relative path
        fileSize: req.file.size,
        userId: user._id,
        isPublic: req.body.isPublic === 'true',
      });

      // TODO: Extract metadata (pages, cover image, etc.) in a background job
      // This could be done with a message queue or a background worker

      res.status(201).json({
        success: true,
        data: book,
      });
    } catch (error) {
      // Clean up uploaded file if there was an error
      try {
        await fs.unlink(newPath).catch(console.error);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
      throw error; // Re-throw to be caught by the outer catch
    }
  } catch (error: any) {
    // Clean up any uploaded files on error
    await cleanupUploads(req);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((e: Error) => e.message),
      });
    }
    
    next(error);
  }
};

// @desc    Get all books for the authenticated user
// @route   GET /api/books
// @access  Private
export const getBooks: ControllerHandler = async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const { page = 1, limit = 10, sort = '-createdAt', search = '' } = req.query;
    
    // Build query
    const query: any = { userId: user._id };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Execute query with pagination
    const [books, total] = await Promise.all([
      Book.find(query)
        .sort(sort as string)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .select('title author format coverImage _id'),
      Book.countDocuments(query),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / Number(limit));
    
    // Ensure coverImage is always present (null if not set)
    const booksWithCover = books.map(book => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      format: book.format,
      coverImage: book.coverImage ?? null
    }));

    res.status(200).json({
      success: true,
      count: booksWithCover.length,
      total,
      page: Number(page),
      totalPages,
      data: booksWithCover,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
export const getBook: ControllerHandler = async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const book = await Book.findOne({
      _id: req.params.id,
      $or: [
        { userId: user._id },
        { isPublic: true } // Allow access to public books
      ]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or you do not have permission to access it',
      });
    }

    // If the book is not public and doesn't belong to the user
    if (!book.isPublic && book.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this book',
      });
    }

    // Ensure coverImage is always present (null if not set) for US-2.3
    const bookData = book.toObject();
    if (!bookData.coverImage) {
      bookData.coverImage = null;
    }

    res.status(200).json({
      success: true,
      data: bookData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook: ControllerHandler = async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const book = await Book.findOne({ _id: req.params.id, userId: user._id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or you do not have permission to delete it',
      });
    }

    // Get the full path to the file
    const fullPath = path.join(process.cwd(), book.filePath);
    
    try {
      // Delete file from filesystem if it exists
      try {
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      } catch (fsError) {
        console.error('Error deleting file:', fsError);
        // Continue with database deletion even if file deletion fails
      }

      // Delete from database
      await Book.deleteOne({ _id: book._id });

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      console.error('Error during book deletion:', error);
      throw error; // Will be caught by the outer catch
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update book metadata
// @route   PUT /api/books/:id
// @access  Private
export const updateBook: ControllerHandler = async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const { title, author, description, isPublic } = req.body;
    
    const book = await Book.findOne({ _id: req.params.id, userId: user._id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or you do not have permission to update it',
      });
    }

    // Update fields if they were provided
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (description !== undefined) book.description = description;
    if (isPublic !== undefined) book.isPublic = isPublic === 'true';

    await book.save();

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((e: Error) => e.message),
      });
    }
    next(error);
  }
};