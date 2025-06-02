# Flutter Book Reader App - Data Model

## 1. Overview

This data model supports the Flutter Book Reader App requirements including offline storage, cross-platform compatibility, and advanced features like PDF reflow mode and paragraph-based annotations.

### 1.1 Storage Strategy
- **Primary Storage**: Hive (NoSQL) for complex data structures
- **Settings Storage**: SharedPreferences for user preferences
- **File Storage**: Local file system for book files and generated content
- **Caching**: In-memory caching for frequently accessed data

### 1.2 Data Architecture Principles
- **Offline-First**: All data available without network connectivity
- **Immutable Files**: Original book files never modified
- **Separate Metadata**: User data stored independently from book content
- **Version Compatibility**: Forward and backward compatible data structures
- **Cross-Platform**: Consistent data format across all platforms

---

## 2. Core Data Models

### 2.1 Book Model
```dart
@HiveType(typeId: 0)
class Book extends HiveObject {
  @HiveField(0)
  String id;                    // Unique identifier (UUID)
  
  @HiveField(1)
  String title;                 // Book title
  
  @HiveField(2)
  String? author;               // Book author(s)
  
  @HiveField(3)
  String? description;          // Book description/summary
  
  @HiveField(4)
  String? publisher;            // Publisher name
  
  @HiveField(5)
  DateTime? publishedDate;      // Publication date
  
  @HiveField(6)
  String? isbn;                 // ISBN number
  
  @HiveField(7)
  String? language;             // Book language (ISO 639-1)
  
  @HiveField(8)
  BookFormat format;            // PDF, EPUB, MOBI
  
  @HiveField(9)
  String filePath;              // Local file path
  
  @HiveField(10)
  String? coverImagePath;       // Cover image file path
  
  @HiveField(11)
  int fileSize;                 // File size in bytes
  
  @HiveField(12)
  String? fileHash;             // File integrity hash
  
  @HiveField(13)
  DateTime addedDate;           // When book was added to library
  
  @HiveField(14)
  DateTime lastOpenedDate;      // Last time book was opened
  
  @HiveField(15)
  BookStatus status;            // Not started, reading, completed
  
  @HiveField(16)
  int totalPages;               // Total number of pages/chapters
  
  @HiveField(17)
  int totalWords;               // Estimated word count
  
  @HiveField(18)
  Map<String, dynamic> metadata; // Additional format-specific metadata
  
  @HiveField(19)
  List<String> tags;            // User-defined tags
  
  @HiveField(20)
  double rating;                // User rating (0-5)
  
  @HiveField(21)
  bool isFavorite;              // Favorite status
  
  @HiveField(22)
  BookProcessingStatus processingStatus; // Processing state for reflow
  
  @HiveField(23)
  String? reflowFilePath;       // Path to reflow version (PDF only)
  
  @HiveField(24)
  DateTime? lastModified;       // Last modification timestamp
}

@HiveType(typeId: 1)
enum BookFormat {
  @HiveField(0)
  pdf,
  @HiveField(1)
  epub,
  @HiveField(2)
  mobi
}

@HiveType(typeId: 2)
enum BookStatus {
  @HiveField(0)
  notStarted,
  @HiveField(1)
  reading,
  @HiveField(2)
  completed,
  @HiveField(3)
  paused
}

@HiveType(typeId: 3)
enum BookProcessingStatus {
  @HiveField(0)
  pending,
  @HiveField(1)
  processing,
  @HiveField(2)
  completed,
  @HiveField(3)
  failed,
  @HiveField(4)
  notRequired
}
```

### 2.2 Reading Progress Model
```dart
@HiveType(typeId: 4)
class ReadingProgress extends HiveObject {
  @HiveField(0)
  String id;                    // Unique identifier
  
  @HiveField(1)
  String bookId;                // Reference to Book
  
  @HiveField(2)
  int currentPage;              // Current page number
  
  @HiveField(3)
  double currentPosition;       // Precise position (0.0 - 1.0)
  
  @HiveField(4)
  String? currentChapter;       // Current chapter name/ID
  
  @HiveField(5)
  int totalTimeRead;            // Total reading time in seconds
  
  @HiveField(6)
  DateTime lastReadDate;        // Last reading session date
  
  @HiveField(7)
  double progressPercentage;    // Overall progress (0.0 - 100.0)
  
  @HiveField(8)
  List<ReadingSession> sessions; // Reading session history
  
  @HiveField(9)
  ReadingMode lastReadingMode;  // Original or reflow mode
  
  @HiveField(10)
  Map<String, dynamic> positionData; // Format-specific position data
  
  @HiveField(11)
  int wordsRead;                // Estimated words read
  
  @HiveField(12)
  double averageReadingSpeed;   // Words per minute
  
  @HiveField(13)
  DateTime? estimatedCompletionDate; // Projected finish date
}

@HiveType(typeId: 5)
class ReadingSession extends HiveObject {
  @HiveField(0)
  DateTime startTime;           // Session start time
  
  @HiveField(1)
  DateTime endTime;             // Session end time
  
  @HiveField(2)
  int pagesRead;                // Pages read in session
  
  @HiveField(3)
  int wordsRead;                // Words read in session
  
  @HiveField(4)
  double startPosition;         // Starting position
  
  @HiveField(5)
  double endPosition;           // Ending position
}

@HiveType(typeId: 6)
enum ReadingMode {
  @HiveField(0)
  original,
  @HiveField(1)
  reflow
}
```

