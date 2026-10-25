# 🗂️ Documentation Index — Complete Note Catalog

> **Tag**: `#index` `#catalog`
> **Related Notes**: [[HOME]], [[AI-START-HERE]], [[PROJECT-MAP]]

This index catalogs every technical note, architectural decision, component specification, and workflow guide contained within the **Logger Second Brain** vault.

---

## 📌 Root Orientation & Control
- [[HOME]] — Knowledge base dashboard and entry hub.
- [[AI-START-HERE]] — Primary orientation guide and operating rules for AI coding sessions.
- [[LOGGER-CONTEXT]] — Durable project knowledge, tech stack, and architectural constraints.
- [[PROJECT-MAP]] — Code topology, directory layout, and line-number map.
- [[CURRENT-STATE]] — Verified feature status, active capabilities, and technical debt.
- [[CURRENT-TASK]] — Active task tracking and cross-session handoff.
- [[CHANGELOG]] — Chronological milestone and release history.
- [[DOCUMENTATION-INDEX]] — This complete document catalog.

---

## 00 - Project Overview
- [[Project Overview]] — Purpose, philosophy, target audience, and product goals.
- [[Product Vision]] — Aesthetic ideals, user experience benchmarks, and future aspirations.
- [[Feature Inventory]] — Comprehensive inventory of implemented, partial, and sunset features.
- [[Technology Stack]] — Full analysis of frontend, backend, database, and infrastructure choices.
- [[Glossary]] — Terminology, data structures, and naming conventions used across Logger.

---

## 01 - Architecture
- [[System Architecture]] — High-level system topology, tiers, and external interactions.
- [[Frontend Architecture]] — Single-file SPA structure, execution lifecycle, and rendering model.
- [[Backend Architecture]] — Edge proxy architecture, serverless worker design, and local proxy.
- [[Data Flow]] — End-to-end data pipelines for searches, logging, caching, and cloud sync.
- [[Routing Architecture]] — Hashless in-page page switching, URL parameters (`?u=UID`), and scroll isolation.
- [[State Management]] — Global state variables (`DATA`, `WL`), localStorage caching, and Firestore synchronization.
- [[Component Relationships]] — Hierarchical dependencies between modals, pages, and overlays.
- [[Design System]] — CSS custom properties, color palette, typography, glassmorphism, and elevation tokens.
- **Architecture Decisions (ADRs)**:
  - [[Decision Index]] — Catalog of all Architectural Decision Records.
  - [[ADR-001 Single-File Frontend Architecture]] — Decision to retain single `index.html` structure.
  - [[ADR-002 Cloudflare Worker API Proxy for ISP DNS Bypass]] — Rationale for edge proxy on Cloudflare.
  - [[ADR-003 Migration from RAWG to IGDB v4 via Twitch OAuth]] — Transition to IGDB for video games.
  - [[ADR-004 Firebase Authentication and Firestore Data Storage]] — Selection of Google Firebase for auth & database.
  - [[ADR-005 Client-Side Multi-Tier Caching for Instant Boot]] — Sub-millisecond startup via localStorage.
  - [[ADR-006 Replacing Graph View with Native DOM Movie Wall]] — Replacement of heavy canvas simulation with CSS Grid.
  - [[ADR-007 Public Read-Only Profiles via URL Parameters]] — URL query parameter architecture for profile sharing.

---

## 02 - Features
- [[Authentication]] — Google OAuth sign-in flow, guest mode, and session persistence.
- [[Media Logging]] — Entry creation lifecycle, duplicate/rewatch detection, and status assignment.
- [[Movies]] — TMDB film metadata, certifications, runtimes, cast, and directors.
- [[TV Series]] — Season tracking, progress pills, episode/season counts, and status handling.
- [[Games]] — IGDB video game integration, platform icons, acronym expansion, and release tracking.
- [[Universal Search]] — Multi-source parallel search (TMDB, IGDB, Local Diary) with debouncing.
- [[Watchlist]] — Watchlist queuing, upcoming countdown grid, iOS drag reordering, and swipe actions.
- [[Ratings and Reviews]] — 5-tier rating system (Skip to Peak), notes, quotes, and badges.
- [[User Profiles]] — Custom display names, profile avatars, segmented stats, and count-up animations.
- [[Favorites and Top Picks]] — Top Picks 4-poster showcase, favorite toggling, and filtering.
- [[Calendar View]] — Monthly calendar layout, poster date thumbnails, and overflow count badges.
- [[Movie Wall]] — Pure edge-to-edge poster collection showcase, category filtering, and zero-lag rendering.
- [[Sharing and Snapshots]] — High-res 1080px canvas review cards, collection snapshots, and native sharing.

---

## 03 - Frontend
- [[Application Shell]] — Main HTML structure, sticky header, dynamic blur transitions, and safe areas.
- [[Navigation System]] — Floating bottom dock, animated capsule indicator, and center Add FAB.
- **Pages**:
  - [[Diary Log Page]] — Main diary view, month headers with count badges, Letterboxd rows.
  - [[Watchlist Page]] — Watchlist layout, touch drag handles, and upcoming release cards.
  - [[Favourites Page]] — Filtered favorites list, type pills, and empty states.
  - [[Calendar Page]] — Calendar grid, date cell rendering, and selected-date entry view.
  - [[Profile Page]] — Profile header, avatar compression, Top Picks showcase, and activity graph.
