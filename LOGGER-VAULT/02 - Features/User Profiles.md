# 👤 Feature: User Profiles & Public Profiles

> **Tag**: #feature #profiles
> **Related Notes**: [[Profile Page]], [[Favorites and Top Picks]], [[ADR-007 Public Read-Only Profiles via URL Parameters]]

## Purpose
Showcasing a user's entertainment journey, aggregate stats, favorite titles, and public sharing.

## Status: Implemented
- **Primary Source Files**: `index.html` (`renderProfile()`, `renderPublicProfile()`)

## Key Elements
1. **Custom Display Name**:
   - Users can tap their profile name to edit inline; changes save to Firestore `users/{uid}/meta/profile`.
2. **Compressed Profile Photo**:
   - Uploaded avatars are automatically resized and compressed to 200x200px before uploading to Firestore, eliminating storage bloat.
3. **Animated Stat Counters**:
   - Profile counters (Total Logged, Films, Series, Games) animate upward on page entry via cubic-bezier ticker functions.
4. **Public Profile URLs (`?u=UID`)**:
   - Users can copy their public link. Visitors viewing the link see that user's full diary, Top Picks, and stats in read-only mode.
