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
5. **Compact Typography-Preserved Layout**:
   - Sleek **72px vertical row pitch** (`padding: 7px 10px; margin-bottom: 6px; border-radius: 14px`), matching the compact height rhythm of the main Diary log page.
   - **Full typography parity with Diary log**: Titles are preserved at **15px, bold (font-weight 700)** with letter-spacing `-0.3px`, and subtitles at **12px**, ensuring readability and visual hierarchy without text miniaturization.
   - Proportional **36×52px poster thumbnails** with 7px corner radius matching Diary proportions.
   - Accessible **36×36px drag handle** and calibrated **70px swipe threshold** for swift one-handed actions.
   - Upcoming release cards preserved at original spacious design (**130px width**, 16px corner radius, 72px backdrop-blur header, 22px countdown numerals).
