# 🛠️ Technology Stack — Architectural Choices & Rationale

> **Tag**: #tech-stack #architecture
> **Related Notes**: [[System Architecture]], [[Frontend Architecture]], [[Backend Architecture]]

## Architecture Matrix
- **Frontend Architecture**: Vanilla HTML5, CSS3, ES6+ Modules (`../index.html`). No bundlers, no transpilers.
- **Styling Architecture**: Native CSS Custom Properties (`:root`), Flexbox, CSS Grid, glassmorphism backdrop filters.
- **Authentication**: Firebase Authentication (Google OAuth provider).
- **Primary Database**: Google Cloud Firestore (NoSQL document store).
- **Client Cache**: Web Storage API (`localStorage`) keyed by user UID.
- **API Proxy Layer**: Cloudflare Workers (`../worker/src/index.js`) deployed to edge network.
- **Third-Party APIs**:
  - The Movie Database (TMDB) API v3 (Movies & Television metadata, credits, posters).
  - Internet Game Database (IGDB) API v4 via Twitch OAuth (Game data).
- **Canvas Generation**: HTML5 Canvas 2D API + `html2canvas` v1.4.1 (CDN).
- **Typography**: Google Fonts (*Inter* and *Playfair Display*).
- **Local Dev Server**: Node.js standard library HTTP server (`../server.js`).
