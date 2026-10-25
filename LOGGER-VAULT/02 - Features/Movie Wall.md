# 🧱 Feature: Movie Wall (Poster Collection Showcase)

> **Tag**: #feature #movie-wall #ui-showcase
> **Related Notes**: [[Movie Wall Overlay]], [[Sharing and Snapshots]], [[ADR-006 Replacing Graph View with Native DOM Movie Wall]]

## Purpose
A dedicated, edge-to-edge poster collection showcase displaying every logged movie, series, and video game on a single page with zero text labels.

## Status: Implemented (October 2026, Commit `5e5b9e1`)
- **Primary Source Files**: `index.html` (`openMovieWall()`, `renderMovieWall()`, `shareMovieWall()`)
- **Replaced Feature**: Replaced the performance-heavy Obsidian Canvas Graph View.

## Capabilities & Optimization
- **Single-Page, One-Look Mosaic**: Fits every title on a single screen without vertical scrolling, scaling posters dynamically as the collection size grows.
- **Dynamic Geometric Packing**: Computes the optimal column and row arrangement in real-time ($O(N)$ candidate search) to maximize poster size while strictly fitting within the available viewport width and height.
- **Pure Edge-to-Edge Posters**: Displays poster artwork with dynamically scaled corner radii and subtle shadows—no intrusive text labels.
- **Zero Scroll Lag**: Uses 100% native DOM CSS Grid with `loading="lazy"` and `decoding="async"`, running at 60/120fps.
- **Cinematic Desktop Hover & Mobile Touch**: Hovering on desktop elevates the poster with dynamic zoom scale and displays a floating pill tooltip (title, year, rating). Tapping on mobile provides haptic feedback and opens the full [[Deep Media Info Card]].
- **Retina Thumbnail Optimization**: Converts TMDB image URLs to lightweight `/t/p/w185/` thumbnails to minimize memory footprint.
- **Category Filter Tabs**: Pills for *All, Films, Series, Games*.
- **Interactive**: Tapping any poster opens its full [[Deep Media Info Card]].
