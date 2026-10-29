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
4. **Media Type Segmented Filtering**:
   - iOS-style segmented pill bar in the sticky header (`All`, `Film`, `Series`, `Game`) aligned with the Diary header design.
   - Synchronized filtering for both the Upcoming Releases countdown carousel and the main released list.
   - Live matching counter badge (`X titles`, `X films`, `X series`, `X games`) with tailored empty state messages and icons per media category.
   - Preserves subset priority drag-and-drop reordering when reordering items while a filter is active.
5. **Ultra-Compact Ergonomic Layout**:
   - Ultra-sleek **56px card height** / **62px vertical row pitch** (`padding: 5px 8px; margin-bottom: 4px;` — a **37% total height reduction** from original 98px), enabling **8–10 items** to fit in the viewport.
   - Proportional **32×46px poster thumbnails** with 6px corner radius.
   - Accessible **32×32px drag handle** and calibrated **62px swipe threshold** for swift one-handed actions.
   - Ultra-compact upcoming carousel cards (**100px width**, 44px header blur, 17px countdown numeral).
