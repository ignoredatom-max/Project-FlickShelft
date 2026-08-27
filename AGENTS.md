# AGENTS.md — Logger (Project-FlickShelft)

> Technical reference for AI agents continuing work on this project.
> Based on the actual codebase as of August 2026. Do not invent features.

---

## What Is This Project?

**Logger** is a personal media diary PWA (Progressive Web App) built by **ATOMYN** (creator: Aditya Kachare).
Users log movies, TV series, and video games they have watched/played, rate them, add notes, and track a watchlist.

The app has public and private diary modes. Signed-in users get their own private Firestore database. Visitors can view another user's diary via a ?u=<uid> URL query parameter. Guest mode allows in-app browsing without signing in.

**Live app:** https://ignoredatom-max.github.io/Project-FlickShelft/
**API Worker:** https://logger-proxy.ignoredatom.workers.dev
**Git repo:** https://github.com/ignoredatom-max/Project-FlickShelft.git (branch: main)

---

## Architecture

`
Project-FlickShelft/
├── index.html          ← Entire frontend: all HTML, CSS, and JavaScript in one file
├── manifest.json       ← PWA manifest (icons, display mode, theme color)
├── icon-192.png        ← App icon 192x192 (used by manifest and favicon)
├── icon-512.png        ← App icon 512x512 (used by manifest and favicon)
├── logo.png            ← Logo asset (used in share card)
├── server.js           ← Node.js local dev server (static files + API proxy)
├── Patchnotes.txt      ← Chronological feature changelog
├── README.md           ← Project readme
├── .gitignore
└── worker/
    ├── src/
    │   └── index.js    ← Cloudflare Worker (production API proxy, all routes)
    ├── wrangler.jsonc  ← Wrangler config (worker name: "logger-proxy")
    ├── package.json    ← Worker deps: only "wrangler" as devDependency
    ├── .dev.vars       ← Local secrets (gitignored)
    ├── .dev.vars.example ← Template for secrets
    ├── test-server.ps1 ← PowerShell local worker test server
    └── serve-app.ps1   ← PowerShell static file server (port 5000)
`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS — single index.html, no bundler, no framework |
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Firebase Firestore (NoSQL, per-user collections) |
| Local cache | localStorage keyed by lgr_cache_<uid> |
| API proxy | Cloudflare Worker (worker/src/index.js) |
| Movie/TV data | TMDB (The Movie Database) API v3 |
| Game data | IGDB API v4 via Twitch OAuth |
| Image rendering | TMDB image CDN: https://image.tmdb.org/t/p/w200<path> |
| IGDB images | https://images.igdb.com/igdb/image/upload/t_cover_big/<image_id>.jpg |
| Share card | html2canvas v1.4.1 (CDN) |
| Fonts | Google Fonts: Inter + Playfair Display |
| Hosting | GitHub Pages |
| Local dev | server.js (Node.js, port 8080) |

---

## Important Files

### index.html (~10,000 lines)
The entire app. Contains:
- All CSS (inline <style> tag, CSS variables via :root)
- All HTML pages as <div class="page" id="page-*"> (hidden/shown via JS class toggling)
- All JavaScript (single <script type="module">)
- Firebase SDK imports (from gstatic CDN)

**Page sections (all HTML in one file):**
| ID | Purpose |
|---|---|
| #page-log | Main diary log (default visible page) |
| #page-watchlist | Watchlist (upcoming releases + logged watchlist items) |
| #page-favs | Favourites (filtered from diary entries) |
| #page-calendar | Calendar view of logged entries |
| #page-profile | User profile: top picks, stats, activity graph |

**Key JS functions (all in index.html):**
| Function | Purpose |
|---|---|
| renderLog() | Rebuilds the diary list |
| renderFavs() | Rebuilds favourites list |
| renderWL() | Rebuilds watchlist |
| renderCalendar() | Builds calendar grid |
| renderProfile() | Builds profile/stats page |
| openModal(entry, prefill) | Opens the log/add entry modal; null = new entry |
| showInfoCard(entry, context) | Opens the info card (full media detail overlay) |
| closeInfoCard() | Closes the info card |
| openCollectionOverlay(collectionId, name, currentMovieId) | Opens franchise/collection timeline |
| saveWL(array) | Saves watchlist to localStorage + Firestore |
| getWL() | Returns watchlist from localStorage |
| fsSave(entry) | Saves a diary entry to Firestore |
| fsDelete(id) | Deletes entry from Firestore |
| toast(msg, dur) | Shows a brief toast notification |
| flashCloud() | Shows brief cloud sync indicator |
| openAbout() | Opens About / Support card |
| exportData() | Downloads diary as JSON backup |
| importData() | Merges JSON backup into Firestore |

**API routing (API_BASE):**
`js
const API_BASE = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('10.') ||
  window.location.hostname.startsWith('172.')
) ? '' : 'https://logger-proxy.ignoredatom.workers.dev';
`
- Localhost/LAN: API calls go to server.js (port 8080)
- Production (GitHub Pages): API calls go to the Cloudflare Worker

