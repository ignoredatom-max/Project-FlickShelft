# Logger API Proxy (Cloudflare Worker)

A standalone Cloudflare Worker proxy for **TMDB** and **RAWG** APIs.

## Features
- Bypasses ISP DNS blocking on mobile carriers without requiring VPN/DNS changes on user devices.
- Keeps TMDB and RAWG API keys hidden using Cloudflare Secrets.
- Enables edge caching to reduce API latency and preserve rate limits.
- Supports custom domains (e.g. `api.yourdomain.com`) as well as `*.workers.dev`.
- Built-in CORS support for GitHub Pages and local development.

---

## Local Development & Testing

1. Navigate to the `worker/` directory:
   ```bash
   cd worker
   ```
2. Start the local development server:
   ```bash
   npx wrangler dev --port 8787
   ```
3. Test endpoints with curl or browser:
   ```bash
   # Health check
   curl http://localhost:8787/api/health

   # Search movie
   curl http://localhost:8787/api/search/movie?query=Inception

   # Search TV
   curl http://localhost:8787/api/search/tv?query=Breaking+Bad

   # Search Games
   curl http://localhost:8787/api/search/game?query=Zelda
   ```

---

## Deployment to Cloudflare (When Ready)

1. Log in to Cloudflare:
   ```bash
   npx wrangler login
   ```
2. Set your production secrets:
   ```bash
   npx wrangler secret put TMDB_API_KEY
   npx wrangler secret put RAWG_API_KEY
   ```
3. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```
4. *(Optional & Recommended for complete ISP immunity)*: Attach a custom domain or subdomain (e.g., `api.yourdomain.com`) in Cloudflare Dashboard under **Workers & Pages → logger-proxy → Settings → Triggers → Custom Domains**.
