# 🔐 Firebase Authentication

> **Tag**: #firebase #auth
> **Related Notes**: [[Authentication]], [[Security Rules]]

## Implementation Details
- **Provider**: Google OAuth (`GoogleAuthProvider`).
- **SDK**: Loaded directly via gstatic ES modules (`https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js`).
- **Configuration**:
  - `projectId: "movie-logs"`
  - `authDomain: "movie-logs.firebaseapp.com"`
- **State Handling**: `onAuthStateChanged` listener resolves session, assigns `currentUser`, and triggers Firestore listeners.