### 2.3 Annotation Model
```dart
@HiveType(typeId: 7)
class Annotation extends HiveObject {
  @HiveField(0)
  String id;                    // Unique identifier
  
  @HiveField(1)
  String bookId;                // Reference to Book
  
  @HiveField(2)
  AnnotationType type;          // Highlight, note, bookmark
  
  @HiveField(3)
  String? selectedText;         // Selected text content
  
  @HiveField(4)
  String? userNote;             // User's comment/note
  
  @HiveField(5)
  AnnotationPosition position;  // Position information
  
  @HiveField(6)
  AnnotationColor color;        // Highlight color
  
  @HiveField(7)
  DateTime createdDate;         // Creation timestamp
  
  @HiveField(8)
  DateTime lastModifiedDate;    // Last modification timestamp
  
  @HiveField(9)
  List<String> tags;            // User-defined tags
  
  @HiveField(10)
  bool isPublic;                // Share with others (future feature)
  
  @HiveField(11)
  int pageNumber;               // Page number reference
  
  @HiveField(12)
  String? chapterId;            // Chapter reference
  
  @HiveField(13)
  ReadingMode readingMode;      // Mode when annotation was created
  
  @HiveField(14)
  Map<String, dynamic> metadata; // Additional annotation data
}

@HiveType(typeId: 8)
class AnnotationPosition extends HiveObject {
  @HiveField(0)
  int startOffset;              // Start character offset
  
  @HiveField(1)
  int endOffset;                // End character offset
  
  @HiveField(2)
  String? paragraphId;          // Paragraph identifier
  
  @HiveField(3)
  double? x;                    // X coordinate (for precise positioning)
  
  @HiveField(4)
  double? y;                    // Y coordinate (for precise positioning)
  
  @HiveField(5)
  double? width;                // Selection width
  
  @HiveField(6)
  double? height;               // Selection height
  
  @HiveField(7)
  List<AnnotationRect>? rects;  // Multiple selection rectangles
}

@HiveType(typeId: 9)
class AnnotationRect extends HiveObject {
  @HiveField(0)
  double x;                     // Rectangle X coordinate
  
  @HiveField(1)
  double y;                     // Rectangle Y coordinate
  
  @HiveField(2)
  double width;                 // Rectangle width
  
  @HiveField(3)
  double height;                // Rectangle height
}

@HiveType(typeId: 10)
enum AnnotationType {
  @HiveField(0)
  highlight,
  @HiveField(1)
  note,
  @HiveField(2)
  bookmark,
  @HiveField(3)
  underline,
  @HiveField(4)
  strikethrough
}

@HiveType(typeId: 11)
enum AnnotationColor {
  @HiveField(0)
  yellow,
  @HiveField(1)
  green,
  @HiveField(2)
  blue,
  @HiveField(3)
  red,
  @HiveField(4)
  purple,
  @HiveField(5)
  orange,
  @HiveField(6)
  pink,
  @HiveField(7)
  custom
}
```

