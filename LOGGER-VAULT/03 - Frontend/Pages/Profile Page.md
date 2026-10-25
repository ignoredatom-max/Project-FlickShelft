# 📄 Page: Profile Page (`#page-profile`)

> **Tag**: #page #profile #stats
> **Related Notes**: [[User Profiles]], [[Favorites and Top Picks]]

## Purpose
Personal showcase displaying aggregate statistics, Top Picks 4-poster showcase, animated count-up tickers, and profile activity graphs.

## Implementation Details
- **Source**: `index.html` (Markup lines ~6046-6180, JS lines ~9770-10400)
- **Sections**:
  1. **Profile Header**: Avatar, inline editable display name, and "Copy Link" button for public sharing.
  2. **Top Picks**: 4-poster showcase with empty slot selectors.
  3. **Segmented Statistics**: Total Logged, Films, Series, and Games counts animated on entry via `animateStatCountUp()`.
  4. **Activity Graph**: Interactive bar chart breakdown of monthly activity with 6-Month, 12-Month, and All-Time range filters.
  5. **Mini Sticky Header**: On scrolling down, avatar and name smoothly collapse into a compact sticky bar.
