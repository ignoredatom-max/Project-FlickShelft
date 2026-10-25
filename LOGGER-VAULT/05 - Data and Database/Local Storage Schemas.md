# 💾 Local Storage Schemas & Keys

> **Tag**: #localstorage #cache
> **Related Notes**: [[ADR-005 Client-Side Multi-Tier Caching for Instant Boot]]

- `lgr_cache_<uid>`: Serialized JSON array of all diary entries for a given user.
- `logger-wl`: Serialized JSON array of active watchlist items.
- `profileKey('name')` (`lgr_name_<uid>`): Local cache of display name.
- `profileKey('pfp')` (`lgr_pfp_<uid>`): Local cache of compressed profile avatar.
- `profileKey('picks')` (`lgr_picks_<uid>`): Local cache of Top Picks array.
