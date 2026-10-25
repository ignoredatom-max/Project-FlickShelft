# 💡 Lessons Learned

> **Tag**: #lessons #insights
> **Related Notes**: [[Bug Fix History]], [[Performance Optimizations]]

1. **CSS Sticky Positioning is Fragile**: Never place `transform`, `filter`, or `perspective` on scroll container ancestors.
2. **Mobile Browser Canvas Limits**: 2D force simulations on high-DPI mobile screens drain battery and drop frames rapidly. Native DOM CSS Grid is vastly superior for image collections.
3. **Cache Invalidation**: Always write to in-memory state before triggering `localStorage` writes to prevent stale reads on fast re-renders.
