# 📜 Changelog — Version History & Major Milestones

> **Tag**: `#changelog` `#history`
> **Related Notes**: [[HOME]], [[CURRENT-STATE]], [[Feature Evolution]], [[Bug Fix History]]

This document records the chronological development history of **Logger** (Project-FlickShelft) from its initial release to the present day.

---

## 🏷️ Release History

### November 2026 — Comprehensive SVG Icon System & Zero-Emoji Overhaul
- **Full Emoji Elimination**: Replaced all user-facing emojis throughout the app with bespoke, modern, inline SVG icons and clean typography.
- **SVG Heart Favourites System**: Replaced legacy emoji hearts (`❤️`/`🤍`) in log rows, favourites view, and detail sheets with crisp, hardware-accelerated vector SVGs (`renderFavHeartSvg`) featuring smooth scaling transitions on tap.
- **Modern Action & Status Icons**:
  - Replaced modal share & delete emojis with clean SVG Share and Trash vectors.
  - Replaced status dropdown emojis (`⚡`, `♾️`, `🏆`, `❌`, `🎬`, `📺`) with clean typography (`Started`, `Ongoing`, `Completed`, `Dropped`, `Watched`, `Watching`, `Finished`).
  - Upgraded timeline journey badges with dedicated inline SVGs (Zap, Check, Clock, TV).
- **Settings & About Modals**: Replaced legacy emoji icons (`🔑`, `🔄`, `🎬`, `🎮`, `🙋`, `📧`, `📸`, `✈️`) with crisp SVGs for Google Auth, sync, data providers, and social platforms (Instagram, Discord, Telegram).
- **Placeholders & Empty States**: Replaced all fallback poster and avatar emojis with vector placeholders (`getMediaSvgIcon(type)`, SVG User avatar, SVG TV).
- **Precision Close Buttons**: Upgraded all modal, sheet, and search close buttons (`✕`) to sharp high-DPI SVG cross vectors.
- **Consistent Certification Tags**: Replaced OS-inconsistent flag emojis with standardized ISO country code pills (e.g., `US`, `GB`, `JP`, `INTL`).

### November 2026 — Web Checklist Audit, Dynamic Titles, Clickable Logo & Custom 404
- **Dynamic Document Page Titles**: Added context-aware page titles across the app. Switching tabs updates the title to `Logger · Diary`, `Logger · Watchlist`, `Logger · Calendar`, etc.; opening a media detail sheet dynamically updates to `${title} (${year}) · Logger`; viewing public profiles sets `${Name}'s Diary · Logger`.
- **Clickable Header Logo**: Added `.logo-clickable` styling (`cursor: pointer`, tactile scaling on tap) to the main and scrolled mini header logos. Tapping smoothly navigates back to Diary (`#page-log`), updates the dock indicator, and scrolls to top.
- **Dedicated Public Profile 404 State**: Introduced `#pubNotFound` card displaying a clean error state (*"Diary Not Found — This media diary does not exist, has been removed, or the link is incorrect"*) with a "Return to Logger" button when visiting invalid or private `?u=...` URLs.
- **Social Sharing & SEO Metadata**: Added `<meta name="description">`, OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`), and Twitter Card metadata for rich link previews across messaging and social platforms.
- **Desktop Favicon Link**: Declared standard `<link rel="shortcut icon" type="image/png" href="icon-192.png">` and `sizes="32x32"` for universal browser tab support.
- **Dynamic Copyright Year**: Integrated dynamic JavaScript year synchronization (`© <year> ATOMYN · All rights reserved`) in the About modal and public footer.
- **Design & Contrast Polish**: Preserved intentional touch carousels (Upcoming shelf, Top Picks, Cast & Crew, Calendar Heatmap) and glassmorphic blurs while eliminating artificial design tropes.

### November 2026 — High-Contrast Spring Navigation, 4-Tier Rating Scale & Seamless Data Migration
- **Bottom Navigation Dock Visual Redesign**: Upgraded active indicator to a solid pure white (`#ffffff`) pill with bold solid black (`#000000`, 700) active tab text and icons for maximum contrast. Added physics-based playful spring animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Top Segment Filter Bars**: Applied the identical solid pure white sliding pill, bold black active text, and playful spring interaction to the top filter bars (`All`, `Film`, `Series`, `Game`) across Diary, Watchlist, and Favourites.
- **Redesigned Rating Control**: Replaced legacy HTML5 range slider with a modern segmented pill bar (`.rating-bar`) spanning the full dialog width. Adjusted height to `46px` for comfortable touch targets.
- **Removed Mediocre Tier (4-Tier Scale)**: Streamlined rating system to 4 tiers: `Skip` (Red), `Decent` (Teal), `Excellent` (Green), and `Peak` (Purple).
- **Automated Zero-Loss Migration**: Built an automated startup migration (`migrateRatings`, `migrateAllLocalCaches`) that shifts all legacy `mediocre` entries to `decent` across local caches and Firebase Firestore, protected by a persistent one-time flag (`lgr_migrated_v4_ratings`) ensuring zero ongoing CPU or network overhead.
- **Analytics & Profile Charts**: Updated Diary stats and Public Profile distribution charts to reflect the clean 4-tier rating model.

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
