# 🧩 Component: Rating and Status Controls

> **Tag**: #component #controls #ratings
> **Related Notes**: [[Ratings and Reviews]], [[Add and Edit Entry Modal]]

## Purpose
Tactile touch-friendly controls for selecting 4-tier ratings and contextual media statuses.

## Implementation Details
- **Rating Segmented Bar**: Full-width horizontal tab container (`.rating-bar`, height `46px`, `border-radius: 14px`, `padding: 3.5px`) with 4 equal buttons (`Skip`, `Decent`, `Excellent`, `Peak`) taking 25% width each.
- **Spring Indicator**: Solid colored sliding pill (`.rating-indicator`) using physics-based spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Per-Tier Distinct Colors**:
  - `Skip`: Vibrant red (`#ff4d42`) with red glow.
  - `Decent`: Vibrant teal (`#00b4d8`) with teal glow.
  - `Excellent`: Vibrant green (`#30d158`) with green glow.
  - `Peak`: Vibrant purple (`#bf5af2`) with purple glow.
- **Active State High Contrast**: The active button text transitions to solid black (`#000000`, font-weight 800) for sharp readability against the colored pill.
- **Gesture Support**: Supports both instant button clicks and smooth continuous drag/swipe gestures across the bar with haptic vibration feedback.
- **Zero-Loss Data Migration**: Legacy `mediocre` entries automatically migrate to `decent` on app startup across local storage caches and Firestore cloud documents, backed by a persistent one-time check flag (`lgr_migrated_v4_ratings`).
- **Status Pickers**: Context-aware buttons (Films: *Watched, Want to watch*; Series: *Watching, Completed, Dropped*; Games: *Completed, Started, Ongoing, Backlog*).
