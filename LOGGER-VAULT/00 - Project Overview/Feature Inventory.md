# 📋 Feature Inventory — Detailed Functional Matrix

> **Tag**: #inventory #features
> **Related Notes**: [[CURRENT-STATE]], [[Feature Evolution]], [[Technology Stack]]

| Feature Area | Status | Implementation Details | Key Reference |
|---|---|---|---|
| **Media Logging** | Implemented | Add/edit modal for movies, TV series, and games. Auto rewatch tagging. | [[Media Logging]] |
| **Diary Timeline** | Implemented | Letterboxd-style rows, sticky month headers with entry count badge. | [[Diary Log Page]] |
| **Watchlist** | Implemented | Drag-and-drop touch reordering, upcoming release countdown cards, swipe actions. | [[Watchlist]] |
| **Calendar View** | Implemented | Month grid with poster thumbnails and multi-title overflow badges (+N). | [[Calendar View]] |
| **User Profiles** | Implemented | Custom display name, compressed avatar, Top Picks 4-poster showcase, animated stats. | [[User Profiles]] |
| **Public Viewing** | Implemented | Read-only diary inspection via `?u=UID` URL query parameter. | [[ADR-007 Public Read-Only Profiles via URL Parameters]] |
| **Movie Wall** | Implemented | High-performance edge-to-edge poster showcase with zero labels and category tabs. | [[Movie Wall]] |
| **Snapshot Export** | Implemented | High-res 1080px canvas collection snapshot with native mobile share integration. | [[Sharing and Snapshots]] |
| **Deep Media Card** | Implemented | Encyclopedia sheet with live TMDB/IGDB data, cast, certifications, and providers. | [[Deep Media Info Card]] |
| **Universal Search** | Implemented | Debounced multi-source query across TMDB films/shows/collections and IGDB games. | [[Universal Search]] |
| **Edge API Proxy** | Implemented | Cloudflare Worker proxying TMDB & IGDB with Twitch token caching. | [[Cloudflare Worker Proxy]] |
| **Universe Graph View**| Sunset | Scrapped in October 2026 due to mobile canvas performance lag. Replaced by Movie Wall. | [[Obsidian Graph View Sunset]] |
