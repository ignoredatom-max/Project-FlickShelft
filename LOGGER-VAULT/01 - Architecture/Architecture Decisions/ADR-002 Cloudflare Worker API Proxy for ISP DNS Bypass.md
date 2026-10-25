# ADR-002: Cloudflare Worker API Proxy for ISP DNS Bypass

- **Status**: Accepted
- **Date**: August 2026
- **Context**: Mobile internet service providers in India and other regions actively block or tamper with TMDB and gaming API domains at the DNS level.
- **Decision**: Route all external API calls through a dedicated Cloudflare Worker (`logger-proxy.ignoredatom.workers.dev`).
- **Consequences**:
  - *Positive*: Seamless access on mobile without VPN, API secrets remain hidden, edge response caching.
  - *Negative*: Worker code must be deployed separately via Wrangler.