### 2.4 User Settings Model
```dart
@HiveType(typeId: 12)
class UserSettings extends HiveObject {
  @HiveField(0)
  String id;                    // User settings identifier
  
  @HiveField(1)
  ReadingSettings readingSettings;
  
  @HiveField(2)
  AppearanceSettings appearanceSettings;
  
  @HiveField(3)
  LibrarySettings librarySettings;
  
  @HiveField(4)
  AnnotationSettings annotationSettings;
  
  @HiveField(5)
  PerformanceSettings performanceSettings;
  
  @HiveField(6)
  DateTime lastUpdated;         // Last settings update
  
  @HiveField(7)
  int settingsVersion;          // Settings schema version
}

@HiveType(typeId: 13)
class ReadingSettings extends HiveObject {
  @HiveField(0)
  double fontSize;              // Font size (8.0 - 72.0)
  
  @HiveField(1)
  String fontFamily;            // Font family name
  
  @HiveField(2)
  double lineHeight;            // Line spacing (1.0 - 3.0)
  
  @HiveField(3)
  double letterSpacing;         // Letter spacing (-2.0 - 2.0)
  
  @HiveField(4)
  double wordSpacing;           // Word spacing (-2.0 - 2.0)
  
  @HiveField(5)
  TextAlign textAlignment;      // Text alignment
  
  @HiveField(6)
  double pageMargins;           // Page margins (0.0 - 50.0)
  
  @HiveField(7)
  double paragraphSpacing;      // Paragraph spacing (0.0 - 20.0)
  
  @HiveField(8)
  bool hyphenation;             // Enable hyphenation
  
  @HiveField(9)
  bool justification;           // Text justification
  
  @HiveField(10)
  ScrollDirection scrollDirection; // Vertical/horizontal scrolling
  
  @HiveField(11)
  bool continuousScrolling;     // Continuous vs paginated
  
  @HiveField(12)
  double scrollSpeed;           // Scroll sensitivity
  
  @HiveField(13)
  bool autoBookmark;            // Auto-bookmark on close
  
  @HiveField(14)
  int autoSaveInterval;         // Auto-save progress interval (seconds)
}

@HiveType(typeId: 14)
class AppearanceSettings extends HiveObject {
  @HiveField(0)
  AppTheme theme;               // Light, dark, sepia, custom
  
  @HiveField(1)
  Color backgroundColor;        // Background color
  
  @HiveField(2)
  Color textColor;              // Text color
  
  @HiveField(3)
  Color accentColor;            // Accent/highlight color
  
  @HiveField(4)
  double brightness;            // Screen brightness (0.0 - 1.0)
  
  @HiveField(5)
  bool nightMode;               // Night mode enabled
  
  @HiveField(6)
  TimeOfDay nightModeStart;     // Night mode start time
  
  @HiveField(7)
  TimeOfDay nightModeEnd;       // Night mode end time
  
  @HiveField(8)
  bool fullScreen;              // Full screen reading
  
  @HiveField(9)
  bool showPageNumbers;         // Display page numbers
  
  @HiveField(10)
  bool showProgressBar;         // Display progress bar
  
  @HiveField(11)
  bool showClock;               // Display clock
  
  @HiveField(12)
  bool showBatteryStatus;       // Display battery status
  
  @HiveField(13)
  double uiScale;               // UI scale factor
}

@HiveType(typeId: 15)
class LibrarySettings extends HiveObject {
  @HiveField(0)
  LibraryViewMode viewMode;     // Grid, list, detailed
  
  @HiveField(1)
  LibrarySortOrder sortOrder;   // Title, author, date added, etc.
  
  @HiveField(2)
  bool sortAscending;           // Sort direction
  
  @HiveField(3)
  List<String> visibleColumns;  // Visible columns in list view
  
  @HiveField(4)
  int gridColumns;              // Number of grid columns
  
  @HiveField(5)
  double gridItemSize;          // Grid item size
  
  @HiveField(6)
  bool showCovers;              // Show book covers
  
  @HiveField(7)
  bool showProgress;            // Show reading progress
  
  @HiveField(8)
  bool showMetadata;            // Show book metadata
  
  @HiveField(9)
  List<String> hiddenBooks;     // Hidden book IDs
  
  @HiveField(10)
  String defaultImportPath;     // Default import directory
}

@HiveType(typeId: 16)
class AnnotationSettings extends HiveObject {
  @HiveField(0)
  AnnotationColor defaultHighlightColor;
  
  @HiveField(1)
  List<AnnotationColor> availableColors;
  
  @HiveField(2)
  bool autoSelectParagraph;     // Auto-select paragraph for notes
  
  @HiveField(3)
  bool showAnnotationTooltips;  // Show tooltips on hover
  
  @HiveField(4)
  bool exportIncludeMetadata;   // Include metadata in exports
  
  @HiveField(5)
  AnnotationExportFormat defaultExportFormat;
  
  @HiveField(6)
  bool syncAnnotations;         // Sync annotations (future)
  
  @HiveField(7)
  bool backupAnnotations;       // Auto-backup annotations
}

@HiveType(typeId: 17)
class PerformanceSettings extends HiveObject {
  @HiveField(0)
  int maxCacheSize;             // Maximum cache size (MB)
  
  @HiveField(1)
  int preloadPages;             // Pages to preload ahead
  
  @HiveField(2)
  bool enableAnimations;        // Enable UI animations
  
  @HiveField(3)
  bool hardwareAcceleration;    // Use hardware acceleration
  
  @HiveField(4)
  int maxConcurrentProcessing;  // Max concurrent reflow operations
  
  @HiveField(5)
  bool backgroundProcessing;    // Allow background processing
  
  @HiveField(6)
  int thumbnailQuality;         // Thumbnail quality (1-100)
  
  @HiveField(7)
  bool lowMemoryMode;           // Optimize for low memory devices
}

// Enums for Settings
@HiveType(typeId: 18)
enum AppTheme {
  @HiveField(0)
  light,
  @HiveField(1)
  dark,
  @HiveField(2)
  sepia,
  @HiveField(3)
  custom,
  @HiveField(4)
  system
}

@HiveType(typeId: 19)
enum LibraryViewMode {
  @HiveField(0)
  grid,
  @HiveField(1)
  list,
  @HiveField(2)
  detailed,
  @HiveField(3)
  compact
}

@HiveType(typeId: 20)
enum LibrarySortOrder {
  @HiveField(0)
  title,
  @HiveField(1)
  author,
  @HiveField(2)
  dateAdded,
  @HiveField(3)
  lastOpened,
  @HiveField(4)
  progress,
  @HiveField(5)
  rating,
  @HiveField(6)
  fileSize
}

@HiveType(typeId: 21)
enum AnnotationExportFormat {
  @HiveField(0)
  txt,
  @HiveField(1)
  markdown,
  @HiveField(2)
  pdf,
  @HiveField(3)
  json,
  @HiveField(4)
  csv
}

@HiveType(typeId: 22)
enum ScrollDirection {
  @HiveField(0)
  vertical,
  @HiveField(1)
  horizontal
}

@HiveType(typeId: 23)
enum TextAlign {
  @HiveField(0)
  left,
  @HiveField(1)
  center,
  @HiveField(2)
  right,
  @HiveField(3)
  justify
}
```

