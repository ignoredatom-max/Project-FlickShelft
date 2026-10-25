# 📄 Page: Calendar Page (`#page-calendar`)

> **Tag**: #page #calendar #date-grid
> **Related Notes**: [[Calendar View]], [[Media Logging]]

## Purpose
Monthly calendar grid visualizing media consumption habits by date.

## Implementation Details
- **Source**: `index.html` (Markup lines ~6006-6045, JS lines ~8600-8800)
- **Grid Layout**: 7-column weekday layout with previous/next month transitions.
- **Cell Details**: Date cells display miniature poster thumbnails of titles logged on that day, plus `+N` badges for days with multiple entries.
- **Selected Day Drawer**: Tapping any date opens a bottom drawer listing all items logged on that specific day.
