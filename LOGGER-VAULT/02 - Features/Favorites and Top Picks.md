# ❤️ Feature: Favorites and Top Picks

> **Tag**: #feature #favorites
> **Related Notes**: [[User Profiles]], [[Favourites Page]]

## Purpose
Highlighting exceptional titles and curated "Mount Rushmore" favorites.

## Status: Implemented
- **Top Picks (Profile Showcase)**:
  - Four showcase slots on the user profile.
  - Tapping a slot opens a selector to choose from existing 5-star / Peak diary entries.
  - Stored in Firestore profile metadata; loads for public visitors even without full local cache.
- **Favorites List (`#page-favs`)**:
  - Filtered subset of all diary entries where `fav === true`.
  - Accessible via the Profile page or direct navigation.
  - Supports filtering by media category (All, Films, Series, Games).
