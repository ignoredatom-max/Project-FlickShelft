# 📊 Current State — Verified Project Status

> **Status Date**: October 2026
> **Tag**: `#status` `#project-state`
> **Related Notes**: [[HOME]], [[AI-START-HERE]], [[CURRENT-TASK]], [[Feature Inventory]], [[Known Issues]]

This document captures the **verified real-world state** of the Logger project. It distinguishes what is working, what is partially implemented, what has been sunset, and what limitations exist.

---

## 1. Verified Feature Status

### ✅ Fully Implemented & Working

| Feature | Description | Primary Code Location |
|---|---|---|
| **Diary Logging** | Log movies, series, and games with rating, status, date, and notes | `index.html` `renderLog()`, `openModal()` |
| **Month Sticky Grouping** | Chronological month groups with faint right-aligned item counter (`.month-count`) and sticky headers | `index.html` `.month-header`, `updateStickyTop()` |
| **Watchlist Management** | Add to watchlist, countdown cards for upcoming releases, iOS touch drag reordering, swipe-to-delete/log | `index.html` `renderWL()`, `saveWL()` |
| **Calendar View** | Monthly calendar grid with media poster thumbnails, multi-entry overflow indicators (`+N`), and date detail cards | `index.html` `renderCalendar()` |
| **User Profiles & Picks** | Custom display name editing, Top Picks (4 slots), segmented stats, animated count-up ticker, activity bar chart | `index.html` `renderProfile()` |
| **Public Profiles (`?u=UID`)**| Read-only view for visitors via URL query string, personalizing subtitle and banners without edit controls | `index.html` `renderPublicProfile()` |
| **Movie Wall** | Single-page, one-look edge-to-edge poster collection showcase with dynamic zero-scroll geometric packing, desktop hover tooltips, and mobile touch optimization | `index.html` `renderMovieWall()` |
| **Collection Snapshots** | 1080px high-resolution canvas generator with Logger watermark, user name, and poster mosaic for native sharing / download | `index.html` `shareMovieWall()` |
| **Deep Media Info Card** | Encyclopedia overlay fetching live TMDB/IGDB metadata, cast, director, release certification, and watch providers | `index.html` `openDeepCard()` |
| **Universal Search** | Debounced search across TMDB movies, TMDB TV series, TMDB collections, IGDB games, and local diary titles | `index.html` `openDiarySearch()` |
| **Cloudflare Worker Proxy** | Edge API proxy bypassing ISP DNS blocking for TMDB & IGDB, Twitch OAuth token handling, image proxying | `worker/src/index.js` |
| **Offline Cache Boot** | Instant loading of user diary from `localStorage` before Firebase network resolution | `index.html` `bootCacheRead()` |
| **JSON Export & Import** | Manual JSON backup file creation and file restoration in Settings | `index.html` `exportData()`, `importData()` |

---

### ⚠️ Partially Implemented or Limited

1. **Guest Mode (`Continue as guest`)**:
   - Allows users to test the app without signing in with Google.
   - *Limitation*: All data remains in-memory only. Navigating away or refreshing will discard changes unless signed into Firebase.
2. **Franchise Collection Timeline**:
   - Clicking "View Full Collection" in the deep media card opens a timeline sheet of movies in that franchise.
   - *Limitation*: Currently supports TMDB movie collections; game franchises (IGDB series) are partially mapped.
3. **Local Dev Server Certifications**:
   - `server.js` contains static fallback tables for `POPULAR_TV_RATINGS` and `POPULAR_MOVIE_RATINGS`. For obscure titles in local mode without network access, certifications fallback to generic indicators.

---

### 🚫 Scrapped / Abandoned Approaches

- **Obsidian-Style Universe Graph View**:
  - *Status*: **Scrapped in October 2026** (Commit `5e5b9e1`).
  - *Reason*: Continuous HTML5 Canvas physics simulations, planetary revolution calculations, and collision loops caused severe frame drops and battery drain on mobile browsers.
  - *Replacement*: Replaced with the 100% native DOM **[[Movie Wall]]**, which uses CSS Grid, native momentum scrolling, and `loading="lazy"` for zero lag.
  - See [[Obsidian Graph View Sunset]] in the archive.

---

## 2. Recent Bug Fixes (October 2026)

1. **Broken Sticky Month Headers**:
   - *Issue*: Month separators failed to stick beneath the sticky header while scrolling.
   - *Root Cause*: Page fade-in animation had `transform: translateY(0)` with `animation-fill-mode: both`, creating a transformed containing block that broke `position: sticky`. Furthermore, `updateStickyTop()` had a selector mismatch looking for inline styles.
   - *Fix*: Simplified `pageFadeIn` to pure opacity fade and made header height calculation robust. (Commit `047adc0`).
2. **Faint Month Counter Addition**:
   - *Feature*: Added `.month-count` on the right side of `.month-header` to subtly show total titles in each month. (Commit `5e5b9e1`).
3. **Movie Wall Implementation**:
   - *Feature*: Cleaned out ~1,900 lines of canvas physics and added the high-performance Movie Wall and 1080px collection picture export. (Commit `5e5b9e1`).

---

## 3. Technical Debt & Architectural Observations

1. **Monolithic Frontend (`index.html`)**:
   - The entire client application is ~14,000 lines in one file. While this delivers zero build overhead, it requires disciplined line-targeting during edits to avoid breaking adjacent functions.
2. **Manual Cloudflare Worker Deployments**:
   - Pushing frontend changes to GitHub automatically deploys GitHub Pages. However, modifying `worker/src/index.js` requires a separate `cd worker && npx wrangler deploy` step.
3. **Hardcoded Secrets in `server.js`**:
   - `server.js` contains a local TMDB API key at line 9. While not exposed in production, it is intended only for offline localhost development.
4. **Automated Testing Suite**:
   - The repository does not currently use Jest, Playwright, or Cypress. Verification is performed using manual acceptance checks, local syntax validators, and PowerShell test scripts (`worker/test-server.ps1`).

---

## 4. Current Build & Environment Health

- **Git Branch**: `main`
- **Working Tree**: Clean, synchronized with `origin/main`.
- **Node Server**: Verified working on `http://localhost:8080` (HTTP 200).
- **JS Syntax**: Verified valid with `node -e "new vm.Script(...)"`.
- **Cloudflare Worker**: Live at `https://logger-proxy.ignoredatom.workers.dev`.
- **Production Host**: Live at `https://ignoredatom-max.github.io/Project-FlickShelft/`.
