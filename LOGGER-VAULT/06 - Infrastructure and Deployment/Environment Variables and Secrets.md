# 🔑 Environment Variables & Secrets

> **Tag**: #secrets #env #configuration
> **Related Notes**: [[Cloudflare Worker Proxy]], [[Security and Privacy]]

## Cloudflare Worker Secrets
Configured via `npx wrangler secret put <KEY>`:
- `TMDB_API_KEY`: The Movie Database v3 API key.
- `TWITCH_CLIENT_ID`: Twitch developer application Client ID.
- `TWITCH_CLIENT_SECRET`: Twitch developer Client Secret.

## Local Dev Secrets
Stored in `worker/.dev.vars` (gitignored). Template available in `worker/.dev.vars.example`.
