# 📝 Feature: Media Logging Lifecycle

> **Tag**: #feature #logging #diary
> **Related Notes**: [[Movies]], [[TV Series]], [[Games]], [[Add and Edit Entry Modal]], [[Ratings and Reviews]]

## Purpose
The central activity of Logger: logging an entertainment title (movie, TV series, or video game) into the user's permanent diary.

## Status: Implemented
- **Primary Source Files**: `index.html` (`openModal()`, `saveEntry()`, `fsSave()`)

## Logging Lifecycle
1. **Initiation**: User taps the center floating `+` button or selects a title from [[Universal Search]].
2. **Prefill**: If chosen from search, `openModal(null, prefillItem)` pre-populates title, poster, year, genre, and TMDB/IGDB IDs.
3. **Type-Specific Fields**:
   - *Movies*: Watched status, 5-tier rating slider, date picker, notes, favorite toggle.
   - *TV Series*: Season picker up to last watched season, automatic episode counts.
   - *Games*: Status options (*Completed, Started, Ongoing, Dropped, Backlog*).
4. **Rewatch Detection**:
   - The app scans existing `DATA` for matching title and media type.
   - If logging a previously finished movie or lower/equal TV season, automatically assigns `rewatched: true` and displays an indigo badge.
5. **Persistence**:
   - Generates unique ID (`Date.now()`).
   - Appends to in-memory `DATA`.
   - Updates `localStorage.getItem('lgr_cache_' + uid)`.
   - Dispatches async write to Firestore: `users/{uid}/entries/{id}`.
   - Triggers quick sync cloud icon animation (`flashCloud()`).