### 2.5 PDF Reflow Model
```dart
@HiveType(typeId: 24)
class ReflowDocument extends HiveObject {
  @HiveField(0)
  String id;                    // Unique identifier
  
  @HiveField(1)
  String bookId;                // Reference to original book
  
  @HiveField(2)
  String reflowFilePath;        // Path to reflow file
  
  @HiveField(3)
  List<ReflowPage> pages;       // Reflow page data
  
  @HiveField(4)
  DateTime createdDate;         // Creation timestamp
  
  @HiveField(5)
  DateTime lastModifiedDate;    // Last modification timestamp
  
  @HiveField(6)
  int version;                  // Reflow version number
  
  @HiveField(7)
  ReflowStatus status;          // Processing status
  
  @HiveField(8)
  ReflowQuality quality;        // Reflow quality assessment
  
  @HiveField(9)
  Map<String, dynamic> metadata; // Processing metadata
  
  @HiveField(10)
  List<ReflowError> errors;     // Processing errors/warnings
}

@HiveType(typeId: 25)
class ReflowPage extends HiveObject {
  @HiveField(0)
  int pageNumber;               // Original page number
  
  @HiveField(1)
  List<ReflowParagraph> paragraphs; // Page paragraphs
  
  @HiveField(2)
  List<ReflowImage> images;     // Page images
  
  @HiveField(3)
  List<ReflowTable> tables;     // Page tables
  
  @HiveField(4)
  Map<String, dynamic> metadata; // Page-specific metadata
}

@HiveType(typeId: 26)
class ReflowParagraph extends HiveObject {
  @HiveField(0)
  String id;                    // Unique paragraph identifier
  
  @HiveField(1)
  String text;                  // Paragraph text content
  
  @HiveField(2)
  ParagraphType type;           // Heading, body, caption, etc.
  
  @HiveField(3)
  TextStyle style;              // Text styling information
  
  @HiveField(4)
  int order;                    // Paragraph order on page
  
  @HiveField(5)
  double confidence;            // OCR/extraction confidence
  
  @HiveField(6)
  List<String> tags;            // Semantic tags
}

@HiveType(typeId: 27)
class ReflowImage extends HiveObject {
  @HiveField(0)
  String id;                    // Unique image identifier
  
  @HiveField(1)
  String imagePath;             // Path to extracted image
  
  @HiveField(2)
  String? caption;              // Image caption
  
  @HiveField(3)
  double width;                 // Original width
  
  @HiveField(4)
  double height;                // Original height
  
  @HiveField(5)
  int order;                    // Image order on page
  
  @HiveField(6)
  ImageType type;               // Photo, diagram, chart, etc.
}

@HiveType(typeId: 28)
class ReflowTable extends HiveObject {
  @HiveField(0)
  String id;                    // Unique table identifier
  
  @HiveField(1)
  List<List<String>> data;      // Table data (rows x columns)
  
  @HiveField(2)
  List<String>? headers;        // Column headers
  
  @HiveField(3)
  String? caption;              // Table caption
  
  @HiveField(4)
  int order;                    // Table order on page
}

@HiveType(typeId: 29)
class ReflowError extends HiveObject {
  @HiveField(0)
  ErrorType type;               // Error type
  
  @HiveField(1)
  String message;               // Error message
  
  @HiveField(2)
  int? pageNumber;              // Page where error occurred
  
  @HiveField(3)
  String? context;              // Additional context
}

// Enums for Reflow
@HiveType(typeId: 30)
enum ReflowStatus {
  @HiveField(0)
  pending,
  @HiveField(1)
  processing,
  @HiveField(2)
  completed,
  @HiveField(3)
  failed,
  @HiveField(4)
  partiallyCompleted
}

@HiveType(typeId: 31)
enum ReflowQuality {
  @HiveField(0)
  excellent,
  @HiveField(1)
  good,
  @HiveField(2)
  fair,
  @HiveField(3)
  poor
}

@HiveType(typeId: 32)
enum ParagraphType {
  @HiveField(0)
  heading1,
  @HiveField(1)
  heading2,
  @HiveField(2)
  heading3,
  @HiveField(3)
  body,
  @HiveField(4)
  caption,
  @HiveField(5)
  footnote,
  @HiveField(6)
  quote,
  @HiveField(7)
  listItem
}

@HiveType(typeId: 33)
enum ImageType {
  @HiveField(0)
  photo,
  @HiveField(1)
  diagram,
  @HiveField(2)
  chart,
  @HiveField(3)
  graph,
  @HiveField(4)
  illustration,
  @HiveField(5)
  screenshot
}

@HiveType(typeId: 34)
enum ErrorType {
  @HiveField(0)
  ocrError,
  @HiveField(1)
  layoutError,
  @HiveField(2)
  imageError,
  @HiveField(3)
  tableError,
  @HiveField(4)
  textExtractionError
}
```

### 2.6 Library Collection Model
```dart
@HiveType(typeId: 35)
class Library extends HiveObject {
  @HiveField(0)
  String id;                    // Library identifier
  
  @HiveField(1)
  String name;                  // Library name
  
  @HiveField(2)
  List<String> bookIds;         // List of book IDs
  
  @HiveField(3)
  DateTime createdDate;         // Creation date
  
  @HiveField(4)
  DateTime lastModifiedDate;    // Last modification date
  
  @HiveField(5)
  LibraryStatistics statistics; // Library statistics
  
  @HiveField(6)
  Map<String, dynamic> metadata; // Additional metadata
}

@HiveType(typeId: 36)
class LibraryStatistics extends HiveObject {
  @HiveField(0)
  int totalBooks;               // Total number of books
  
  @HiveField(1)
  int booksRead;                // Number of completed books
  
  @HiveField(2)
  int booksReading;             // Number of books currently reading
  
  @HiveField(3)
  int totalPages;               // Total pages across all books
  
  @HiveField(4)
  int pagesRead;                // Total pages read
  
  @HiveField(5)
  int totalReadingTime;         // Total reading time in seconds
  
  @HiveField(6)
  double averageRating;         // Average book rating
  
  @HiveField(7)
  Map<BookFormat, int> formatCounts; // Count by format
  
  @HiveField(8)
  DateTime lastUpdated;         // Last statistics update
}
```

---

## 3. Data Relationships

### 3.1 Entity Relationship Diagram
```
Library (1) ──────── (N) Book
Book (1) ──────────── (1) ReadingProgress
Book (1) ──────────── (N) Annotation
Book (1) ──────────── (0..1) ReflowDocument
ReadingProgress (1) ── (N) ReadingSession
ReflowDocument (1) ─── (N) ReflowPage
ReflowPage (1) ─────── (N) ReflowParagraph
ReflowPage (1) ─────── (N) ReflowImage
ReflowPage (1) ─────── (N) ReflowTable
Annotation (1) ─────── (1) AnnotationPosition
UserSettings (1) ───── (1) ReadingSettings
UserSettings (1) ───── (1) AppearanceSettings
UserSettings (1) ───── (1) LibrarySettings
UserSettings (1) ───── (1) AnnotationSettings
UserSettings (1) ───── (1) PerformanceSettings
```

