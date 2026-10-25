# 🎨 Frontend: Styling Architecture & Tokens

> **Tag**: #styling #css #design-tokens
> **Related Notes**: [[Design System]], [[Application Shell]]

## Implementation Strategy
- Pure vanilla CSS in `<style>` tag inside `index.html`.
- All design tokens declared in `:root` (colors, typography, radii, glassmorphism filters, transitions).
- Zero runtime CSS-in-JS dependencies.
- Hardware-accelerated transitions (`transform`, `opacity`, `will-change`).
