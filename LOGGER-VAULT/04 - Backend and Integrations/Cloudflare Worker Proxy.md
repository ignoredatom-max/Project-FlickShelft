# ⚡ Cloudflare Worker Proxy (`logger-proxy`)

> **Tag**: #cloudflare #worker #proxy
> **Related Notes**: [[Backend Architecture]], [[ADR-002 Cloudflare Worker API Proxy for ISP DNS Bypass]]

## Source Location
`../worker/src/index.js` (~730 lines)

## Responsibilities
- Bypasses mobile carrier DNS blocking on TMDB and Twitch domains.
- Protects API keys (`TMDB_API_KEY`, `TWITCH_CLIENT_SECRET`) as Cloudflare Secrets.
- Normalizes and translates media responses.
- Implements CORS headers restricting access to authorized origins.
- Provides image proxying for TMDB posters.
