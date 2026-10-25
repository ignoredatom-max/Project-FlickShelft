# ☁️ Backend Architecture — Edge Proxy & Serverless Services

> **Tag**: #backend #architecture #cloudflare-worker
> **Related Notes**: [[Cloudflare Worker Proxy]], [[TMDB Integration]], [[IGDB Integration]], [[ADR-002 Cloudflare Worker API Proxy for ISP DNS Bypass]]

Logger eliminates dedicated traditional application servers in production by leveraging serverless Cloudflare Workers and Google Firebase.

## Responsibilities of `logger-proxy` Worker
- **ISP DNS Bypass**: Resolves TMDB and Twitch domains at the edge, overcoming carrier-level DNS censorship in regions like India.
- **Twitch OAuth Token Lifecycle**: Authenticates against Twitch OAuth using client credentials, caching access tokens in memory until expiration.
- **Game Relevance Scoring**: Evaluates IGDB game candidates, eliminates DLCs/skin packs, and ranks main releases.
- **CORS Termination**: Restricts access to `ignoredatom-max.github.io` and local development environments.
