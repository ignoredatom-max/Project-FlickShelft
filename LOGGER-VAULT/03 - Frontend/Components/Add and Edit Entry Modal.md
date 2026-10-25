# 🧩 Component: Add and Edit Entry Modal (`#addModal`)

> **Tag**: #component #modal #entry-form
> **Related Notes**: [[Media Logging]], [[Ratings and Reviews]], [[TV Series]]

## Purpose
Floating squircle sheet used to create a new diary log entry or edit an existing one.

## Implementation Details
- **Source**: `index.html` (`openModal()`, `closeModal()`, `saveEntry()`)
- **Top-Anchored Squircle Layout**: Positioned at `calc(32px + env(safe-area-inset-top))` with optical center offset to stay completely clear of mobile on-screen keyboards.
- **Form Controls**:
  - Live title search integration with autocomplete suggestions.
  - Media type toggle (Film, Series, Game).
  - Status selector (Watched, Finished, Completed, Watching, Started, Dropped).
  - TV Season picker (automatically fetches and lists seasons from TMDB).
  - Tactile 5-tier rating slider with colored track fill.
  - Multiline notes and review quote input.
  - Favorite toggle switch.
