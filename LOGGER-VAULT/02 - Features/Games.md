# 🎮 Feature: Video Games

> **Tag**: #feature #games #igdb
> **Related Notes**: [[Media Logging]], [[IGDB Integration]], [[Cloudflare Worker Proxy]]

## Purpose
Logging and tracking video games across PC, consoles (PlayStation, Xbox, Nintendo), and retro platforms.

## Status: Implemented
- **Data Source**: Twitch IGDB API v4 via Cloudflare Worker proxy (`/api/game/:id`, `/api/search/game`).

## Implementation Nuances
- **RAWG Compatibility Adapter**: In August 2026, the backend migrated from RAWG to IGDB v4. To prevent breaking existing diary entries, the Cloudflare Worker translates IGDB entities into RAWG-compatible object structures.
- **Smart Game Ranking & Acronym Expansion**:
  - Automatically expands `gta` to *Grand Theft Auto*, `botw` to *The Legend of Zelda: Breath of the Wild*, `rdr2` to *Red Dead Redemption 2*, etc.
  - Automatically filters out downloadable content (DLCs), skin packs, virtual currency, and expansion packs.
  - Ranks base editions higher than Deluxe / Special editions.
