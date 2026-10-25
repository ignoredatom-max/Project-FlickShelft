# 🔐 Feature: Authentication & Sessions

> **Tag**: #feature #auth #firebase
> **Related Notes**: [[Firebase Authentication]], [[Security Rules]], [[User Profiles]]

## Purpose
Provides user identity, secure personal diary storage, and seamless synchronization across devices using Google OAuth.

## Status: Implemented
- **Primary Source Files**: `index.html` (lines ~6840-7050)
- **Dependencies**: Firebase Auth SDK (`https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js`)

## Architecture & Implementation
1. **Google Sign-In**:
   - Initialized via `signInWithPopup(auth, new GoogleAuthProvider())`.
   - On authorization, Firebase triggers `onAuthStateChanged(auth, async user => ...)`.
   - Populates global `currentUser`, attaches real-time Firestore listeners, and loads user profile metadata.
2. **Guest Mode**:
   - `Continue as guest` allows in-app exploratory usage without authentication.
   - Activates an in-memory diary session; sets a persistent warning banner that entries will not be preserved across refreshes.
3. **Session Persistence**:
   - Firebase maintains local token persistence in IndexedDB.
   - On page load, `onAuthStateChanged` re-authenticates automatically without user intervention.

## Important Constraints
- `OWNER_UID = 'kFMRmHi4hzakOaQFx7ccanUsIbl1'`: Aditya's permanent fallback UID. If a guest opens the app without `?u=` or login, this diary provides sample content.
