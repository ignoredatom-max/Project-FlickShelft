# 📌 Feature: Watchlist & Upcoming Releases

> **Tag**: #feature #watchlist
> **Related Notes**: [[Watchlist Page]], [[Media Logging]]

## Purpose
Organizing titles the user plans to watch or play, featuring touch reordering, countdown banners, and swipe gestures.

## Status: Implemented
- **Primary Source Files**: `index.html` (`renderWL()`, `saveWL()`)
- **Storage**: Firestore (`users/{uid}/meta/watchlist`) + `localStorage['logger-wl']`.

## Sub-Features
1. **Upcoming Countdown Grid**:
   - Filter items with future release dates.
   - Displays countdown badges (e.g. `In 12 days`, `Tomorrow`) with blurred poster backgrounds.
2. **iOS Touch Drag Reordering**:
   - Dedicated drag handle on each item allows direct drag-and-drop vertical sorting on touchscreens.
3. **Swipe Gesture Actions**:
   - Swipe right: reveals green check button to quickly log the item into the diary.
   - Swipe left: reveals red trash button to delete from watchlist, with an undo toast notification.
