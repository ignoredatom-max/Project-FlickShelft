# 🏗️ System Architecture — High-Level Design

> **Tag**: #architecture #system-design
> **Related Notes**: [[LOGGER-CONTEXT]], [[Frontend Architecture]], [[Backend Architecture]], [[Data Flow]]

Logger is architectured as a decoupled client-serverless system designed for extreme client agility and minimal backend maintenance.

## Architecture Tiers

1. **Client Tier (`../index.html`)**:
   - Single-file SPA hosted on GitHub Pages CDN.
   - Handles DOM manipulation, routing, client-side caching, image generation, and direct Firebase SDK interactions.
2. **Edge Proxy Tier (`../worker/src/index.js`)**:
   - Cloudflare Worker running at the edge.
   - Holds upstream API secrets (`TMDB_API_KEY`, `TWITCH_CLIENT_SECRET`).
   - Bypasses mobile carrier DNS blocking and returns normalized JSON.
3. **Database Tier (Google Cloud Firestore)**:
   - Stores user diary entries, watchlist documents, and profile metadata.
   - Provides real-time synchronization via WebSocket listeners.
4. **Local Dev Tier (`../server.js`)**:
   - Zero-dependency Node.js HTTP server.
   - Proxies API calls locally and serves static assets on port 8080.
