# 📌 Product Backlog: Cross-Platform Book Reader App

## 🧱 Epic 1: User Authentication

### US-1.1: Sign Up

* As a user, I want to sign up with email or OAuth so I can create an account.
* **Acceptance Criteria:** Email/password and Google OAuth supported. Success/failure messages shown.

### US-1.2: Login

* As a user, I want to log in securely so I can access my personal library.
* **Acceptance Criteria:** Secure token-based auth, session maintained across sessions.

### US-1.3: Persistent Login

* As a user, I want to remain logged in on my device until I log out.
* **Acceptance Criteria:** Auth token stored securely; auto-login on next open.

---

## 🧱 Epic 2: Book Management

### US-2.1: Upload Book

* As a user, I want to upload a PDF, ePub, or Mobi file to read.
* **Acceptance Criteria:** Supported formats only, feedback on upload success.

### US-2.2: View Library

* As a user, I want to view a list of uploaded books.
* **Acceptance Criteria:** Shows title, author, format, cover image.

### US-2.3: Organize Books

* As a user, I want to delete or move books into folders.
* **Acceptance Criteria:** Book can be moved to folder or deleted with confirmation.

---

## 🧱 Epic 3: Book Reader Interface

### US-3.1: Open Book

* As a user, I want to open any supported book format to read.
* **Acceptance Criteria:** Viewer loads and renders file in app.

### US-3.2: Reading Modes

* As a user, I want to switch between long-scroll and book-flip mode.
* **Acceptance Criteria:** Toggle available in reader UI.

### US-3.3: Font Customization

* As a user, I want to change font size and style.
* **Acceptance Criteria:** Changes apply instantly and persist.

### US-3.4: Theme Switch

* As a user, I want to change the theme (light, dark, sepia).
* **Acceptance Criteria:** Theme changes immediately and saves to user profile.

---

## 🧱 Epic 4: Annotation System

### US-4.1: Highlight Text

* As a user, I want to highlight selected text.
* **Acceptance Criteria:** Highlight saves color, position, text snippet.

### US-4.2: Add Notes

* As a user, I want to add notes to highlights.
* **Acceptance Criteria:** Notes attached to highlight; editable.

### US-4.3: Add Comments

* As a user, I want to comment on any location.
* **Acceptance Criteria:** Comment saved independently of highlight.

### US-4.4: Add Bookmarks

* As a user, I want to bookmark a page.
* **Acceptance Criteria:** Bookmark appears in a separate view.

---

## 🧱 Epic 5: Sync & Settings

### US-5.1: Sync Progress

* As a user, I want my reading progress to sync across devices.
* **Acceptance Criteria:** Position saved to cloud and restored on new login.

### US-5.2: Sync Annotations

* As a user, I want highlights, comments, and bookmarks to sync.
* **Acceptance Criteria:** Edits persist across device logins.

### US-5.3: Sync Settings

* As a user, I want to retain my theme and font settings across devices.
* **Acceptance Criteria:** UI preferences synced to account.

---

