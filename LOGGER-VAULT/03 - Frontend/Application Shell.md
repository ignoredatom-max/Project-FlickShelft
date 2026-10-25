# 🖥️ Frontend: Application Shell

> **Tag**: #frontend #component #shell
> **Related Notes**: [[Navigation System]], [[Styling and Design Tokens]], [[UI and UX Patterns]]

## Purpose
The container structure that encloses all pages, manages safe-area insets, sticky headers, and viewport containment.

## Implementation Details
- **Source**: `index.html` (Markup lines ~5860-5940, CSS lines ~520-550)
- **Sticky Header Block (`.sticky-header`)**:
  - Encapsulates the logo, dynamic media counters (Films, Series, Games), and toolbar controls.
  - `position: sticky; top: 0; z-index: 860;`
  - Dynamic scroll darkening: on scrolling > 10px, JavaScript toggles `.is-scrolled`, transitioning background to deeper opacity with dynamic box shadow.
- **Scroll Isolation**:
  - Body uses `overflow-x: hidden; -webkit-font-smoothing: antialiased;`.
  - Switching tabs resets window scroll position via `window.scrollTo(0, 0)`.
