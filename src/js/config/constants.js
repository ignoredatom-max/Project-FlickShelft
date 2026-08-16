/* ==========================================================================
   LOGGER - CONSTANTS & CONFIGURATION
   ========================================================================== */

export const OWNER_UID = 'kFMRmHi4hzakOaQFx7ccanUsIbl1';
export const CACHE_KEY = 'lgr_cache';

const _urlParams = new URLSearchParams(window.location.search);
export const PUBLIC_UID = _urlParams.get('u') || null;

export const RATINGS = ['skip', 'mediocre', 'decent', 'excellent', 'peak'];

export const RATING_LABELS = {
  skip: 'Skip',
  mediocre: 'Mediocre',
  decent: 'Decent',
  excellent: 'Excellent',
  peak: 'Peak'
};

export const STATUS_OPTIONS_BY_TYPE = {
  movie: [
    { value: 'done', label: 'Watched' },
    { value: 'watching', label: 'Watching' },
    { value: 'want', label: 'Want to Watch' },
    { value: 'dropped', label: 'Dropped' }
  ],
  series: [
    { value: 'done', label: 'Completed' },
    { value: 'ongoing', label: 'Watching' },
    { value: 'want', label: 'Want to Watch' },
    { value: 'dropped', label: 'Dropped' }
  ],
  game: [
    { value: 'done', label: 'Completed' },
    { value: 'playing', label: 'Playing' },
    { value: 'want', label: 'Want to Play' },
    { value: 'dropped', label: 'Dropped' }
  ]
};

export function getStatusOptions(type) {
  return STATUS_OPTIONS_BY_TYPE[type] || STATUS_OPTIONS_BY_TYPE.movie;
}

export function getDoneLabel(type) {
  if (type === 'movie') return 'Watched';
  return 'Completed';
}

export function getPillLabel(statusKey, type, entry = null) {
  if (entry && entry.rewatch) return 'Rewatched';
  if (statusKey === 'done') {
    return type === 'movie' ? 'Watched' : 'Completed';
  }
  if (statusKey === 'ongoing') {
    if (entry && entry.season && entry.season !== 'all') {
      return `Watching S${entry.season}`;
    }
    return 'Watching';
  }
  if (statusKey === 'started') return 'Started';
  if (statusKey === 'playing') return 'Playing';
  if (statusKey === 'watching') return 'Watching';
  if (statusKey === 'want') return 'Want to';
  if (statusKey === 'dropped') return 'Dropped';
  return statusKey || 'Watched';
}

export function getTypeIcon(type) {
  if (type === 'movie') return '🎬';
  if (type === 'series') return '📺';
  if (type === 'game') return '🎮';
  return '🎬';
}
