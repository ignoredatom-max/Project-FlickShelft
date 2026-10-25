# 🧩 Component Relationships — UI Hierarchy

> **Tag**: #components #ui-hierarchy
> **Related Notes**: [[Application Shell]], [[Navigation System]], [[Diary Log Page]], [[Add and Edit Entry Modal]]

The UI architecture follows a strict hierarchy of shell, active page views, and global overlays:

1. **Application Shell** ([[Application Shell]]):
   - Houses the top dynamic glass sticky header and bottom navigation dock ([[Navigation System]]).
2. **Page Views** (`.page`):
   - [[Diary Log Page]] (`#page-log`) — Default diary view with Letterboxd rows.
   - [[Watchlist Page]] (`#page-watchlist`) — Drag-and-drop watchlist and upcoming cards.
   - [[Favourites Page]] (`#page-favs`) — Filtered favorites list.
   - [[Calendar Page]] (`#page-calendar`) — Monthly grid with poster thumbnails.
   - [[Profile Page]] (`#page-profile`) — User stats, avatar, and Top Picks.
3. **Overlays & Modals**:
   - [[Add and Edit Entry Modal]] (`#addModal`) — Modal for adding/editing items.
   - [[Deep Media Info Card]] (`#deepOverlay`) — Full encyclopedia media sheet.
   - [[Movie Wall Overlay]] (`#movieWallOverlay`) — Full-screen poster mosaic.
   - [[Universal Search Overlay]] (`#diarySearchOverlay`) — Global multi-source search.
   - [[Settings and About Modal]] (`#settingsModal`) — System settings and ATOMYN support.