### 3.2 Key Relationships
- **Book → ReadingProgress**: One-to-one relationship tracking reading state
- **Book → Annotations**: One-to-many relationship for user annotations
- **Book → ReflowDocument**: Optional one-to-one for PDF reflow data
- **Library → Books**: One-to-many relationship for library organization
- **UserSettings**: Centralized settings management

---

## 4. Data Storage Implementation

### 4.1 Hive Box Structure
```dart
// Box names and their corresponding data types
const String BOOKS_BOX = 'books';                    // Box<Book>
const String PROGRESS_BOX = 'reading_progress';      // Box<ReadingProgress>
const String ANNOTATIONS_BOX = 'annotations';        // Box<Annotation>
const String REFLOW_BOX = 'reflow_documents';       // Box<ReflowDocument>
const String SETTINGS_BOX = 'user_settings';        // Box<UserSettings>
const String LIBRARY_BOX = 'libraries';             // Box<Library>
```

### 4.2 Indexing Strategy
```dart
// Create indexes for efficient querying
void setupIndexes() {
  // Index books by format
  Hive.box<Book>(BOOKS_BOX).values
    .where((book) => book.format == BookFormat.pdf)
    .toList();
  
  // Index annotations by book
  Hive.box<Annotation>(ANNOTATIONS_BOX).values
    .where((annotation) => annotation.bookId == bookId)
    .toList();
  
  // Index reading progress by book
  Hive.box<ReadingProgress>(PROGRESS_BOX).values
    .where((progress) => progress.bookId == bookId)
    .toList();
}
```

### 4.3 Data Migration Strategy
```dart
class DataMigration {
  static Future<void> migrateToVersion(int targetVersion) async {
    switch (targetVersion) {
      case 2:
        await _migrateToV2();
        break;
      case 3:
        await _migrateToV3();
        break;
      // Add more migration cases as needed
    }
  }
  
  static Future<void> _migrateToV2() async {
    // Migration logic for version 2
    // Add new fields, transform existing data, etc.
  }
  
  static Future<void> _migrateToV3() async {
    // Migration logic for version 3
  }
}
```

---

## 5. Data Access Layer

### 5.1 Repository Pattern Implementation
```dart
abstract class BookRepository {
  Future<List<Book>> getAllBooks();
  Future<Book?> getBookById(String id);
  Future<void> saveBook(Book book);
  Future<void> deleteBook(String id);
  Future<List<Book>> searchBooks(String query);
  Future<List<Book>> getBooksByFormat(BookFormat format);
  Future<List<Book>> getBooksByStatus(BookStatus status);
}

abstract class AnnotationRepository {
  Future<List<Annotation>> getAnnotationsByBook(String bookId);
  Future<void> saveAnnotation(Annotation annotation);
  Future<void> deleteAnnotation(String id);
  Future<List<Annotation>> searchAnnotations(String query);
  Future<List<Annotation>> getAnnotationsByType(AnnotationType type);
}

abstract class ProgressRepository {
  Future<ReadingProgress?> getProgressByBook(String bookId);
  Future<void> saveProgress(ReadingProgress progress);
  Future<void> updateProgress(String bookId, double position, int page);
  Future<List<ReadingProgress>> getRecentProgress(int limit);
  Future<LibraryStatistics> calculateStatistics();
}

abstract class ReflowRepository {
  Future<ReflowDocument?> getReflowByBook(String bookId);
  Future<void> saveReflowDocument(ReflowDocument document);
  Future<void> deleteReflowDocument(String bookId);
  Future<List<ReflowDocument>> getPendingReflows();
  Future<void> updateReflowStatus(String bookId, ReflowStatus status);
}

abstract class SettingsRepository {
  Future<UserSettings> getUserSettings();
  Future<void> saveUserSettings(UserSettings settings);
  Future<T> getSetting<T>(String key, T defaultValue);
  Future<void> setSetting<T>(String key, T value);
  Future<void> resetToDefaults();
}
```

