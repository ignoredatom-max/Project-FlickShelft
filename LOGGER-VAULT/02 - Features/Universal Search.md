# 🔎 Feature: Universal Search

> **Tag**: #feature #search
> **Related Notes**: [[Universal Search Overlay]], [[TMDB Integration]], [[IGDB Integration]]

## Purpose
A single full-screen unified search interface that simultaneously queries all external media databases and existing local diary entries.

## Status: Implemented
- **Primary Source Files**: `index.html` (`openDiarySearch()`, `runDiarySearch()`)
- **Trigger**: Search icon in sticky toolbar or pressing `/` shortcut.

## Behavior & Execution
1. **Input Debounce**: Keystrokes debounced by 280ms to avoid saturating edge API limits.
2. **Parallel Fan-Out**:
   - Queries TMDB movies (`/api/search/movie`).
   - Queries TMDB television (`/api/search/tv`).
   - Queries TMDB collections (`/api/search/collection`).
   - Queries IGDB games (`/api/search/game`).
   - Filters local `DATA` array for existing logged matches.
3. **Result Highlighting**:
   - If a franchise collection is detected, surfaces a featured "Collection Card" at the top of results.
   - If a title already exists in the user's diary, displays a "Logged" status indicator badge.
