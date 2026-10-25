# 📄 Page: Watchlist Page (`#page-watchlist`)

> **Tag**: #page #watchlist #gestures
> **Related Notes**: [[Watchlist]], [[Deep Media Info Card]]

## Purpose
Managing queued entertainment titles, release countdowns, and quick-logging gestures.

## Implementation Details
- **Source**: `index.html` (Markup lines ~5942-5980, JS lines ~8100-8600)
- **Sections**:
  1. **Upcoming Release Countdown**: Carousel cards with blurred backdrop poster art and days-remaining badges.
  2. **Watchlist Items List**:
     - Dedicated touch drag handle for vertical reordering.
     - Swipe right reveals green check to instantly log.
     - Swipe left reveals red trash to remove from watchlist (with undo toast).
