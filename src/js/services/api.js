/* ==========================================================================
   LOGGER - EXTERNAL MEDIA API SERVICE (TMDB & IGDB VIA PROXY)
   ========================================================================== */

export const API_BASE = 'https://logger-proxy.ignoredatom.workers.dev';
export const TMDB_IMG = `${API_BASE}/api/image?path=`;

export const TMDB_GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  53: 'Thriller', 10752: 'War', 37: 'Western', 10759: 'Action & Adventure',
  10762: 'Kids', 10765: 'Sci-Fi & Fantasy', 10768: 'War & Politics'
};

export async function searchMedia(query, type = 'movie') {
  if (!query || query.trim().length < 2) return [];

  if (type === 'game') {
    const r = await fetch(`${API_BASE}/api/search/game?query=${encodeURIComponent(query)}&page_size=8`);
    const d = await r.json();
    return (d.results || []).map(x => ({
      title: x.name,
      year: x.released ? x.released.slice(0, 4) : '',
      poster: x.background_image || '',
      genre: (x.genres || []).slice(0, 2).map(g => g.name).join(', '),
      releaseDate: x.released || ''
    }));
  }

  const endpoint = type === 'movie' ? 'movie' : 'tv';
  const r = await fetch(`${API_BASE}/api/search/${endpoint}?query=${encodeURIComponent(query)}`);
  const d = await r.json();
  return (d.results || []).slice(0, 8).map(x => ({
    title: x.title || x.name || '',
    year: (x.release_date || x.first_air_date || '').slice(0, 4),
    poster: x.poster_path ? TMDB_IMG + x.poster_path : '',
    genre: (x.genre_ids || []).slice(0, 2).map(id => TMDB_GENRES[id]).filter(Boolean).join(', '),
    releaseDate: x.release_date || x.first_air_date || ''
  }));
}

export async function fetchTvSeasons(title) {
  try {
    const r = await fetch(`${API_BASE}/api/search/tv?query=${encodeURIComponent(title)}`);
    const d = await r.json();
    const first = d.results?.[0];
    if (!first) return 0;
    const detail = await fetch(`${API_BASE}/api/tv/${first.id}`);
    const tv = await detail.json();
    return (tv.seasons || []).filter(s => s.season_number > 0).length;
  } catch (e) {
    return 0;
  }
}

export async function fetchExtraDetails(entry) {
  try {
    if (entry.type === 'movie') {
      const search = await fetch(`${API_BASE}/api/search/movie?query=${encodeURIComponent(entry.title)}`);
      const sd = await search.json();
      const first = sd.results?.[0];
      if (first) {
        const detail = await fetch(`${API_BASE}/api/movie/${first.id}`);
        const data = await detail.json();
        return {
          overview: data.overview,
          score: data.vote_average ? `⭐ ${data.vote_average.toFixed(1)}` : null,
          details: [
            { l: 'Release', v: data.release_date || '—' },
            { l: 'Runtime', v: data.runtime ? `${data.runtime} min` : '—' },
            { l: 'Language', v: (data.original_language || '').toUpperCase() },
            { l: 'Country', v: data.production_countries?.[0]?.iso_3166_1 || '—' },
            { l: 'Director', v: data.credits?.crew?.find(x => x.job === 'Director')?.name || '—' },
            { l: 'Cast', v: data.credits?.cast?.slice(0, 3).map(x => x.name).join(', ') || '—' }
          ]
        };
      }
    } else if (entry.type === 'series') {
      const search = await fetch(`${API_BASE}/api/search/tv?query=${encodeURIComponent(entry.title)}`);
      const sd = await search.json();
      const first = sd.results?.[0];
      if (first) {
        const detail = await fetch(`${API_BASE}/api/tv/${first.id}`);
        const data = await detail.json();
        return {
          overview: data.overview,
          score: data.vote_average ? `⭐ ${data.vote_average.toFixed(1)}` : null,
          details: [
            { l: 'First Air', v: data.first_air_date || '—' },
            { l: 'Seasons', v: data.number_of_seasons || '—' },
            { l: 'Episodes', v: data.number_of_episodes || '—' },
            { l: 'Status', v: data.status || '—' },
            { l: 'Language', v: (data.original_language || '').toUpperCase() },
            { l: 'Cast', v: data.credits?.cast?.slice(0, 3).map(x => x.name).join(', ') || '—' }
          ]
        };
      }
    } else if (entry.type === 'game') {
      const search = await fetch(`${API_BASE}/api/search/game?query=${encodeURIComponent(entry.title)}&page_size=1`);
      const sd = await search.json();
      const first = sd.results?.[0];
      if (first) {
        const detail = await fetch(`${API_BASE}/api/game/${first.id}`);
        const data = await detail.json();
        return {
          overview: data.description_raw ? (data.description_raw.slice(0, 300) + (data.description_raw.length > 300 ? '…' : '')) : '',
          score: data.rating ? `⭐ ${data.rating.toFixed(1)}` : null,
          details: [
            { l: 'Released', v: data.released || '—' },
            { l: 'Playtime', v: data.playtime ? `~${data.playtime}h` : '—' },
            { l: 'Platforms', v: data.platforms?.slice(0, 2).map(x => x.platform.name).join(', ') || '—' },
            { l: 'Developer', v: data.developers?.[0]?.name || '—' },
            { l: 'Publisher', v: data.publishers?.[0]?.name || '—' },
            { l: 'Rating', v: data.esrb_rating?.name || '—' }
          ]
        };
      }
    }
  } catch (e) {
    console.warn('Extra info fetch failed', e);
  }
  return null;
}
