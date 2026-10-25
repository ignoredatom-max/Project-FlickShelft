# 📺 Feature: TV Series & Shows

> **Tag**: #feature #series #tv
> **Related Notes**: [[Media Logging]], [[TMDB Integration]], [[Add and Edit Entry Modal]]

## Purpose
Tracking television series, anime, miniseries, and episodic content across multiple seasons.

## Status: Implemented
- **Data Source**: TMDB TV endpoints via proxy (`/api/tv/:id`, `/api/search/tv`).

## Season Tracker Architecture
- When logging a series with *Finished* or *Completed* status, an interactive season picker is displayed.
- Shows total seasons from TMDB metadata (e.g. 1 to 5).
- Tapping Season 3 tags the entry as `lastSeason: 3`.
- Diary list displays status pill as `Completed S3` rather than generic *Finished*.
- Re-logging the series later pre-fills the season selector starting from `lastSeason + 1`.
- Rewatch bug prevention: Logging a higher season does NOT tag as rewatched; only logging an identical or lower season triggers rewatch status.
