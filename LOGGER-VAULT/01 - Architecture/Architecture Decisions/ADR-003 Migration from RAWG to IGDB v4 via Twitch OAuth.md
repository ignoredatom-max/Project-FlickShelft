# ADR-003: Migration from RAWG to IGDB v4 via Twitch OAuth

- **Status**: Accepted
- **Date**: August 2026
- **Context**: RAWG API experienced severe rate limits and incomplete metadata for retro/indie games.
- **Decision**: Migrate game searches and metadata to Twitch IGDB v4.
- **Consequences**:
  - *Positive*: Far deeper game catalog, Twitch client credentials flow, smart acronym matching.
  - *Implementation*: Cloudflare Worker translates IGDB format into RAWG-compatible shape for zero frontend data disruption.
