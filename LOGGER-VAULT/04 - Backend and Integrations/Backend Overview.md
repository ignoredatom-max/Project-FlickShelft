# ☁️ Backend & Integrations — Overview

> **Tag**: #backend #integrations
> **Related Notes**: [[Backend Architecture]], [[Cloudflare Worker Proxy]], [[Firebase Authentication]], [[Firestore Database]]

Logger employs a modern serverless backend architecture consisting of:
1. **Cloudflare Worker Proxy** (`../worker/src/index.js`): Handles external API traffic for TMDB and IGDB.
2. **Google Cloud Firebase**: Handles authentication, cloud persistence, and user security.
3. **Local Dev Server** (`../server.js`): Zero-dependency Node.js HTTP server for local testing.