**Constants:**
- OWNER_UID = 'kFMRmHi4hzakOaQFx7ccanUsIbl1' — Aditya's Firebase UID (public profile fallback)
- PUBLIC_UID — set from ?u=<uid> URL param; enables read-only public view
- TMDB_IMG = 'https://image.tmdb.org/t/p/w200' — image base URL prefix
- RATINGS = ['skip', 'mediocre', 'decent', 'excellent', 'peak'] — rating values

**Data types (media entry object shape):**
`js
{
  id,         // unique string ID
  type,       // 'movie' | 'series' | 'game'
  title,
  poster,     // image URL
  year,
  genre,
  rating,     // one of RATINGS[]
  status,     // 'done', 'watching', 'dropped', 'started', 'ongoing', 'rewatched'
  date,       // ISO date logged
  notes,      // optional text
  fav,        // boolean
  rewatched,  // boolean
  seasons,    // number (series only)
  lastSeason, // number (series only)
  tmdbId,     // for movies and series
  igdbId,     // for games
}
`

---

### server.js (Local Dev Only)
- Node.js HTTP server on port 8080
- Serves all static files from the project root
- Proxies /api/* requests to the Cloudflare Worker (UPSTREAM_PROXY)
- Has hardcoded TMDB_API_KEY for direct TMDB calls (local only)
- Special handling:
  - /api/search/collection — calls TMDB directly
  - /api/movie/collection/:id — checks hardcoded POPULAR_COLLECTIONS, then TMDB, then proxy
  - /api/movie/:id — enriches with release_dates from TMDB if missing
  - /api/tv/:id — enriches with content_ratings from TMDB if missing
  - /api/image — proxies TMDB images
- Fallback tables: POPULAR_TV_RATINGS, POPULAR_MOVIE_RATINGS, POPULAR_COLLECTIONS

---

### worker/src/index.js (Production API)
Cloudflare Worker. All GET-only. CORS restricted to ignoredatom-max.github.io and localhost.

**Routes:**
| Route | Description |
|---|---|
| /api/health | Health check |
| /api/search/movie?query= | TMDB movie search |
| /api/search/tv?query= | TMDB TV series search |
| /api/search/collection?query= | TMDB collection/franchise search |
| /api/search/game?query=&page_size= | IGDB game search (filtered, ranked) |
| /api/movie/:id | TMDB movie detail + credits + release_dates + watch/providers |
| /api/movie/collection/:id | TMDB collection/franchise detail |
| /api/tv/:id | TMDB TV detail + credits + aggregate_credits + content_ratings + watch/providers |
| /api/game/:id | IGDB game detail (translated to RAWG-like shape) |
| /api/image?path=&size= | TMDB image proxy |
| /api/test/igdb | IGDB test endpoint (debug) |
| /api/test/igdb/game/:id | IGDB game test (debug) |
| /api/test/igdb/sample | Sample IGDB translation (debug) |

IMPORTANT: /api/movie/collection/:id MUST be matched before /api/movie/:id (already correct in code).

**IGDB adapter:** Translates IGDB data format to a RAWG-compatible shape via igdbToRawgSearchItem() and igdbToRawgDetail(). The frontend consumes the RAWG shape.

**Game search algorithm:**
1. Primary IGDB search (40 candidates)
2. Filter with isMainPlayableGame() — removes DLCs, skin packs, editions with parent_game
3. Fuzzy wildcard fallback if < 4 results
4. Score/rank by calculateGameRelevance() (name match, popularity count, edition penalty)
5. Return top page_size (default 8, max 20)

**Secrets required in Cloudflare Worker environment:**
- TMDB_API_KEY
- TWITCH_CLIENT_ID
- TWITCH_CLIENT_SECRET
- RAWG_API_KEY (legacy, likely unused but referenced in .dev.vars.example)

---

## External APIs & Services

### TMDB (The Movie Database)
- Base: https://api.themoviedb.org/3
- Auth: ?api_key=<TMDB_API_KEY> (v3 API key)
- Images: https://image.tmdb.org/t/p/<size><poster_path> (sizes: w200, w300, w500, original)
- NEVER call TMDB directly from the frontend — always go through API_BASE

### IGDB (via Twitch)
- OAuth: https://id.twitch.tv/oauth2/token (client credentials flow)
- API: https://api.igdb.com/v4/games (POST with APicalypse query body)
- Twitch token cached in Worker memory with expiry

### Firebase
- Auth: Firebase Authentication, Google provider only
- Database: Firestore
  - User entries: users/<uid>/entries/<entryId>
  - Watchlist: users/<uid>/meta/watchlist (document with items array)
- Config embedded in index.html (not secret):
  - projectId: "movie-logs"
  - authDomain: "movie-logs.firebaseapp.com"
- Firebase SDK from https://www.gstatic.com/firebasejs/10.12.0/

---

## Universal Search Implementation

Universal search simultaneously queries:
1. TMDB movies (/api/search/movie)
2. TMDB TV series (/api/search/tv)
3. TMDB collections/franchises (/api/search/collection)
4. IGDB games (/api/search/game)
5. Existing local diary entries (strict title match)

Results are combined and grouped. Collections can surface as a "Top Result" with a special card. Search is debounced.

**Selecting a result opens openModal(null, prefill) with:**
- Log button (saves entry to diary)
- Add to Watchlist button (adds to watchlist without logging)
- Type selector (movie / series / game)
- Season picker (series only)
- Status selector (context-aware per type)
- 5-point rating slider
- Notes field
- Favourite toggle

---

## UI/UX Conventions

- Dark-only — no light mode. All colors via CSS variables in :root.
- Mobile-first, iOS-inspired, Inter typeface.
- Bottom nav: floating pill bar, 5 items: Log, Calendar, + (add), Watchlist, Profile.
- Info Card: full-screen overlay for media details. Closed with .info-close circular × button (top-right).
- Collection overlay: timeline of franchise movies. Opened from Info Card "View Full Collection".
- Modals: slide-up sheet with drag handle.
- Toast: short text pop-up at bottom.
- Cloud flash: brief cloud icon when Firestore syncs.
- Readonly mode: when viewing ?u=<uid> public diary, editing controls hidden via body.readonly CSS class.
- ATOMYN branding:
  - .atomyn-signature class: subtle wordmark at bottom of each list; tapping opens About card
  - Settings profile header: shown below "Creator & Developer" with orbital SVG mark
  - No borders, pills, or backgrounds — plain text only
- Rewatch detection: logging same title/type at same or lower season auto-tags as Rewatched.
- Age ratings: from release_dates.results (movies) or content_ratings.results (TV), shown in Info Card.

---

## Data Storage

| Data | Storage |
|---|---|
| Diary entries | Firestore users/<uid>/entries/<entryId> + localStorage cache |
| Watchlist | Firestore users/<uid>/meta/watchlist + localStorage key 'logger-wl' |
| Profile picks | localStorage profileKey('picks') |
| Profile photo | localStorage profileKey('pfp') (base64 or URL) |
| Display name | localStorage profileKey('name') |
| Boot cache | localStorage lgr_cache_<uid> |

Guest mode: data is in-memory only, not saved to Firestore.

---

## Development & Run Commands

### Local development (full app with API)
`ash
node server.js
# App at http://localhost:8080
`
server.js uses Node.js standard library only — no npm install needed.

### Worker local dev (Wrangler)
`ash
cd worker
npm install
npm run dev   # starts worker at http://localhost:8787
`
Requires worker/.dev.vars with actual secrets (copy from .dev.vars.example).

### Deploy Worker to Cloudflare (REQUIRED after any worker/src/index.js change)
`ash
cd worker
npm run deploy   # runs: wrangler deploy
`
Requires Wrangler authentication (wrangler login or CLOUDFLARE_API_TOKEN env var).

### PowerShell alternatives (no Node on PATH)
- worker/serve-app.ps1 — static server on port 5000 (no API)
- worker/test-server.ps1 — full test server on port 8787

### If Node/npm is not on system PATH (Windows/Antigravity env)
`
C:\Users\adity\AppData\Roaming\Antigravity\bin\agy-node.cmd
`

---

## Environment Variables / Configuration

### Cloudflare Worker secrets (set via wrangler, NOT in code)
`
TMDB_API_KEY
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
RAWG_API_KEY (legacy)
`

Set via:
`ash
wrangler secret put TMDB_API_KEY
`

For local dev, add to worker/.dev.vars (gitignored).

### Local dev server
server.js has TMDB_API_KEY hardcoded at line 9 for local-only use.

---

## Things That Must Not Be Broken

- API_BASE auto-switch logic (localhost vs. production Cloudflare Worker)
- Firebase auth flow (onAuthStateChanged, Google Sign-In)
- Firestore sync for entries and watchlist
- openModal(null, prefill) → Log / Add to Watchlist flow
- Info Card media detail rendering (poster, cast, age ratings, collection link)
- Collection timeline overlay
- Universal search (parallel TMDB + IGDB + local)
- IGDB game search filtering (DLC/edition removal, relevance scoring)
- Readonly mode (public ?u=<uid> viewing)
- localStorage cache (boot performance)
- JSON backup download and restore
- PWA manifest and installability
- Wrangler deploy pipeline for the Worker
- CORS origin allow-list in the Worker
- .dev.vars is gitignored — never commit actual secrets

---

## Current Known Issues / TODOs

- Worker must be manually re-deployed after any worker/src/index.js changes. GitHub Pages push does NOT redeploy the Worker.
- worker/package-lock.json is untracked (not in .gitignore). Consider committing it.
- RAWG_API_KEY in .dev.vars.example is vestigial (IGDB is current game source).
- server.js hardcodes a LAN IP at line 312 (192.168.0.103). Update for different machines.
- POPULAR_COLLECTIONS in server.js is a small hardcoded fallback for local dev only.

---

## Deployment Checklist

1. Frontend only (index.html, icons): push to main → GitHub Pages auto-deploys.
2. Worker changes: also run cd worker && npm run deploy (manual step, always required).
3. Never commit worker/.dev.vars.
4. Never change OWNER_UID — it is the Firestore UID for the diary owner.

---

ATOMYN — Logger v2.1.x
