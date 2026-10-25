# 🧩 Component: Franchise Collection Overlay (`#collectionOverlay`)

> **Tag**: #component #overlay #franchise
> **Related Notes**: [[Deep Media Info Card]], [[TMDB Integration]]

## Purpose
Chronological film timeline overlay showcasing all movies in a franchise collection (e.g. *The Lord of the Rings*, *Harry Potter*, *Marvel Cinematic Universe*).

## Implementation Details
- **Source**: `index.html` (`openCollectionOverlay()`)
- **Features**: Fetches `/api/movie/collection/:id`, renders poster cards, release years, and vote averages, with instant "Log" or "Watchlist" buttons for unlogged installments.
