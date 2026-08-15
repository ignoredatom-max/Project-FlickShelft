/**
 * Logger Cloudflare Worker API Proxy
 * Proxies TMDB and RAWG API calls to bypass ISP DNS blocking and protect credentials.
 */

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/ignoredatom-max\.github\.io$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGIN_PATTERNS.some(p => p.test(origin)) || !origin;
  const allowOrigin = isAllowed && origin ? origin : '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      ...headers,
    },
  });
}

function errorResponse(message, status = 400, headers = {}) {
  return new Response(JSON.stringify({ error: message, status }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

async function fetchJsonSafe(url, options, corsHeaders) {
  try {
    const resp = await fetch(url, options);
    const contentType = resp.headers.get('content-type') || '';

    if (!resp.ok) {
      if (contentType.includes('application/json')) {
        const errJson = await resp.json();
        return jsonResponse(errJson, resp.status, corsHeaders);
      }
      const rawText = await resp.text();
      const cleanMsg = rawText.trim() || `HTTP ${resp.status}`;
      return jsonResponse(
        {
          error: `Upstream service error (${resp.status}): ${cleanMsg}`,
          status: resp.status,
          results: [], // Return empty array so client search doesn't crash
        },
        resp.status === 522 || resp.status === 502 || resp.status === 504 ? 502 : resp.status,
        corsHeaders
      );
    }

    if (contentType.includes('application/json')) {
      const data = await resp.json();
      return jsonResponse(data, 200, corsHeaders);
    }

    const text = await resp.text();
    return jsonResponse({ data: text }, 200, corsHeaders);
  } catch (err) {
    return errorResponse(`Upstream connection failed: ${err.message}`, 504, corsHeaders);
  }
}

// ── SEARCH NORMALIZATION & ALIASES ───────────────────────
const COMMON_ALIASES = {
  'gta': 'Grand Theft Auto',
  'gta 5': 'Grand Theft Auto V',
  'gta v': 'Grand Theft Auto V',
  'gta 4': 'Grand Theft Auto IV',
  'gta iv': 'Grand Theft Auto IV',
  'gta 6': 'Grand Theft Auto VI',
  'gta vi': 'Grand Theft Auto VI',
  'rdr': 'Red Dead Redemption',
  'rdr 2': 'Red Dead Redemption 2',
  'rdr2': 'Red Dead Redemption 2',
  'botw': 'The Legend of Zelda: Breath of the Wild',
  'totk': 'The Legend of Zelda: Tears of the Kingdom',
  'gow': 'God of War',
  'cod': 'Call of Duty',
};

function normalizeSearchQuery(raw, useAliases = true) {
  if (!raw) return '';
  let q = raw.trim().replace(/["'`]/g, '').replace(/\s+/g, ' ');
  if (useAliases) {
    const lower = q.toLowerCase();
    if (COMMON_ALIASES[lower]) {
      q = COMMON_ALIASES[lower];
    }
  }
  return q;
}

const NON_MAIN_GAME_TYPES = [1, 2, 3, 5, 6, 7, 11, 12, 13, 14];
const DLC_NAME_REGEX = /\b(skins? pack|shark card|season pass|expansion pack|dlc pack|dlc|add-on)\b/i;
const EDITION_REGEX = /\b(collector'?s|special|deluxe|game of the year|goty|limited|definitive|anniversary|complete|premium|gold|ultimate|digital)\s+edition\b/i;

function isMainPlayableGame(game) {
  if (game.parent_game) return false;
  if (game.game_type && NON_MAIN_GAME_TYPES.includes(game.game_type)) return false;
  if (game.category && NON_MAIN_GAME_TYPES.includes(game.category)) return false;
  if (DLC_NAME_REGEX.test(game.name || '')) return false;
  return true;
}

function calculateGameRelevance(game, query) {
  let score = 0;
  const nameLower = (game.name || '').toLowerCase();
  const qLower = query.toLowerCase();
  const count = game.total_rating_count || 0;

  if (nameLower === qLower) {
    score += (count >= 10 ? 800 : 150);
  }
  if (nameLower.startsWith(qLower)) score += 300;
  if (nameLower.includes(qLower)) score += 200;

  const escapedWord = qLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp('\\b' + escapedWord + '\\b', 'i').test(nameLower)) {
    score += 250;
  }

  if (count > 0) {
    score += Math.min(Math.log10(count + 1) * 200, 800);
  }

  if (game.cover?.image_id) score += 50;
  if (EDITION_REGEX.test(nameLower)) score -= 250;
  if (game.game_type === 0 || game.category === 0) score += 100;

  return score;
}

// ── IGDB / TWITCH ADAPTER HELPERS ───────────────────────
const ESRB_RATING_MAP = {
  6: 'Rating Pending',
  7: 'Early Childhood',
  8: 'Everyone',
  9: 'Everyone 10+',
  10: 'Teen',
  11: 'Mature 17+',
  12: 'Adults Only 18+',
};

let cachedTwitchToken = null;
let twitchTokenExpiry = 0;

async function getTwitchToken(env) {
  const now = Date.now();
  if (cachedTwitchToken && now < twitchTokenExpiry - 60000) {
    return cachedTwitchToken;
  }

  const clientId = env.TWITCH_CLIENT_ID;
  const clientSecret = env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET secret not configured');
  }

  const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`;
  const res = await fetch(tokenUrl, { method: 'POST' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitch OAuth token request failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  cachedTwitchToken = data.access_token;
  twitchTokenExpiry = now + (data.expires_in || 3600) * 1000;
  return cachedTwitchToken;
}

function igdbToRawgSearchItem(x) {
  return {
    id: x.id,
    name: x.name || '',
    released: x.first_release_date ? new Date(x.first_release_date * 1000).toISOString().slice(0, 10) : '',
    background_image: x.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${x.cover.image_id}.jpg`
      : '',
    genres: (x.genres || []).map(g => ({ name: g.name })),
    rating: x.total_rating
      ? parseFloat((x.total_rating / 20).toFixed(1))
      : (x.rating ? parseFloat((x.rating / 20).toFixed(1)) : null),
  };
}

function igdbToRawgDetail(x) {
  const esrbObj = (x.age_ratings || []).find(r => r.category === 1 && r.rating);
  const esrbName = esrbObj ? ESRB_RATING_MAP[esrbObj.rating] || '—' : '—';

  const devs = (x.involved_companies || [])
    .filter(c => c.developer && c.company?.name)
    .map(c => ({ name: c.company.name }));

  const pubs = (x.involved_companies || [])
    .filter(c => c.publisher && c.company?.name)
    .map(c => ({ name: c.company.name }));

  return {
    id: x.id,
    name: x.name || '',
    description_raw: x.summary || x.storyline || '',
    rating: x.total_rating
      ? parseFloat((x.total_rating / 20).toFixed(1))
      : (x.rating ? parseFloat((x.rating / 20).toFixed(1)) : 0),
    released: x.first_release_date ? new Date(x.first_release_date * 1000).toISOString().slice(0, 10) : '',
    playtime: x.time_to_beat?.normally ? Math.round(x.time_to_beat.normally / 3600) : null,
    platforms: (x.platforms || []).map(p => ({ platform: { name: p.name } })),
    developers: devs,
    publishers: pubs,
    esrb_rating: { name: esrbName },
  };
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = getCorsHeaders(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return errorResponse('Method not allowed', 405, corsHeaders);
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, ''); // Trim trailing slashes
    const searchParams = url.searchParams;

    // Health check endpoint
    if (pathname === '' || pathname === '/' || pathname === '/api/health') {
      return jsonResponse(
        {
          status: 'ok',
          service: 'Logger API Proxy',
          version: '1.0.0',
          endpoints: [
            '/api/search/movie?query=...',
            '/api/search/tv?query=...',
            '/api/search/game?query=...',
            '/api/movie/:id',
            '/api/tv/:id',
            '/api/game/:id',
            '/api/image?path=...',
            '/api/test/igdb?query=... (Test Endpoint)',
            '/api/test/igdb/game/:id (Test Endpoint)',
            '/api/test/igdb/sample (Sample Comparison)',
          ],
        },
        200,
        corsHeaders
      );
    }

    try {
      const fetchOpts = {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Logger-Proxy/1.0 (https://ignoredatom-max.github.io/Project-FlickShelft/)',
        },
        cf: { cacheTtl: 3600, cacheEverything: true },
      };

      // ── ISOLATED IGDB TEST ENDPOINTS ───────────────────────
      if (pathname === '/api/test/igdb' || pathname === '/api/test/igdb/search') {
        const query = searchParams.get('query')?.trim();
        if (!query) return errorResponse('Missing "query" parameter', 400, corsHeaders);

        try {
          const token = await getTwitchToken(env);
          const apicalypseQuery = `search "${query.replace(/"/g, '')}"; fields id, name, first_release_date, cover.image_id, genres.name, rating, total_rating; limit 8;`;

          const igdbRes = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Client-ID': env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'User-Agent': 'Logger-Proxy/1.0',
            },
            body: apicalypseQuery,
          });

          if (!igdbRes.ok) {
            const errText = await igdbRes.text();
            return errorResponse(`IGDB API error (${igdbRes.status}): ${errText}`, igdbRes.status, corsHeaders);
          }

          const igdbList = await igdbRes.json();
          const translatedResults = (igdbList || []).map(igdbToRawgSearchItem);

          return jsonResponse(
            {
              provider: 'IGDB (Translated to RAWG shape)',
              count: translatedResults.length,
              results: translatedResults,
            },
            200,
            corsHeaders
          );
        } catch (e) {
          return errorResponse(`IGDB Test Error: ${e.message}`, 500, corsHeaders);
        }
      }

      // IGDB Game Detail Test Endpoint
      const igdbDetailMatch = pathname.match(/^\/api\/test\/igdb\/game\/(\d+)$/);
      if (igdbDetailMatch) {
        const id = igdbDetailMatch[1];
        try {
          const token = await getTwitchToken(env);
          const apicalypseQuery = `fields id, name, first_release_date, summary, storyline, total_rating, rating, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, age_ratings.category, age_ratings.rating; where id = ${id};`;

          const igdbRes = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Client-ID': env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'User-Agent': 'Logger-Proxy/1.0',
            },
            body: apicalypseQuery,
          });

          if (!igdbRes.ok) {
            const errText = await igdbRes.text();
            return errorResponse(`IGDB API error (${igdbRes.status}): ${errText}`, igdbRes.status, corsHeaders);
          }

          const igdbList = await igdbRes.json();
          const first = igdbList?.[0];
          if (!first) return errorResponse('Game not found on IGDB', 404, corsHeaders);

          const translatedDetail = igdbToRawgDetail(first);
          return jsonResponse(translatedDetail, 200, corsHeaders);
        } catch (e) {
          return errorResponse(`IGDB Test Error: ${e.message}`, 500, corsHeaders);
        }
      }

      // IGDB Sample Comparison Endpoint (shows raw IGDB vs RAWG translated output without credentials)
      if (pathname === '/api/test/igdb/sample') {
        const sampleRawIgdb = {
          id: 1029,
          name: "The Legend of Zelda: Breath of the Wild",
          first_release_date: 1488500000,
          summary: "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.",
          total_rating: 97.4,
          cover: { id: 89123, image_id: "co3p2d" },
          genres: [{ id: 12, name: "Role-playing (RPG)" }, { id: 31, name: "Adventure" }],
          platforms: [{ id: 130, name: "Nintendo Switch" }, { id: 41, name: "Wii U" }],
          involved_companies: [
            { id: 1, developer: true, publisher: false, company: { name: "Nintendo EPD" } },
            { id: 2, developer: false, publisher: true, company: { name: "Nintendo" } },
          ],
          age_ratings: [{ id: 501, category: 1, rating: 9 }], // 9 = ESRB Everyone 10+
          time_to_beat: { normally: 180000 }, // 50 hours (in seconds)
        };

        return jsonResponse(
          {
            description: "IGDB vs RAWG Translation Sample",
            raw_igdb_response: sampleRawIgdb,
            translated_rawg_search_shape: igdbToRawgSearchItem(sampleRawIgdb),
            translated_rawg_detail_shape: igdbToRawgDetail(sampleRawIgdb),
          },
          200,
          corsHeaders
        );
      }

      // ── EXISTING PRODUCTION ROUTES (UNTOUCHED) ──────────────

      // 1. Search Movie (TMDB)
      if (pathname === '/api/search/movie') {
        const query = normalizeSearchQuery(searchParams.get('query'), false);
        if (!query) return errorResponse('Missing "query" parameter', 400, corsHeaders);

        const tmdbKey = env.TMDB_API_KEY;
        if (!tmdbKey) return errorResponse('TMDB_API_KEY secret not configured', 500, corsHeaders);

        const tmdbUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${tmdbKey}`;
        return await fetchJsonSafe(tmdbUrl, fetchOpts, corsHeaders);
      }

      // 2. Search TV Series (TMDB)
      if (pathname === '/api/search/tv') {
        const query = normalizeSearchQuery(searchParams.get('query'), false);
        if (!query) return errorResponse('Missing "query" parameter', 400, corsHeaders);

        const tmdbKey = env.TMDB_API_KEY;
        if (!tmdbKey) return errorResponse('TMDB_API_KEY secret not configured', 500, corsHeaders);

        const tmdbUrl = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&api_key=${tmdbKey}`;
        return await fetchJsonSafe(tmdbUrl, fetchOpts, corsHeaders);
      }

      // 3. Search Video Games (IGDB Adapter with Main Games Filter & Fuzzy Fallback)
      if (pathname === '/api/search/game') {
        const query = normalizeSearchQuery(searchParams.get('query'), true);
        if (!query) return errorResponse('Missing "query" parameter', 400, corsHeaders);

        const pageSize = Math.min(parseInt(searchParams.get('page_size') || '8', 10) || 8, 20);

        try {
          const token = await getTwitchToken(env);
          // Request up to 40 candidate games to allow for filtering and popularity ranking
          const apicalypsePrimary = `search "${query}"; fields id, name, category, game_type, parent_game, first_release_date, cover.image_id, genres.name, rating, total_rating, total_rating_count; limit 40;`;

          let igdbRes = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Client-ID': env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'User-Agent': 'Logger-Proxy/1.0',
            },
            body: apicalypsePrimary,
          });

          if (!igdbRes.ok) {
            const errText = await igdbRes.text();
            return errorResponse(`IGDB API error (${igdbRes.status}): ${errText}`, igdbRes.status, corsHeaders);
          }

          let rawList = await igdbRes.json();
          let igdbList = (rawList || []).filter(isMainPlayableGame);

          // If primary search returned few candidates and query is at least 3 characters, merge fallback wildcard results
          if (igdbList.length < 4 && query.length >= 3) {
            const fallbackQuery = `where name ~ *"${query}"* & parent_game = null & cover != null; fields id, name, category, game_type, parent_game, first_release_date, cover.image_id, genres.name, rating, total_rating, total_rating_count; sort total_rating_count desc; limit 40;`;
            const fallbackRes = await fetch('https://api.igdb.com/v4/games', {
              method: 'POST',
              headers: {
                'Client-ID': env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'User-Agent': 'Logger-Proxy/1.0',
              },
              body: fallbackQuery,
            });
            if (fallbackRes.ok) {
              const fallbackRaw = await fallbackRes.json();
              const filteredFallback = (fallbackRaw || []).filter(isMainPlayableGame);
              const seenIds = new Set(igdbList.map(g => g.id));
              for (const g of filteredFallback) {
                if (!seenIds.has(g.id)) {
                  igdbList.push(g);
                  seenIds.add(g.id);
                }
              }
            }
          }

          // Smart sort: Main games first, high-profile blockbuster rating count boost, edition penalty
          igdbList.sort((a, b) => calculateGameRelevance(b, query) - calculateGameRelevance(a, query));

          const translatedResults = igdbList.slice(0, pageSize).map(igdbToRawgSearchItem);
          return jsonResponse({ results: translatedResults }, 200, corsHeaders);
        } catch (e) {
          return errorResponse(`Game search error: ${e.message}`, 500, corsHeaders);
        }
      }

      // 4. Movie Details & Credits (TMDB)
      const movieMatch = pathname.match(/^\/api\/movie\/(\d+)$/);
      if (movieMatch) {
        const id = movieMatch[1];
        const tmdbKey = env.TMDB_API_KEY;
        if (!tmdbKey) return errorResponse('TMDB_API_KEY secret not configured', 500, corsHeaders);

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&append_to_response=credits`;
        return await fetchJsonSafe(tmdbUrl, fetchOpts, corsHeaders);
      }

      // 5. TV Series Details & Credits (TMDB)
      const tvMatch = pathname.match(/^\/api\/tv\/(\d+)$/);
      if (tvMatch) {
        const id = tvMatch[1];
        const tmdbKey = env.TMDB_API_KEY;
        if (!tmdbKey) return errorResponse('TMDB_API_KEY secret not configured', 500, corsHeaders);

        const tmdbUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbKey}&append_to_response=credits`;
        return await fetchJsonSafe(tmdbUrl, fetchOpts, corsHeaders);
      }

      // 6. Game Details (IGDB Adapter - RAWG compatible format)
      const gameMatch = pathname.match(/^\/api\/game\/([a-zA-Z0-9_-]+)$/);
      if (gameMatch) {
        const id = gameMatch[1];

        try {
          const token = await getTwitchToken(env);
          let apicalypseQuery = '';
          if (/^\d+$/.test(id)) {
            apicalypseQuery = `fields id, name, first_release_date, summary, storyline, total_rating, rating, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, age_ratings.category, age_ratings.rating; where id = ${id};`;
          } else {
            const cleanTitle = id.replace(/-/g, ' ').replace(/"/g, '');
            apicalypseQuery = `search "${cleanTitle}"; fields id, name, first_release_date, summary, storyline, total_rating, rating, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, age_ratings.category, age_ratings.rating; limit 1;`;
          }

          const igdbRes = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Client-ID': env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'User-Agent': 'Logger-Proxy/1.0',
            },
            body: apicalypseQuery,
          });

          if (!igdbRes.ok) {
            const errText = await igdbRes.text();
            return errorResponse(`IGDB API error (${igdbRes.status}): ${errText}`, igdbRes.status, corsHeaders);
          }

          const igdbList = await igdbRes.json();
          const first = igdbList?.[0];
          if (!first) return errorResponse('Game not found', 404, corsHeaders);

          const translatedDetail = igdbToRawgDetail(first);
          return jsonResponse(translatedDetail, 200, corsHeaders);
        } catch (e) {
          return errorResponse(`Game details error: ${e.message}`, 500, corsHeaders);
        }
      }

      // 7. Optional TMDB Image Proxy
      if (pathname === '/api/image') {
        const path = searchParams.get('path')?.trim();
        if (!path || !path.startsWith('/')) {
          return errorResponse('Invalid or missing image "path" parameter', 400, corsHeaders);
        }

        const size = searchParams.get('size') || 'w200';
        const allowedSizes = ['w200', 'w300', 'w500', 'original'];
        const safeSize = allowedSizes.includes(size) ? size : 'w200';

        const imgUrl = `https://image.tmdb.org/t/p/${safeSize}${path}`;
        const imgResp = await fetch(imgUrl, {
          cf: { cacheTtl: 86400 * 7, cacheEverything: true },
        });

        if (!imgResp.ok) {
          return errorResponse('Image not found', imgResp.status, corsHeaders);
        }

        const imgHeaders = new Headers(imgResp.headers);
        imgHeaders.set('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
        imgHeaders.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');

        return new Response(imgResp.body, {
          status: 200,
          headers: imgHeaders,
        });
      }

      return errorResponse(`Endpoint not found: ${pathname}`, 404, corsHeaders);
    } catch (err) {
      return errorResponse(err.message || 'Internal proxy error', 500, corsHeaders);
    }
  },
};
