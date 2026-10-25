# 📋 Data Models & Entity Schemas

> **Tag**: #data-models #schema
> **Related Notes**: [[Firestore Collections]], [[Media Logging]]

## 1. Diary Entry Entity (`DATA[i]`)
```typescript
interface DiaryEntry {
  id: number;              // Timestamp ID (e.g. 1729864200000)
  type: 'movie' | 'series' | 'game';
  title: string;
  year?: string | number;
  poster?: string;         // Full image URL
  rating: 'skip' | 'mediocre' | 'decent' | 'excellent' | 'peak';
  status: 'done' | 'watching' | 'dropped' | 'started' | 'ongoing';
  date: string;            // ISO Date or locale string
  notes?: string;          // User personal notes or review
  fav?: boolean;           // True if marked favorite
  rewatched?: boolean;     // True if rewatched/replayed
  tmdbId?: number;         // TMDB ID (movies & series)
  igdbId?: number;         // IGDB ID (games)
  seasons?: number;        // Total seasons (series)
  lastSeason?: number;     // Highest watched season (series)
}
```

## 2. Watchlist Item Entity (`WL[i]`)
```typescript
interface WatchlistItem {
  id: number | string;
  type: 'movie' | 'series' | 'game';
  title: string;
  poster?: string;
  year?: string | number;
  releaseDate?: string;    // ISO date for countdown calculation
  tmdbId?: number;
  igdbId?: number;
  order?: number;          // Position index for drag-and-drop
}
```

## 3. Profile Metadata Document
```typescript
interface ProfileMetadata {
  name: string;            // Custom display name
  pfp?: string;            // Base64 compressed image (200x200)
  picks?: DiaryEntry[];    // Top 4 showcase entries
}
```
