
---

# 📚 Cross-Platform Book Reader App – Data Model

This document outlines the relational data model for a cloud-synced book reader app supporting PDF, EPUB, and MOBI formats with annotation, highlight, bookmarks, and device-specific sync.

---

## 📐 Entity Overview

### Core Entities:

* `User`
* `Device`
* `Book`
* `BookFile`
* `Folder` (optional for user organization)
* `Highlight`
* `Annotation`
* `Comment`
* `Bookmark`
* `ReadingProgress`
* `UserSetting`

---

## 📊 Schema Definition

### 🧑 `User`

Stores authentication and profile data.

| Field           | Type      | Constraints                    |
| --------------- | --------- | ------------------------------ |
| user\_id        | UUID (PK) | Primary Key                    |
| email           | VARCHAR   | Unique, Not Null               |
| password\_hash  | TEXT      | Nullable (for OAuth users)     |
| name            | VARCHAR   | Optional                       |
| oauth\_provider | VARCHAR   | Optional (e.g., Google, Apple) |
| oauth\_id       | VARCHAR   | Optional OAuth ID              |
| created\_at     | TIMESTAMP | Default: current timestamp     |
| last\_login     | TIMESTAMP | Timestamp of last login        |

---

### 💻 `Device`

Tracks registered devices for a user.

| Field        | Type      | Constraints                                  |
| ------------ | --------- | -------------------------------------------- |
| device\_id   | UUID (PK) | Primary Key                                  |
| user\_id     | UUID (FK) | References `User.user_id`, on delete CASCADE |
| device\_type | ENUM      | One of: `mobile`, `desktop`, `web`           |
| device\_name | VARCHAR   | Device name (e.g., "Pixel 7", "Chrome")      |
| last\_sync   | TIMESTAMP | Last sync timestamp                          |

---

### 📁 `Folder`

Optional user folders for book organization.

| Field       | Type      | Constraints                                  |
| ----------- | --------- | -------------------------------------------- |
| folder\_id  | UUID (PK) | Primary Key                                  |
| user\_id    | UUID (FK) | References `User.user_id`, on delete CASCADE |
| name        | VARCHAR   | Folder name                                  |
| created\_at | TIMESTAMP | Default: current timestamp                   |

---

### 📘 `Book`

Metadata about a book.

| Field             | Type      | Constraints                                  |
| ----------------- | --------- | -------------------------------------------- |
| book\_id          | UUID (PK) | Primary Key                                  |
| user\_id          | UUID (FK) | References `User.user_id`, on delete CASCADE |
| title             | VARCHAR   | Not Null                                     |
| author            | VARCHAR   | Optional                                     |
| cover\_image\_url | TEXT      | Optional cloud URL                           |
| format            | ENUM      | One of: `pdf`, `epub`, `mobi`                |
| folder\_id        | UUID (FK) | References `Folder.folder_id`, nullable      |
| uploaded\_at      | TIMESTAMP | Default: current timestamp                   |

---

### 📂 `BookFile`

Details about the uploaded book file.

| Field             | Type      | Constraints                                  |
| ----------------- | --------- | -------------------------------------------- |
| file\_id          | UUID (PK) | Primary Key                                  |
| book\_id          | UUID (FK) | References `Book.book_id`, on delete CASCADE |
| storage\_url      | TEXT      | Cloud storage URL                            |
| file\_size\_bytes | BIGINT    | File size in bytes                           |
| checksum          | VARCHAR   | File integrity hash                          |
| uploaded\_at      | TIMESTAMP | Default: current timestamp                   |

---

### ✨ `Highlight`

User-generated text highlights.

| Field            | Type      | Constraints                    |
| ---------------- | --------- | ------------------------------ |
| highlight\_id    | UUID (PK) | Primary Key                    |
| book\_id         | UUID (FK) | References `Book.book_id`      |
| user\_id         | UUID (FK) | References `User.user_id`      |
| color            | VARCHAR   | E.g., `yellow`, `blue`         |
| start\_location  | TEXT      | EPUB CFI or PDF location start |
| end\_location    | TEXT      | EPUB CFI or PDF location end   |
| content\_snippet | TEXT      | Cached text for context        |
| created\_at      | TIMESTAMP | Default: current timestamp     |

