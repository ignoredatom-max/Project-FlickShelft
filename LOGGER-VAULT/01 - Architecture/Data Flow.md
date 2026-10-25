# 🔄 Data Flow — Lifecycle Pipelines

> **Tag**: #data-flow #architecture
> **Related Notes**: [[State Management]], [[Data Lifecycle and Synchronization]], [[Universal Search]]

## 1. App Startup & Diary Boot Flow
1. User opens app -> `bootCacheRead()` scans `localStorage` for `lgr_cache_` keys.
2. Cached array loaded into in-memory `DATA` array.
3. `renderLog()` builds the DOM instantly (0ms latency).
4. Firebase Auth resolves user login state via `onAuthStateChanged`.
5. Firestore `onSnapshot` listener subscribes to `users/{uid}/entries`.
6. Remote entries update in-memory `DATA` and overwrite `localStorage` cache.
7. `renderLog()` refreshes diary view silently if differences exist.

## 2. Universal Search Flow
1. User enters text in `#diarySearchInput`.
2. Input is debounced by 280ms.
3. Frontend issues parallel requests:
   - `fetch(`${API_BASE}/api/search/movie?query=...`)`
   - `fetch(`${API_BASE}/api/search/tv?query=...`)`
   - `fetch(`${API_BASE}/api/search/collection?query=...`)`
   - `fetch(`${API_BASE}/api/search/game?query=...`)`
   - Local array filter across `DATA`
4. Worker validates and queries upstream APIs.
5. Search results merged, ranked, and rendered in `#diarySearchResults`.
