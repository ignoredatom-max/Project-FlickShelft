# 🎬 Feature: Movies (Films)

> **Tag**: #feature #movies #tmdb
> **Related Notes**: [[Media Logging]], [[TMDB Integration]], [[Deep Media Info Card]]

## Purpose
Tracking feature-length films, documentaries, animated features, and film franchises.

## Status: Implemented
- **Data Source**: TMDB API v3 via Cloudflare Worker proxy (`/api/movie/:id`, `/api/search/movie`).
- **Entity Identification**: Indexed by TMDB integer ID (`tmdbId`).

## Key Capabilities
- **Rich Metadata Extraction**: Runtime, release year, director, director of photography (cinematographer), top billed cast, genre tags.
- **Certifications**: Evaluates regional age certifications (US: PG-13, R; UK: 12A, 15; India: U/A, A) displayed prominently in the [[Deep Media Info Card]].
- **Watch Providers**: Surfaces JustWatch streaming, rental, and buy providers by country.
- **Franchise Collections**: Detects if a movie belongs to a TMDB collection (e.g. *The Dark Knight Trilogy*), enabling the [[Franchise Collection Overlay]].
