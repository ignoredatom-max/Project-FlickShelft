# 🧭 Frontend: Navigation Dock

> **Tag**: #frontend #navigation #dock
> **Related Notes**: [[Application Shell]], [[Routing Architecture]], [[UI and UX Patterns]]

## Purpose
An iOS-inspired floating navigation dock at the bottom of the screen with a sliding active capsule and detached center Add FAB.

## Implementation Details
- **Source**: `index.html` (CSS lines ~80-250, Markup lines ~6640-6690)
- **Elements**:
  - `.nav`: Fixed container at `bottom: 0; left: 0; right: 0;` with background gradient scrim.
  - `.nav-dock`: Floating capsule with `backdrop-filter: blur(28px)` containing Diary, Calendar, Watchlist, and Profile tabs.
  - `.nav-indicator`: Smooth sliding capsule positioned behind the active tab.
  - `.nav-add-btn`: Detached center floating circle button (`width: 64px; height: 64px;`) with `+` icon triggering the [[Add and Edit Entry Modal]].
- **Haptic Integration**: Tapping any navigation button dispatches `navigator.vibrate(8)` on supported Android devices.