### 5.2 Service Layer Implementation
```dart
class BookService {
  final BookRepository _bookRepository;
  final ProgressRepository _progressRepository;
  final ReflowRepository _reflowRepository;
  
  BookService(this._bookRepository, this._progressRepository, this._reflowRepository);
  
  Future<Book> importBook(String filePath) async {
    // Extract metadata from file
    final metadata = await _extractMetadata(filePath);
    
    // Create book object
    final book = Book(
      id: _generateId(),
      title: metadata['title'] ?? _getFilenameWithoutExtension(filePath),
      author: metadata['author'],
      format: _detectFormat(filePath),
      filePath: filePath,
      addedDate: DateTime.now(),
      status: BookStatus.notStarted,
      // ... other fields
    );
    
    // Save book
    await _bookRepository.saveBook(book);
    
    // Initialize reading progress
    final progress = ReadingProgress(
      id: _generateId(),
      bookId: book.id,
      currentPage: 0,
      currentPosition: 0.0,
      progressPercentage: 0.0,
      lastReadDate: DateTime.now(),
      sessions: [],
      lastReadingMode: ReadingMode.original,
      positionData: {},
      wordsRead: 0,
      averageReadingSpeed: 200.0, // Default WPM
    );
    
    await _progressRepository.saveProgress(progress);
    
    // Queue for reflow processing if PDF
    if (book.format == BookFormat.pdf) {
      await _queueForReflow(book);
    }
    
    return book;
  }
  
  Future<void> _queueForReflow(Book book) async {
    final reflowDoc = ReflowDocument(
      id: _generateId(),
      bookId: book.id,
      reflowFilePath: '',
      pages: [],
      createdDate: DateTime.now(),
      lastModifiedDate: DateTime.now(),
      version: 1,
      status: ReflowStatus.pending,
      quality: ReflowQuality.good,
      metadata: {},
      errors: [],
    );
    
    await _reflowRepository.saveReflowDocument(reflowDoc);
    
    // Trigger background reflow processing
    ReflowProcessor.instance.queueForProcessing(book.id);
  }
}

class AnnotationService {
  final AnnotationRepository _annotationRepository;
  
  AnnotationService(this._annotationRepository);
  
  Future<Annotation> createHighlight(
    String bookId, 
    String selectedText, 
    AnnotationPosition position, 
    AnnotationColor color
  ) async {
    final annotation = Annotation(
      id: _generateId(),
      bookId: bookId,
      type: AnnotationType.highlight,
      selectedText: selectedText,
      position: position,
      color: color,
      createdDate: DateTime.now(),
      lastModifiedDate: DateTime.now(),
      tags: [],
      isPublic: false,
      pageNumber: position.pageNumber ?? 0,
      readingMode: ReadingMode.original,
      metadata: {},
    );
    
    await _annotationRepository.saveAnnotation(annotation);
    return annotation;
  }
  
  Future<Annotation> createNote(
    String bookId,
    String? selectedText,
    String userNote,
    AnnotationPosition position
  ) async {
    final annotation = Annotation(
      id: _generateId(),
      bookId: bookId,
      type: AnnotationType.note,
      selectedText: selectedText,
      userNote: userNote,
      position: position,
      color: AnnotationColor.yellow,
      createdDate: DateTime.now(),
      lastModifiedDate: DateTime.now(),
      tags: [],
      isPublic: false,
      pageNumber: position.pageNumber ?? 0,
      readingMode: ReadingMode.original,
      metadata: {},
    );
    
    await _annotationRepository.saveAnnotation(annotation);
    return annotation;
  }
  
  Future<List<Annotation>> exportAnnotations(
    String bookId, 
    AnnotationExportFormat format
  ) async {
    final annotations = await _annotationRepository.getAnnotationsByBook(bookId);
    
    switch (format) {
      case AnnotationExportFormat.markdown:
        await _exportToMarkdown(annotations);
        break;
      case AnnotationExportFormat.pdf:
        await _exportToPdf(annotations);
        break;
      case AnnotationExportFormat.json:
        await _exportToJson(annotations);
        break;
      // ... other formats
    }
    
    return annotations;
  }
}

class ReflowService {
  final ReflowRepository _reflowRepository;
  
  ReflowService(this._reflowRepository);
  
  Future<ReflowDocument> processReflow(String bookId) async {
    final book = await _getBookById(bookId);
    if (book?.format != BookFormat.pdf) {
      throw Exception('Reflow only supported for PDF files');
    }
    
    // Update status to processing
    await _reflowRepository.updateReflowStatus(bookId, ReflowStatus.processing);
    
    try {
      // Extract text and structure from PDF
      final pages = await _extractPdfContent(book.filePath);
      
      // Process each page
      final reflowPages = <ReflowPage>[];
      for (int i = 0; i < pages.length; i++) {
        final page = await _processPage(pages[i], i + 1);
        reflowPages.add(page);
      }
      
      // Create reflow document
      final reflowDoc = ReflowDocument(
        id: _generateId(),
        bookId: bookId,
        reflowFilePath: await _saveReflowData(bookId, reflowPages),
        pages: reflowPages,
        createdDate: DateTime.now(),
        lastModifiedDate: DateTime.now(),
        version: 1,
        status: ReflowStatus.completed,
        quality: _assessQuality(reflowPages),
        metadata: {
          'totalPages': reflowPages.length,
          'totalParagraphs': reflowPages.fold(0, (sum, page) => sum + page.paragraphs.length),
          'totalImages': reflowPages.fold(0, (sum, page) => sum + page.images.length),
        },
        errors: [],
      );
      
      await _reflowRepository.saveReflowDocument(reflowDoc);
      return reflowDoc;
      
    } catch (e) {
      await _reflowRepository.updateReflowStatus(bookId, ReflowStatus.failed);
      rethrow;
    }
  }
  
  Future<ReflowPage> _processPage(dynamic pageData, int pageNumber) async {
    // Extract paragraphs
    final paragraphs = <ReflowParagraph>[];
    for (final textBlock in pageData['textBlocks']) {
      final paragraph = ReflowParagraph(
        id: _generateId(),
        text: textBlock['text'],
        type: _determineParagraphType(textBlock),
        style: _extractTextStyle(textBlock),
        order: textBlock['order'],
        confidence: textBlock['confidence'] ?? 1.0,
        tags: _generateSemanticTags(textBlock['text']),
      );
      paragraphs.add(paragraph);
    }
    
    // Extract images
    final images = <ReflowImage>[];
    for (final imageData in pageData['images']) {
      final image = ReflowImage(
        id: _generateId(),
        imagePath: await _extractAndSaveImage(imageData),
        caption: imageData['caption'],
        width: imageData['width'],
        height: imageData['height'],
        order: imageData['order'],
        type: _determineImageType(imageData),
      );
      images.add(image);
    }
    
    // Extract tables
    final tables = <ReflowTable>[];
    for (final tableData in pageData['tables']) {
      final table = ReflowTable(
        id: _generateId(),
        data: _parseTableData(tableData),
        headers: tableData['headers'],
        caption: tableData['caption'],
        order: tableData['order'],
      );
      tables.add(table);
    }
    
    return ReflowPage(
      pageNumber: pageNumber,
      paragraphs: paragraphs,
      images: images,
      tables: tables,
      metadata: {
        'originalPage': pageNumber,
        'processingTime': DateTime.now().millisecondsSinceEpoch,
      },
    );
  }
}
```