---

### 📝 `Annotation`

Notes or comments tied to locations or highlights.

| Field                 | Type      | Constraints                                   |
| --------------------- | --------- | --------------------------------------------- |
| annotation\_id        | UUID (PK) | Primary Key                                   |
| book\_id              | UUID (FK) | References `Book.book_id`                     |
| user\_id              | UUID (FK) | References `User.user_id`                     |
| target\_location      | TEXT      | Location in book (EPUB CFI or PDF pos)        |
| note\_text            | TEXT      | User's note text                              |
| linked\_highlight\_id | UUID (FK) | Optional, references `Highlight.highlight_id` |
| created\_at           | TIMESTAMP | Default: current timestamp                    |
| updated\_at           | TIMESTAMP | Optional, set on edit                         |

---

### 💬 `Comment`

Standalone text comments.

| Field       | Type      | Constraints                       |
| ----------- | --------- | --------------------------------- |
| comment\_id | UUID (PK) | Primary Key                       |
| book\_id    | UUID (FK) | References `Book.book_id`         |
| user\_id    | UUID (FK) | References `User.user_id`         |
| location    | TEXT      | Book location (e.g., page or CFI) |
| text        | TEXT      | Comment content                   |
| created\_at | TIMESTAMP | Default: current timestamp        |

---

### 🔖 `Bookmark`

User-saved bookmarks.

| Field        | Type      | Constraints                  |
| ------------ | --------- | ---------------------------- |
| bookmark\_id | UUID (PK) | Primary Key                  |
| book\_id     | UUID (FK) | References `Book.book_id`    |
| user\_id     | UUID (FK) | References `User.user_id`    |
| name         | VARCHAR   | Optional user-provided label |
| location     | TEXT      | Location in book             |
| created\_at  | TIMESTAMP | Default: current timestamp   |

---

### 📈 `ReadingProgress`

Tracks the last position and percent read.

| Field             | Type      | Constraints                |
| ----------------- | --------- | -------------------------- |
| progress\_id      | UUID (PK) | Primary Key                |
| book\_id          | UUID (FK) | References `Book.book_id`  |
| user\_id          | UUID (FK) | References `User.user_id`  |
| last\_location    | TEXT      | CFI or PDF location        |
| percent\_complete | FLOAT     | Value between 0.0 and 1.0  |
| last\_read\_at    | TIMESTAMP | Default: current timestamp |

---

### ⚙️ `UserSetting`

Reader configuration per user.

| Field         | Type      | Constraints                             |
| ------------- | --------- | --------------------------------------- |
| setting\_id   | UUID (PK) | Primary Key                             |
| user\_id      | UUID (FK) | References `User.user_id`               |
| theme         | ENUM      | One of: `light`, `dark`, `sepia`        |
| font\_family  | VARCHAR   | Font style, e.g., `serif`, `sans-serif` |
| font\_size    | INTEGER   | Font size in px or pt                   |
| line\_spacing | FLOAT     | Line spacing (e.g., 1.2, 1.5)           |
| reading\_mode | ENUM      | One of: `book`, `scroll`                |
| created\_at   | TIMESTAMP | Default: current timestamp              |

---

## 🧭 Entity Relationships Diagram (Text Form)

```
User ─────┐
          ├──< Device
          ├──< Folder ───< Book
          ├──────────────< Book ───< BookFile
          │                         ├──< Highlight ──┐
          │                         ├──< Annotation <┘
          │                         ├──< Comment
          │                         ├──< Bookmark
          │                         └──< ReadingProgress
          └──< UserSetting
```

---

## 🛡️ Notes

* **UUID** is used as primary key across all tables for scalability.
* **All content** (books, highlights, etc.) is **scoped per user** using `user_id`.
* **Location fields** should support:

  * EPUB: [EPUB CFI](https://idpf.org/epub/linking/cfi/epub-cfi.html)
  * PDF: Page numbers and position offsets
* All `TIMESTAMP` fields default to `CURRENT_TIMESTAMP` for auditing and syncing.
* Use foreign key cascading where appropriate (`ON DELETE CASCADE`).

---
