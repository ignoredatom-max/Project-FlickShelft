# 🧭 Frontend: Navigation Dock

> **Tag**: #frontend #navigation #dock
> **Related Notes**: [[Application Shell]], [[Routing Architecture]], [[UI and UX Patterns]]

## Purpose
An iOS-inspired floating navigation dock at the bottom of the screen with a sliding active capsule and detached center Add FAB.

## Implementation Details
- **Source**: `index.html` (CSS lines ~130-220, Markup lines ~6580-6640)
- **Elements**:
  - `.nav`: Fixed container at `bottom: 0; left: 0; right: 0;` with background gradient scrim.
  - `.nav-dock`: Floating capsule with `backdrop-filter: blur(28px)` containing Diary, Calendar, Watchlist, and Profile tabs.
  - `.nav-indicator`: High-contrast solid pure white (`#ffffff`) pill sliding smoothly behind the active tab with elevation drop-shadow (`box-shadow: 0 3px 14px rgba(0,0,0,0.35)`).
  - `.nav-btn.on`: Active button typography and SVG icon stroke switch to solid black (`#000000`, 700 weight) for maximum contrast against the white pill.
  - `.nav-add-btn`: Detached center floating circle button with `+` icon triggering the [[Add and Edit Entry Modal]].
- **Playful Spring Animation**: Position and width transitions use a spring cubic-bezier curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Haptic Integration**: Tapping any navigation button dispatches `navigator.vibrate(6)` on supported devices.

## Clickable Logo & Return Home
- Tapping the app logo in `.logo-wrap` or `.sc-logo-wrap` triggers `navigateToHome()`.
- Automatically switches to the Diary tab (`#page-log`), updates the dock indicator with spring animation, and smoothly scrolls the window and page container to top (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
- Styled with `.logo-clickable` featuring `cursor: pointer` and subtle touch compression (`transform: scale(0.97)`).
