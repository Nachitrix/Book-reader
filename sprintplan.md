# 🏃‍♂️ One-Day Agile Sprint Plan: Cross-Platform Book Reader App (MVP)

## ✅ Objective

Build a **cross-platform book reader application** in **1 day** (8–12 hours) with the following core features:

* User login & device sync
* Upload & read PDF/ePub/MOBI files
* Annotations, highlights, and comments
* Reading progress tracking
* Cloud sync
* Theme, font, and reading mode settings

## ⌚ Sprint Duration

* **Sprint Length:** 1 Day (12 Hours max)
* **Team Size:** 2–4 Developers (Frontend + Backend + Fullstack)

---

## Ὄb Sprint Backlog (Task Breakdown by Hour)

### ✅ 1. Sprint Planning (30 mins)

* Define MVP scope
* Delegate work roles
* Confirm stack: React Native (Expo), Firebase, Firestore, PDF/ePub libraries
* Setup GitHub repo and shared Notion/Jira board

---

### ✅ 2. Environment Setup (30 mins)

**Owner:** DevOps / All Devs

* Initialize React Native (Expo)
* Create Firebase project (Auth + Firestore + Storage)
* Install packages:

  * `react-native-pdf`, `epubjs`, `react-native-document-picker`
  * `firebase`, `expo-font`, `tailwind`

---

### ✅ 3. Database Schema & Firebase Rules (60 mins)

**Owner:** Backend Dev

* Define collections:

  * `users`, `devices`, `books`, `book_files`, `annotations`, `highlights`, `comments`, `bookmarks`, `reading_progress`, `user_settings`
* Implement Firebase rules for per-user security
* Create test entries with dummy data

---

### ✅ 4. Authentication & Sync Setup (90 mins)

**Owner:** Fullstack Dev

* Implement Firebase Auth (email + Google OAuth)
* Register devices with metadata
* Setup sync: upload/download JSON snapshots to/from Firestore

---

### ✅ 5. Book Upload & Metadata (60 mins)

**Owner:** Backend/Fullstack Dev

* UI: Upload file + metadata form
* Store file in Firebase Storage
* Create DB entries in `books` and `book_files`

---

### ✅ 6. Reader UI with Format Support (120 mins)

**Owner:** Frontend Dev

* PDF reader: `react-native-pdf`
* EPUB reader: `epubjs` webview embed
* MOBI fallback: Convert to EPUB/PDF or display placeholder
* UI Mode: Long scroll / Page-flip toggle

---

### ✅ 7. Annotation, Highlight, Comment Tools (90 mins)

**Owner:** Frontend Dev

* Highlight text (if EPUB/PDF format supported)
* Attach notes (Annotation)
* Freeform comments at locations (page number, offset)
* Sync to Firestore

---

### ✅ 8. Reading Progress & Bookmarks (45 mins)

**Owner:** Frontend Dev

* Track scroll/pagination position
* Store `reading_progress` document (with `percent_complete`, `last_location`)
* Bookmark screen with list

---

### ✅ 9. Settings (Theme, Font, Mode) (45 mins)

**Owner:** Frontend Dev

* UI to set:

  * Theme (light/dark/sepia)
  * Font (serif/sans-serif)
  * Font size & line height
  * Reading mode: scroll/book
* Save to `user_settings`

---

### ✅ 10. Sync Engine (Annotations, Progress) (60 mins)

**Owner:** Fullstack Dev

* On app load: fetch data
* On close/save: upload data
* Background sync (every 2 min or manual refresh)

---

### ✅ 11. Testing, Debugging, Polish (60 mins)

**Owner:** All Devs

* Manual test: all flows
* Bug fixes for crashing or sync errors
* UI polish: alignment, icons, spacing

---

### ✅ 12. Sprint Review + Handoff (30 mins)

**Owner:** All

* Demo app to teammates or client
* Document known issues, future features
* Push final code and export builds

---

## 🌟 Key Deliverables

* Functional login, cloud sync, and book reader
* File upload and metadata storage
* Annotation + highlight + comment system
* Reading customization options
* Cross-device progress tracking

## ⚖️ Tools & Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React Native (Expo)          |
| Backend        | Firebase Firestore + Storage |
| Auth           | Firebase Auth                |
| Book Rendering | react-native-pdf, epubjs     |
| Sync           | Firestore Realtime Updates   |
| UI Library     | Tailwind / NativeBase        |

---

Let me know if you want a Trello, Jira CSV, or Notion board version of this plan.
