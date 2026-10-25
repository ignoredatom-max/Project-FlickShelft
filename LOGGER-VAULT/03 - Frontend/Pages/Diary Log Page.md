# 📄 Page: Diary Log Page (`#page-log`)

> **Tag**: #page #diary #letterboxd
> **Related Notes**: [[Media Logging]], [[Ratings and Reviews]], [[Deep Media Info Card]]

## Purpose
The primary home screen of Logger. Displays the user's chronological diary of logged movies, series, and games.

## Implementation Details
- **Source**: `index.html` (Markup lines ~5860-5941, JS lines ~7630-7700)
- **Layout Structure**:
  1. Sticky Header Block (`#logStickyHeader`): Displays live title counts, filter bar (All, Film, Series, Game), universal search trigger, Movie Wall trigger, settings trigger, and sort selector.
  2. Sticky Month Separators (`.month-header`): Shows month & year on the left with a faint right-aligned item counter (`.month-count`). Sticks seamlessly below the main header as the user scrolls.
  3. Letterboxd-Style Entry Rows (`.row`):
     - Left: Day number of log date.
     - Poster: 40x60px thumbnail with lazy loading.
     - Center: Title with gradient fade, release year, note icon, and type badge.
     - Right: Emotive rating badge, status pill, and inline favorite heart button.
- **Interactions**: Tapping a row opens the [[Deep Media Info Card]]. Tapping the heart toggles favorite status without opening modals.
