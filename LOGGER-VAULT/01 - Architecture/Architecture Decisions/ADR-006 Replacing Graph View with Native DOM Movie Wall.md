# ADR-006: Replacing Graph View with Native DOM Movie Wall

- **Status**: Accepted
- **Date**: October 2026
- **Context**: An Obsidian-inspired 2D Canvas force-directed graph view was implemented, but suffered from severe frame drops and battery drain on mobile phones.
- **Decision**: Completely scrap the canvas graph engine and replace it with a native DOM [[Movie Wall]] using CSS Grid, pure edge-to-edge posters, and a 1080px canvas snapshot exporter.
- **Consequences**:
  - *Positive*: 100% lag-free 60/120fps scrolling on mobile, zero idle CPU usage, responsive 4-column poster grid.
  - *Negative*: Planetary revolution and orbit visualization removed.
