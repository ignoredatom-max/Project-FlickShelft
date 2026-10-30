# 📄 Page: Watchlist Page (`#page-watchlist`)

> **Tag**: #page #watchlist #gestures
> **Related Notes**: [[Watchlist]], [[Deep Media Info Card]]

## Purpose
Managing queued entertainment titles, release countdowns, and quick-logging gestures.

## Implementation Details
- **Source**: `index.html` (Markup lines ~5870-5905, JS lines ~7710-8250)
- **Sections**:
  1. **Sticky Header Filter**: Segmented pill bar (`All`, `Film`, `Series`, `Game`) with live matching title counter badge and category-specific empty state messaging.
  2. **Upcoming Release Countdown**: Carousel cards (130px width, 16px corner radius) with blurred backdrop poster art and days-remaining badges.
  3. **Watchlist Items List**:
     - Dedicated touch drag handle for vertical reordering.
     - Swipe right reveals green check to instantly log.
     - Swipe left reveals red trash to remove from watchlist (with undo toast).
     - Compact 72px row pitch layout preserving full **15px bold typography parity** with the main Diary log page.
