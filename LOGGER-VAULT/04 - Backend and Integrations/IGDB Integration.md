# 🎮 IGDB Integration (via Twitch OAuth)

> **Tag**: #integration #igdb #twitch
> **Related Notes**: [[Games]], [[Cloudflare Worker Proxy]], [[ADR-003 Migration from RAWG to IGDB v4 via Twitch OAuth]]

## Overview
Powers video game searches and metadata via the Twitch IGDB v4 API.

## Implementation Flow
1. **OAuth Client Credentials Flow**: Worker requests access token from `https://id.twitch.tv/oauth2/token` using `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET`.
2. **Token Caching**: Access tokens cached in memory until expiry.
3. **APicalypse Queries**: Executes POST queries with specific field selections, filters, and limit clauses.
4. **Acronym & Relevance Filter**: Expands abbreviations and removes DLCs/editions.
5. **RAWG Adapter**: Translates IGDB response into a RAWG-compatible format consumed by the frontend.
