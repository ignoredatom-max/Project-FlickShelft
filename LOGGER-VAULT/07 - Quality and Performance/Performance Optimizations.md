# ⚡ Performance Optimizations

> **Tag**: #performance #optimization #rendering
> **Related Notes**: [[Movie Wall]], [[ADR-005 Client-Side Multi-Tier Caching for Instant Boot]], [[ADR-006 Replacing Graph View with Native DOM Movie Wall]]

1. **Retina Thumbnail Downgrading**:
   - Converts heavy TMDB `/w500/` images to `/w185/` thumbnails, slashing memory usage by 75%.
2. **Native CSS Grid over Canvas Simulations**:
   - Replaced canvas graph view with CSS Grid to eliminate continuous requestAnimationFrame loops on mobile.
3. **Asynchronous Image Decoding**:
   - Images tagged with `loading="lazy"` and `decoding="async"`.
4. **Instant Boot Cache**:
   - Renders entries from `localStorage` before Firebase authentication resolves.