- **Components & Overlays**:
  - [[Add and Edit Entry Modal]] — Top-anchored floating squircle card, form controls, and search integration.
  - [[Deep Media Info Card]] — Full encyclopedia media sheet, hero parallax backdrop, and cast lists.
  - [[Franchise Collection Overlay]] — Franchise movie timeline overlay and collection navigation.
  - [[Universal Search Overlay]] — Full-screen search input, instant results, and collection highlights.
  - [[Movie Wall Overlay]] — Full-screen poster mosaic overlay, category filters, and snapshot actions.
  - [[Settings and About Modal]] — Backup/restore tools, ATOMYN support links, and attribution.
  - [[Toast and Feedback System]] — Lightweight toast alerts and cloud sync flash indicators.
  - [[Rating and Status Controls]] — Touch-friendly rating slider and media-aware status pickers.
- [[Styling and Design Tokens]] — CSS architecture, `:root` design tokens, responsive breakpoints, and animations.
- [[UI and UX Patterns]] — Letterboxd layout, haptic vibration, spring press animations, and keyboard handling.

---

## 04 - Backend and Integrations
- [[Backend Overview]] — Architecture of edge proxies, cloud databases, and development servers.
- **Firebase**:
  - [[Firebase Authentication]] — Google Sign-In, token handling, and public/private profile states.
  - [[Firestore Database]] — Collection schemas, document structure, and real-time listeners.
  - [[Security Rules]] — Firestore security policies for user isolation and public read-only access.
- [[TMDB Integration]] — Movie & TV queries, collection timelines, image endpoints, and error handling.
- [[IGDB Integration]] — Twitch OAuth token management, APicalypse queries, and game relevance scoring.
- [[Cloudflare Worker Proxy]] — Route handlers, CORS headers, image proxying, and caching in `worker/src/index.js`.
- [[Local Development Server]] — Zero-dependency Node.js server (`server.js`), static hosting, and mock routes.

---

## 05 - Data and Database
- [[Database Overview]] — Data persistence architecture across cloud, edge, and local client storage.
- [[Data Models]] — Schema definitions for Diary Entry, Watchlist Item, Profile Metadata, and Search Result.
- [[Firestore Collections]] — Document paths (`users/{uid}/entries/{id}` and `users/{uid}/meta/watchlist`).
- [[Local Storage Schemas]] — Local storage keys (`lgr_cache_{uid}`, `logger-wl`, `profileKey_*`).
- [[Data Lifecycle and Synchronization]] — Optimistic UI updates, offline-first boot, and Firestore write pipelines.
- [[Security and Privacy]] — Separation of private diary writes, public reads, and API key isolation.

---

## 06 - Infrastructure and Deployment
- [[Development Environment]] — Prerequisites, local server execution, and PowerShell scripts.
- [[Build and Execution Process]] — Zero-build frontend execution and Cloudflare Worker bundling via Wrangler.
- [[Environment Variables and Secrets]] — Secret management in Cloudflare (`.dev.vars`) and local dev API keys.
- [[PWA Configuration]] — Service workers, `manifest.json`, home screen icons, and standalone display.
- [[Deployment Workflows]] — Automated GitHub Pages deployment from `main` and manual Worker deployment.
- [[Dependencies and External Assets]] — Third-party libraries (`html2canvas`, Firebase SDK, Google Fonts).

---

## 07 - Quality and Performance
- [[Testing Strategy]] — Manual test verification, syntax validation, and API testing scripts.
- [[Performance Optimizations]] — CSS containment, image lazy loading, requestAnimationFrame scheduling, and cache strategies.
- [[Accessibility]] — Semantic markup, ARIA roles, touch target sizes, and contrast compliance.
- [[Known Issues]] — Catalog of verified quirks, edge cases, and active limitations.
- [[Technical Debt]] — Monolithic frontend file size, manual worker deploy step, and future refactoring avenues.

---

## 08 - Development History
- [[Feature Evolution]] — Iterative history of how Logger evolved from v1.0 to v2.1+.
- [[Bug Fix History]] — Historical record of significant bugs resolved (sticky headers, rewatch loops, keyboard offsets).
- [[Key Design Decisions]] — Summary of major turning points in the application's architecture.
- [[Lessons Learned]] — Hard-won insights regarding mobile browser quirks, sticky positioning, and canvas performance.

---

## 09 - Development Workflow
- [[AI Development Rules]] — Mandatory principles for AI coding assistants working on Logger.
- [[How to Add a Feature]] — Step-by-step procedure for implementing new functionality.
- [[How to Modify a Component]] — Safe practices for modifying existing code in `index.html`.
- [[How to Debug Logger]] — Systematic troubleshooting techniques for frontend, cache, and API issues.
- [[How to Test Changes]] — Verification checklists and test procedures before committing code.
- [[How to Release Changes]] — Release guide for GitHub Pages commits and Cloudflare Worker deployments.

---

## 10 - Templates
- [[Feature Template]] — Markdown template for documenting new features.
- [[Component Template]] — Markdown template for documenting UI components and overlays.
- [[Service Template]] — Markdown template for backend services and external APIs.
- [[API Integration Template]] — Markdown template for third-party integrations.
- [[Architecture Decision Template]] — Template for authoring Architectural Decision Records (ADRs).
- [[Bug Report Template]] — Template for logging bug investigations and fixes.

---

## 99 - Archive
- [[Archive Index]] — Deprecated features and historical design documents.
- [[Obsidian Graph View Sunset]] — Post-mortem on the sunset of the canvas-based Universe Graph View.
