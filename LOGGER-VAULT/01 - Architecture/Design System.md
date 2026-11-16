# 🎨 Design System — Tokens, Typography & Aesthetics

> **Tag**: #design-system #tokens #styling
> **Related Notes**: [[Styling and Design Tokens]], [[UI and UX Patterns]]

Logger follows a strict dark-mode design system defined in CSS `:root` custom properties.

## Core Color Palette
- Base Background: `--bg: #0d0d0f`
- Surface Level 2: `--bg2: #151518`
- Surface Level 3: `--bg3: #1e1e23`
- Surface Level 4: `--bg4: #282830`
- Border Subtle: `--border: rgba(255, 255, 255, 0.07)`
- Border High: `--border2: rgba(255, 255, 255, 0.12)`
- Primary Text: `--text: #f5f5f7`
- Secondary Text: `--text2: #a1a1aa`
- Muted Text: `--text3: #71717a`

## Rating Color Scale (4-Tier Scale)
- Skip: `--red: #ff453a` (Vibrant `#ff4d42`)
- Decent: `--teal: #00b4d8`
- Excellent: `--green: #00c566` (Vibrant `#30d158`)
- Peak: `--purple: #bf5af2`
*(Legacy Mediocre tier mapped into Decent)*

## Segment & Dock Indicators
- **Bottom Dock Indicator**: Pure white solid pill (`#ffffff`) with solid black (`#000000`, 700) active tab text/icons.
- **Top Segment Indicators**: Pure white solid pill (`#ffffff`) with solid black active text.
- **Spring Physics**: Physics-based playful spring curve `cubic-bezier(0.34, 1.56, 0.64, 1)` across all sliding indicators.

## Glassmorphism & Elevation
- Sticky Header: `backdrop-filter: blur(22px) saturate(190%)`
- Corner Radii: `--radius-sm: 12px`, `--radius-md: 16px`, `--radius-lg: 22px`
