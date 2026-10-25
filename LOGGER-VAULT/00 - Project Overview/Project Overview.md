# 📖 Project Overview — Logger

> **Tag**: #overview #project
> **Related Notes**: [[HOME]], [[Product Vision]], [[Feature Inventory]], [[Technology Stack]], [[System Architecture]]

## What is Logger?
**Logger** (repository name: `Project-FlickShelft`) is an independent, personal media diary application crafted by **ATOMYN** (developer: Aditya Kachare). It functions as a lightweight, private, and aesthetic digital logbook for tracking movies, TV series, and video games.

The app addresses a key frustration among media enthusiasts: existing logging platforms are either overly social, fragmented across different media types (Letterboxd for films, Serializd for shows, Backloggd for games), slow to load, or bloated with social feeds. Logger unifies all three visual media categories into a single, cohesive, dark-mode Progressive Web App (PWA).

## Key Characteristics
- **Unified Tri-Media Diary**: Seamlessly tracks films, multi-season series, and games in a single chronological timeline.
- **Letterboxd-Inspired Elegance**: Clean, distraction-free aesthetic with tight rows, poster thumbnails, emotive ratings, and customizable profile pages.
- **Instant Client-Side Boot**: Built on vanilla web standards without framework hydration delays, booting in milliseconds using multi-tier `localStorage` cache.
- **Dual Mode (Private & Public)**: Authenticated users have private Cloud Firestore databases; visitors can view another user's diary in read-only mode via URL parameter (`?u=UID`).
- **Network Resilience**: Uses an edge Cloudflare Worker proxy to circumvent ISP DNS tampering on TMDB and game APIs on mobile carriers.
