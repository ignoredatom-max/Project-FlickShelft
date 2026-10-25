# 📁 Firestore Collections & Document Paths

> **Tag**: #firestore #schema
> **Related Notes**: [[Firestore Database]], [[Security Rules]]

- **User Diary Entries**: `users/{uid}/entries/{entryId}`
  - Each entry stored as an individual document.
  - Document ID matches entry timestamp ID.
- **Watchlist**: `users/{uid}/meta/watchlist`
  - Single document containing an array of `items`.
- **Profile Metadata**: `users/{uid}/meta/profile`
  - Single document containing `name`, `pfp`, and `picks`.
