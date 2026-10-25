# 🧩 Component: Deep Media Info Card (`#deepOverlay`)

> **Tag**: #component #overlay #encyclopedia
> **Related Notes**: [[Movies]], [[TV Series]], [[Games]], [[Franchise Collection Overlay]]

## Purpose
Full-screen encyclopedia overlay providing comprehensive metadata, credits, cast, certifications, and streaming platforms for any selected media title.

## Implementation Details
- **Source**: `index.html` (`openDeepCard()`, `closeDeepCard()`)
- **Key Features**:
  - **Parallax Hero Backdrop**: Smooth scroll-linked parallax scaling on hero image.
  - **Cast Carousel**: Horizontal carousel of cast members with photos and character names.
  - **Attribution & Certifications**: Content rating badges (PG-13, R, TV-MA) fetched live via Worker.
  - **Franchise Collection Link**: Detects belonging to a film collection, rendering a "View Full Collection" timeline button.
  - **Share Review Button**: Triggers image export for existing diary entries.
