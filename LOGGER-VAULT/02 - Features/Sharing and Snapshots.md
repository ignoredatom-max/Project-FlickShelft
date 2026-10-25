# 📸 Feature: Sharing & Canvas Snapshots

> **Tag**: #feature #sharing #canvas
> **Related Notes**: [[Movie Wall]], [[Deep Media Info Card]], [[Ratings and Reviews]]

## Purpose
Generating crisp, high-resolution aesthetic picture exports of reviews and collections for sharing on social media (Instagram, WhatsApp, X, Discord).

## Status: Implemented
- **Primary Source Files**: `index.html` (`shareMovieWall()`, `openShareCard()`)

## Snapshot Types
1. **Single Entry Review Card**:
   - Generates a card featuring the media poster, title, user rating pill, italicized note quote, and Logger branding.
2. **Collection Wall Snapshot (1080px)**:
   - High-resolution portrait collage generated via HTML5 Canvas.
   - Header with **LOGGER** branding, user title (`Aditya's Media Collection`), and total count badge.
   - Tight mosaic grid of all logged posters with rounded corners.
   - Integrates with native mobile `navigator.share` (attaching a PNG file directly to mobile share sheet) with automatic fallback to download on desktop.
