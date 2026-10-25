# 🪦 Post-Mortem: Obsidian Universe Graph View Sunset

> **Tag**: #archive #post-mortem #performance
> **Date**: October 2026
> **Commit**: `5e5b9e1`
> **Successor Feature**: [[Movie Wall]]

## Background
In August 2026, an experimental "Poster Universe" feature was developed, directly inspired by Obsidian's interactive graph view. It rendered every diary entry as a floating planetary node on an HTML5 `<canvas>`, connected by invisible gravitation links, with shockwaves, time-expansion animations, and continuous orbital revolutions.

## The Problem
While visually impressive on high-end desktop hardware, the feature caused severe performance degradation on mobile devices:
1. **CPU & Battery Drain**: Continuous `requestAnimationFrame` loop recalculating N-body gravitational physics on every single frame.
2. **Touch Lag**: Mobile gestures (pinch zoom, pan, node dragging) triggered collision algorithms that dropped frame rates to < 20fps.
3. **Memory Pressure**: High-res canvas backing stores on retina screens consumed hundreds of megabytes of mobile browser memory.

## The Decision & Resolution
Aditya decided to completely scrap the canvas graph view and replace it with the **[[Movie Wall]]**:
- Removed ~1,900 lines of complex canvas physics, timeline scrubbers, and animation loops.
- Replaced with a pure native DOM CSS Grid displaying posters edge-to-edge with no labels.
- Slashed memory usage, eliminated idle CPU consumption entirely, and restored silky-smooth 60/120fps scrolling on all mobile devices.