---

## 6. Data Validation & Constraints

### 6.1 Model Validation
```dart
mixin ValidationMixin {
  List<String> validate();
  
  bool get isValid => validate().isEmpty;
  
  String get validationErrors => validate().join(', ');
}

extension BookValidation on Book {
  List<String> validate() {
    final errors = <String>[];
    
    if (title.trim().isEmpty) {
      errors.add('Title cannot be empty');
    }
    
    if (title.length > 500) {
      errors.add('Title cannot exceed 500 characters');
    }
    
    if (!File(filePath).existsSync()) {
      errors.add('Book file does not exist');
    }
    
    if (fileSize <= 0) {
      errors.add('File size must be greater than 0');
    }
    
    if (rating < 0 || rating > 5) {
      errors.add('Rating must be between 0 and 5');
    }
    
    return errors;
  }
}

extension AnnotationValidation on Annotation {
  List<String> validate() {
    final errors = <String>[];
    
    if (bookId.trim().isEmpty) {
      errors.add('Book ID cannot be empty');
    }
    
    if (type == AnnotationType.note && 
        (userNote?.trim().isEmpty ?? true) && 
        (selectedText?.trim().isEmpty ?? true)) {
      errors.add('Note must have either user note or selected text');
    }
    
    if (type == AnnotationType.highlight && 
        (selectedText?.trim().isEmpty ?? true)) {
      errors.add('Highlight must have selected text');
    }
    
    if (position.startOffset < 0 || position.endOffset < 0) {
      errors.add('Position offsets cannot be negative');
    }
    
    if (position.startOffset >= position.endOffset) {
      errors.add('Start offset must be less than end offset');
    }
    
    return errors;
  }
}
```

### 6.2 Data Constraints
```dart
class DataConstraints {
  // Book constraints
  static const int MAX_TITLE_LENGTH = 500;
  static const int MAX_AUTHOR_LENGTH = 200;
  static const int MAX_DESCRIPTION_LENGTH = 2000;
  static const int MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
  static const List<String> SUPPORTED_FORMATS = ['.pdf', '.epub', '.mobi'];
  
  // Annotation constraints
  static const int MAX_NOTE_LENGTH = 10000;
  static const int MAX_SELECTED_TEXT_LENGTH = 5000;
  static const int MAX_TAGS_PER_ANNOTATION = 10;
  static const int MAX_TAG_LENGTH = 50;
  
  // Settings constraints
  static const double MIN_FONT_SIZE = 8.0;
  static const double MAX_FONT_SIZE = 72.0;
  static const double MIN_LINE_HEIGHT = 0.8;
  static const double MAX_LINE_HEIGHT = 3.0;
  static const double MIN_BRIGHTNESS = 0.1;
  static const double MAX_BRIGHTNESS = 1.0;
  
  // Performance constraints
  static const int MAX_CACHE_SIZE_MB = 1024;
  static const int MAX_PRELOAD_PAGES = 10;
  static const int MAX_CONCURRENT_REFLOWS = 3;
  static const int MAX_ANNOTATIONS_PER_BOOK = 10000;
}
```

---

## 7. Data Backup & Recovery

### 7.1 Backup Strategy
```dart
class BackupService {
  static const String BACKUP_FOLDER = 'backups';
  
  Future<String> createFullBackup() async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final backupPath = '$BACKUP_FOLDER/full_backup_$timestamp.zip';
    
    final backup = BackupData(
      version: 1,
      timestamp: DateTime.now(),
      books: await _getAllBooks(),
      progress: await _getAllProgress(),
      annotations: await _getAllAnnotations(),
      settings: await _getUserSettings(),
      reflows: await _getAllReflows(),
    );
    
    await _saveBackupToFile(backup, backupPath);
    return backupPath;
  }
  
  Future<void> restoreFromBackup(String backupPath) async {
    final backup = await _loadBackupFromFile(backupPath);
    
    // Validate backup compatibility
    if (!_isCompatible(backup.version)) {
      throw Exception('Backup version not compatible');
    }
    
    // Clear existing data
    await _clearAllData();
    
    // Restore data
    await _restoreBooks(backup.books);
    await _restoreProgress(backup.progress);
    await _restoreAnnotations(backup.annotations);
    await _restoreSettings(backup.settings);
    await _restoreReflows(backup.reflows);
  }
  
  Future<void> createIncrementalBackup(DateTime since) async {
    // Backup only changes since last backup
    final changes = await _getChangesSince(since);
    
    final backup = IncrementalBackup(
      version: 1,
      timestamp: DateTime.now(),
      since: since,
      changes: changes,
    );
    
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final backupPath = '$BACKUP_FOLDER/incremental_backup_$timestamp.zip';
    
    await _saveIncrementalBackup(backup, backupPath);
  }
}

@HiveType(typeId: 50)
class BackupData extends HiveObject {
  @HiveField(0)
  int version;
  
  @HiveField(1)
  DateTime timestamp;
  
  @HiveField(2)
  List<Book> books;
  
  @HiveField(3)
  List<ReadingProgress> progress;
  
  @HiveField(4)
  List<Annotation> annotations;
  
  @HiveField(5)
  UserSettings settings;
  
  @HiveField(6)
  List<ReflowDocument> reflows;
}
```

