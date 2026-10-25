# 🛡️ Firebase Security Rules

> **Tag**: #firebase #security #rules
> **Related Notes**: [[Firestore Database]], [[Security and Privacy]]

## Policy Architecture
1. **User Diary Entries (`users/{uid}/entries/{id}`)**:
   - `read`: Allowed publicly if `request.auth != null` OR if read is directed to public viewing.
   - `write`: Strictly restricted to `request.auth.uid == uid`.
2. **Profile Metadata (`users/{uid}/meta/profile`)**:
   - `read`: Allowed publicly so public profiles (`?u=UID`) can load avatars and Top Picks.
   - `write`: Restricted to document owner.
3. **Watchlist (`users/{uid}/meta/watchlist`)**:
   - `read / write`: Restricted to document owner.
