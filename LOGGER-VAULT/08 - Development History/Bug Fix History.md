# 🐛 Bug Fix History — Significant Solved Problems

> **Tag**: #bugs #history #troubleshooting
> **Related Notes**: [[CHANGELOG]], [[Lessons Learned]]

1. **Sticky Header & Containing Block Transform Conflict (October 2026)**:
   - *Cause*: `@keyframes pageFadeIn` had `transform: translateY(0)` with `animation-fill-mode: both`, establishing a transformed containing block that broke CSS `position: sticky`.
   - *Fix*: Changed animation to a pure opacity fade.
2. **Series Rewatch Infinite Loop (March 2026)**:
   - *Cause*: Mutual event feedback loop between season picker and duplicate checker.
   - *Fix*: Separated state triggers and only tagged rewatch if season <= previous season.
3. **Android Keyboard Input Displacement (August 2026)**:
   - *Cause*: Mobile soft keyboard pushed floating card out of the viewport.
   - *Fix*: Anchored modal to `calc(32px + safe-area)` with scroll lock.
