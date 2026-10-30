# 📜 Changelog — Version History & Major Milestones

> **Tag**: `#changelog` `#history`
> **Related Notes**: [[HOME]], [[CURRENT-STATE]], [[Feature Evolution]], [[Bug Fix History]]

This document records the chronological development history of **Logger** (Project-FlickShelft) from its initial release to the present day.

---

## 🏷️ Release History

### October 2026 — Performance Overhaul, Movie Wall & Second Brain
- **Watchlist Media Filter & Typography Parity Layout**: Introduced segmented filter pill bar (`All`, `Film`, `Series`, `Game`) in the sticky header with synchronized upcoming carousel and live counters. Refined card spacing to a compact 72px row pitch while strictly preserving full **15px bold typography parity** with the main Diary log page, and maintained the original spacious 130px upcoming carousel layout.
- **Movie Wall Feature**: Replaced the canvas-based Universe Graph View with a 100% native DOM [[Movie Wall]]. Displays all logged media posters edge-to-edge with no labels, responsive 4-column mobile grid, and zero scroll lag.
- **Collection Snapshot Generator**: Added high-resolution (1080px) collection picture exporter with Logger branding, user profile title, total count badge, and native mobile share integration via `navigator.share`.
- **Faint Month Counter**: Added subtle `.month-count` badge to the right side of `.month-header` separators showing total logged titles per month.
- **Sticky Month Separators Bugfix**: Removed CSS `transform` from `.page.on` fade-in animation to eliminate transformed containing block issues that disabled `position: sticky`.
- **Logger Second Brain**: Established the portable [[HOME|LOGGER-VAULT]] Obsidian technical knowledge base.

---

### September / Early October 2026 — UI Polish & Touch Interactions
- **Watchlist Swipe Actions**: Implemented smooth horizontal swipe-to-delete (red trash reveal) and swipe-to-log (green check reveal) with haptic feedback.
- **Sliding Nav Indicator**: Added animated sliding white capsule behind active nav icons.
- **iOS Drag-and-Drop Reordering**: Added dedicated touch drag handle to watchlist items for effortless list sorting without opening modals.
- **Dynamic Glassmorphism Blur**: Upgraded sticky headers to dynamically darken and blur on scroll (`.sticky-header.is-scrolled`).
- **Tactile Card Press**: Added spring-based scale down effects (`scale(0.96)`) on interactive media cards.
- **Animated Number Ticker**: Added smooth cubic-bezier count-up animation to profile statistics.

---

### v2.1.1 (15 August 2026) — Calendar Overhaul & Navigation Refinement
- **Navigation Redesign**: Moved Add action to center floating FAB in the bottom dock; dedicated Calendar tab added.
- **Calendar Visual Overhaul**: Logged entries appear as poster thumbnails directly on calendar date cells with `+N` multi-item overflow indicator.
- **Rating Slider Improvements**: Thicker track, color-coded progress fill, enhanced mobile touch responsiveness.
- **Profile Activity Graph Ranges**: Added time range toggles (Last 6 Months, Last 12 Months, All Time) with monthly media breakdown.
- **Soft Keyboard Handling**: Anchored floating modal card to prevent Android on-screen keyboard from obscuring rating, notes, or action buttons.

---

### v2.1.0 (15 August 2026) — Cloudflare Worker API & IGDB Migration
- **Cloudflare Worker API Proxy**: Introduced `logger-proxy` worker to bypass Indian ISP DNS blocks on TMDB and game endpoints without requiring user VPNs.
- **IGDB Migration**: Migrated video game database from RAWG to Twitch IGDB v4. Implemented Twitch OAuth client credentials caching.
- **Smart Game Search & Ranking**: Added acronym expansion (`gta`, `rdr2`, `botw`, `gow`), fuzzy wildcard fallback, and relevance scoring to filter out DLCs, skins, and editions.
- **Graceful Upstream Fallbacks**: Timeouts return safe empty lists rather than crashing frontend components.

---

### v2.0.1 (25 March 2026) — Rewatch Logic & Glassmorphism
- **Rewatch Detection**: Logging a new season of a previously logged series no longer erroneously marks it as Rewatched.
- **Frosted Sticky Headers**: Sticky headers on Log, Watchlist, and Favourites gained frosted glass backdrop blur.
- **Stats Redesign**: Taller rating bars, rounded corners, higher contrast count numbers.

---

### v1.9.1 (23 March 2026) — Guest Mode & Instant Cache
- **Guest Mode**: Added in-app browsing mode without signing into Firebase.
- **Support & Contact Card**: Tapping ATOMYN signature opens developer contact sheet (email, Discord, Instagram, Telegram).
- **Instant Boot Cache**: Boot script scans all `lgr_cache_<uid>` keys, rendering the diary instantly on the first frame before Firestore sync.
- **Upcoming Watchlist Sync**: Real-time sync between watchlist additions and the upcoming countdown banner.

---

### v1.7.0 – v1.8.1 (March 2026) — Public Profiles & Letterboxd Polish
- **Public Profile URLs (`?u=UID`)**: Allowed users to share their diary in read-only mode via URL parameters.
- **Custom Display Name**: Inline editing of profile name saved directly to Firestore metadata.
- **Avatar Compression**: Images compressed to 200x200px before uploading to prevent Firestore document size bloat.
- **Letterboxd-Style Diary**: Tight row spacing, day numbers, poster thumbnails, and type color stripes.

---

### v1.0.0 (11 March 2026) — Initial Release
- **Core Diary**: Logging movies, series, and games with 5-stage rating (Skip, Mediocre, Decent, Excellent, Peak).
- **Initial Sync**: Local storage and early Firebase sync.
- **Android PWA**: Web manifest and installability on mobile home screens.
