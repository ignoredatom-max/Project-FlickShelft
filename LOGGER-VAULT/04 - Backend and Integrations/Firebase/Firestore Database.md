# 🗄️ Firestore Database

> **Tag**: #firebase #firestore #database
> **Related Notes**: [[Firestore Collections]], [[Data Models]], [[Security Rules]]

## Implementation Details
- **SDK**: `https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js`.
- **Data Collections**:
  - `users/{uid}/entries/{id}`: Individual diary logs.
  - `users/{uid}/meta/watchlist`: Watchlist document.
  - `users/{uid}/meta/profile`: Custom profile name and Top Picks.
- **Sync Mechanism**: Real-time `onSnapshot` listeners ensure bidirectional multi-device synchronization.