### 7.2 Data Recovery
```dart
class RecoveryService {
  Future<List<String>> scanForCorruption() async {
    final issues = <String>[];
    
    // Check book files
    final books = await _getAllBooks();
    for (final book in books) {
      if (!File(book.filePath).existsSync()) {
        issues.add('Missing book file: ${book.title}');
      }
      
      if (book.fileHash != null) {
        final currentHash = await _calculateFileHash(book.filePath);
        if (currentHash != book.fileHash) {
          issues.add('File integrity issue: ${book.title}');
        }
      }
    }
    
    // Check orphaned data
    final orphanedAnnotations = await _findOrphanedAnnotations();
    if (orphanedAnnotations.isNotEmpty) {
      issues.add('Found ${orphanedAnnotations.length} orphaned annotations');
    }
    
    final orphanedProgress = await _findOrphanedProgress();
    if (orphanedProgress.isNotEmpty) {
      issues.add('Found ${orphanedProgress.length} orphaned progress records');
    }
    
    return issues;
  }
  
  Future<void> repairData() async {
    // Remove orphaned annotations
    final orphanedAnnotations = await _findOrphanedAnnotations();
    for (final annotation in orphanedAnnotations) {
      await _deleteAnnotation(annotation.id);
    }
    
    // Remove orphaned progress
    final orphanedProgress = await _findOrphanedProgress();
    for (final progress in orphanedProgress) {
      await _deleteProgress(progress.id);
    }
    
    // Rebuild indexes
    await _rebuildIndexes();
    
    // Recalculate statistics
    await _recalculateStatistics();
  }
}
```

---

## 8. Performance Optimization

### 8.1 Caching Strategy
```dart
class CacheManager {
  static const int MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  static const int MAX_CACHE_ITEMS = 1000;
  
  final Map<String, CacheItem> _cache = {};
  final Queue<String> _accessOrder = Queue();
  
  T? get<T>(String key) {
    if (_cache.containsKey(key)) {
      _updateAccessOrder(key);
      return _cache[key]?.data as T?;
    }
    return null;
  }
  
  void put<T>(String key, T data, {Duration? ttl}) {
    final item = CacheItem(
      data: data,
      timestamp: DateTime.now(),
      ttl: ttl,
      size: _calculateSize(data),
    );
    
    _cache[key] = item;
    _updateAccessOrder(key);
    _evictIfNecessary();
  }
  
  void _evictIfNecessary() {
    // Remove expired items
    _cache.removeWhere((key, item) => item.isExpired);
    
    // Remove oldest items if cache is full
    while (_cache.length > MAX_CACHE_ITEMS || _getTotalSize() > MAX_CACHE_SIZE) {
      if (_accessOrder.isEmpty) break;
      final oldestKey = _accessOrder.removeFirst();
      _cache.remove(oldestKey);
    }
  }
}

class CacheItem {
  final dynamic data;
  final DateTime timestamp;
  final Duration? ttl;
  final int size;
  
  CacheItem({
    required this.data,
    required this.timestamp,
    this.ttl,
    required this.size,
  });
  
  bool get isExpired {
    if (ttl == null) return false;
    return DateTime.now().difference(timestamp) > ttl!;
  }
}
```

### 8.2 Data Loading Optimization
```dart
class LazyLoadingManager {
  Future<List<Book>> loadBooksLazily({
    int page = 0,
    int pageSize = 20,
    String? searchQuery,
    LibrarySortOrder? sortOrder,
  }) async {
    final offset = page * pageSize;
    
    // Build query
    var query = Hive.box<Book>('books').values.asQueryable();
    
    // Apply search filter
    if (searchQuery != null && searchQuery.isNotEmpty) {
      query = query.where((book) => 
        book.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
        (book.author?.toLowerCase().contains(searchQuery.toLowerCase()) ?? false)
      );
    }
    
    // Apply sorting
    if (sortOrder != null) {
      query = _applySorting(query, sortOrder);
    }
    
    // Apply pagination
    return query.skip(offset).take(pageSize).toList();
  }
  
  Stream<List<Annotation>> loadAnnotationsStream(String bookId) async* {
    const batchSize = 50;
    int offset = 0;
    
    while (true) {
      final batch = await Hive.box<Annotation>('annotations')
        .values
        .where((annotation) => annotation.bookId == bookId)
        .skip(offset)
        .take(batchSize)
        .toList();
      
      if (batch.isEmpty) break;
      
      yield batch;
      offset += batchSize;
    }
  }
}
```

---

## 9. Data Schema Evolution

### 9.1 Versioning Strategy
```dart
class SchemaVersion {
  static const int CURRENT_VERSION = 3;
  static const String VERSION_KEY = 'schema_version';
  
  static Future<void> checkAndMigrate() async {
    final currentVersion = await _getCurrentVersion();
    
    if (currentVersion < CURRENT_VERSION) {
      await _performMigration(currentVersion, CURRENT_VERSION);
    }
  }
  
  static Future<void> _performMigration(int from, int to) async {
    for (int version = from + 1; version <= to; version++) {
      await _migrateToVersion(version);
    }
    
    await _setCurrentVersion(to);
  }
  
  static Future<void> _migrateToVersion(int version) async {
    switch (version) {
      case 2:
        await _migrateV1ToV2();
        break;
      case 3:
        await _migrateV2ToV3();
        break;
    }
  }
  
  static Future<void> _migrateV1ToV2() async {
    // Add new fields to existing models
    // Transform data structures
    // Update indexes
  }
  
  static Future<void> _migrateV2ToV3() async {
    // Add reflow document support
    // Update annotation position structure
    // Add new settings fields
  }
}
```

This comprehensive data model provides a solid foundation for your Flutter Book Reader App, supporting all the requirements outlined in the PRD while maintaining flexibility for future enhancements. The model emphasizes offline-first design, data integrity, and performance optimization across all supported platforms.
