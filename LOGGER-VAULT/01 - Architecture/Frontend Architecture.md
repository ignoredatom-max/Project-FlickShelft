# 💻 Frontend Architecture — Single-File SPA Design

> **Tag**: #frontend #architecture #spa
> **Related Notes**: [[Application Shell]], [[State Management]], [[Routing Architecture]], [[ADR-001 Single-File Frontend Architecture]]

The frontend of Logger is contained within a single file: `../index.html`.

## Structural Segments
1. **Embedded Stylesheet (`<style>`)**:
   - Contains ~5,800 lines of modular CSS.
   - Organized into distinct sections: Design Tokens, Navigation, Headers, Rows, Modals, Overlays, Responsive Queries.
2. **HTML View Containers (`<div class="page" id="page-*">`)**:
   - Multi-page layout rendered as distinct container elements.
   - Visible page is marked with `.page.on` (`display: block`); inactive pages have `display: none`.
3. **Overlays and Modals**:
   - Independent full-screen overlays (`#addModal`, `#deepOverlay`, `#movieWallOverlay`, `#diarySearchOverlay`) stacked above pages using z-index layers.
4. **Modular Script (`<script type="module">`)**:
   - ES6 module syntax importing Firebase SDK from Google gstatic CDN.
   - Encapsulates state variables, event handlers, rendering engines, and lifecycle listeners.
