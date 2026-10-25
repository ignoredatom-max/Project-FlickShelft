# 📦 State Management — Global State & Persistence

> **Tag**: #state #frontend #persistence
> **Related Notes**: [[Data Models]], [[Local Storage Schemas]], [[Firestore Database]]

State in Logger is maintained globally within the module scope of `index.html`:

## Primary State Variables
- `DATA` (Array): In-memory list of all diary entries for the active user.
- `WL` (Array): In-memory list of watchlist items.
- `currentUser` (Object): Firebase Auth user credentials.
- `PUBLIC_UID` (String|null): UID extracted from URL query parameter.
- `filter` (String): Active media type filter on diary log (`all`, `movie`, `series`, `game`).
- `sortBy` (String): Active diary sorting order (`new`, `old`, `rate`, `az`).
- `_wallFilter` (String): Active category filter on the Movie Wall.

## Synchronization Pipeline
State modifications (e.g. `fsSave()`, `saveWL()`) follow an **optimistic local update pattern**:
1. Update in-memory array immediately.
2. Re-render affected view.
3. Write to `localStorage`.
4. Asynchronously commit to Cloud Firestore.
