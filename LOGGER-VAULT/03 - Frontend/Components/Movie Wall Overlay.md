# 🧩 Component: Movie Wall Overlay (`#movieWallOverlay`)

> **Tag**: #component #movie-wall #gallery
> **Related Notes**: [[Movie Wall]], [[Sharing and Snapshots]], [[ADR-006 Replacing Graph View with Native DOM Movie Wall]]

## Purpose
Full-screen overlay presenting all logged media posters in an edge-to-edge mosaic with zero labels.

## Implementation Details
- **Source**: `index.html` (`openMovieWall()`, `renderMovieWall()`, `showWallTooltip()`, `shareMovieWall()`)
- **Key Attributes**:
  - **Zero Scroll / Single Viewport**: The overlay Stage (`.wall-stage`) contains the entire collection in one view without scrollbars.
  - **Dynamic Geometric Fitting**: Calculates optimal columns, rows, poster width, and height to fill the stage dimensions cleanly.
  - **Scale-Aware Styling**: Corner radius and hover zoom dynamically adapt based on poster size.
  - **Cinematic Tooltip**: Floating popover showing title, year, and rating on desktop hover.
  - **Ultra-Compact Mobile Header**: Single-row compact bar preserving maximum screen area for posters.
  - **Lazy loading (`loading="lazy"`, `decoding="async"`)** using retina thumbnails (`/t/p/w185/`).
  - **"Share" button** triggering high-resolution 1080px canvas collage generation.
