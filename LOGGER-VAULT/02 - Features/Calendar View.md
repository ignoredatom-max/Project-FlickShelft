# 📅 Feature: Calendar View

> **Tag**: #feature #calendar
> **Related Notes**: [[Calendar Page]], [[Media Logging]]

## Purpose
A visual monthly calendar interface displaying what media was consumed on each specific calendar day.

## Status: Implemented (Revamped in v2.1.1)
- **Primary Source Files**: `index.html` (`renderCalendar()`)

## Features
- **Poster Cell Thumbnails**: Days with logged media render miniature poster artwork directly inside the date cell.
- **Multi-Item Overflow Badges**: When multiple titles are logged on the same date, renders the primary poster plus a `+N` badge (e.g. `+2`).
- **Date Detail Drawer**: Tapping any date highlights the cell and opens a list of entries logged on that day below the calendar grid.
- **Month Navigation**: Arrow buttons allow navigation across past months and years with localized header dates.
