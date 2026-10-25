# 🧩 Component: Toast and Feedback System

> **Tag**: #component #feedback #toast
> **Related Notes**: [[Application Shell]], [[UI and UX Patterns]]

## Purpose
Lightweight non-intrusive notification toasts and cloud sync indicators.

## Implementation Details
- **`toast(msg, type, duration, action)`**: Displays floating message pill at the bottom of the screen with optional action buttons (e.g. "Undo" on watchlist deletion).
- **`flashCloud()`**: Briefly animates a small cloud sync indicator in the header confirming Firestore writes.
