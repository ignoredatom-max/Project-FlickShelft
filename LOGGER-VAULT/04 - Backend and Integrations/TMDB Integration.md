# 🎥 TMDB (The Movie Database) Integration

> **Tag**: #integration #tmdb #movies #series
> **Related Notes**: [[Movies]], [[TV Series]], [[Cloudflare Worker Proxy]]

## Overview
Provides movie and television metadata, cast, crews, runtimes, posters, and franchise timelines.

## Endpoints Used via Proxy
- `/api/search/movie?query=...`: Search movies.
- `/api/search/tv?query=...`: Search television series.
- `/api/search/collection?query=...`: Search film franchises.
- `/api/movie/:id`: Movie details, release dates, credits.
- `/api/tv/:id`: TV details, content ratings, credits.
- `/api/movie/collection/:id`: Complete franchise film list.
- `/api/image?path=...&size=...`: Proxied poster imageCDN.
