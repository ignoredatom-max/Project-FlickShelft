const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const ROOT = __dirname;
const UPSTREAM_PROXY = 'https://logger-proxy.ignoredatom.workers.dev';
const TMDB_API_KEY = 'f387c81953ce058f114109b8c1a7fee5';

// Fallback certifications for well-known media when offline/error
const POPULAR_TV_RATINGS = {
  '46260': { results: [{ iso_3166_1: 'US', rating: 'TV-PG' }, { iso_3166_1: 'JP', rating: 'PG12' }, { iso_3166_1: 'GB', rating: '12' }, { iso_3166_1: 'DE', rating: '12' }] }, // Naruto
  '1396': { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }, { iso_3166_1: 'GB', rating: '18' }, { iso_3166_1: 'DE', rating: '16' }, { iso_3166_1: 'FR', rating: '16' }] }, // Breaking Bad
  '1399': { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }, { iso_3166_1: 'GB', rating: '18' }, { iso_3166_1: 'AU', rating: 'R18+' }] }, // Game of Thrones
  '66732': { results: [{ iso_3166_1: 'US', rating: 'TV-14' }, { iso_3166_1: 'GB', rating: '15' }, { iso_3166_1: 'DE', rating: '16' }] }, // Stranger Things
  '85937': { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }, { iso_3166_1: 'GB', rating: '18' }] }, // Demon Slayer
  '1429': { results: [{ iso_3166_1: 'US', rating: 'TV-14' }, { iso_3166_1: 'JP', rating: 'PG12' }, { iso_3166_1: 'GB', rating: '15' }] }, // Attack on Titan
  '37854': { results: [{ iso_3166_1: 'US', rating: 'TV-14' }, { iso_3166_1: 'JP', rating: 'PG12' }, { iso_3166_1: 'GB', rating: '12' }] }, // One Piece
  '60059': { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }, { iso_3166_1: 'GB', rating: '15' }] }, // Better Call Saul
  '94605': { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }, { iso_3166_1: 'GB', rating: '18' }] }, // Arcane
  '100088': { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }, { iso_3166_1: 'GB', rating: '18' }] }, // The Last of Us
};

const POPULAR_MOVIE_RATINGS = {
  '157336': { results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'PG-13' }] }, { iso_3166_1: 'GB', release_dates: [{ certification: '12A' }] }, { iso_3166_1: 'IN', release_dates: [{ certification: 'U/A' }] }, { iso_3166_1: 'JP', release_dates: [{ certification: 'G' }] }] }, // Interstellar
  '27205': { results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'PG-13' }] }, { iso_3166_1: 'GB', release_dates: [{ certification: '12A' }] }, { iso_3166_1: 'IN', release_dates: [{ certification: 'U/A' }] }] }, // Inception
  '155': { results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'PG-13' }] }, { iso_3166_1: 'GB', release_dates: [{ certification: '12A' }] }, { iso_3166_1: 'IN', release_dates: [{ certification: 'U/A' }] }] }, // The Dark Knight
  '872585': { results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'R' }] }, { iso_3166_1: 'GB', release_dates: [{ certification: '15' }] }, { iso_3166_1: 'IN', release_dates: [{ certification: 'A' }] }] }, // Oppenheimer
  '299534': { results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'PG-13' }] }, { iso_3166_1: 'GB', release_dates: [{ certification: '12A' }] }, { iso_3166_1: 'IN', release_dates: [{ certification: 'U/A' }] }] }, // Avengers: Endgame
};

const POPULAR_COLLECTIONS = {
  '263': {
    id: 263,
    name: 'The Dark Knight Collection',
    overview: 'The Dark Knight trilogy is a superhero film trilogy based on the DC Comics character Batman.',
    poster_path: '/bqQEe1CgGZfW3a7T9P3o0h3o0Wv.jpg',
    backdrop_path: '/7T4yO4f3A9yZfP4h0h0Wv.jpg',
    parts: [
      { id: 272, title: 'Batman Begins', release_date: '2005-06-10', poster_path: '/4MpDbBtAXagB79NW825Q0EEYNg.jpg', vote_average: 7.7 },
      { id: 155, title: 'The Dark Knight', release_date: '2008-07-16', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', vote_average: 8.5 },
      { id: 49026, title: 'The Dark Knight Rises', release_date: '2012-07-16', poster_path: '/hrJnrNuBf0j7xLpT06aXJ3O3z2R.jpg', vote_average: 7.8 }
    ]
  },
  '86311': {
    id: 86311,
    name: 'The Avengers Collection',
    overview: 'A superhero film franchise based on the Marvel Comics superhero team of the same name.',
    parts: [
      { id: 24428, title: 'The Avengers', release_date: '2012-04-25', poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', vote_average: 7.7 },
      { id: 99861, title: 'Avengers: Age of Ultron', release_date: '2015-04-22', poster_path: '/4ssDuvEDkS9Nqq8ew229ey20Y94.jpg', vote_average: 7.3 },
      { id: 299536, title: 'Avengers: Infinity War', release_date: '2018-04-25', poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', vote_average: 8.2 },
      { id: 299534, title: 'Avengers: Endgame', release_date: '2019-04-24', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', vote_average: 8.3 }
    ]
  }
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

async function fetchTmdbDirect(endpoint, queryParams = {}) {
  const qStr = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const url = `https://api.themoviedb.org/3${endpoint}?api_key=${TMDB_API_KEY}${qStr ? '&' + qStr : ''}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Logger-Dev-Server/1.0'
        }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 120 * (attempt + 1)));
    }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ── API PROXY ROUTES (Forward to Cloudflare Edge Proxy) ──────
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Handle collection search route
    if (pathname === '/api/search/collection') {
      const query = parsedUrl.query.query || '';
      if (!query) {
        res.writeHead(200);
        res.end(JSON.stringify({ results: [] }));
        return;
      }
      try {
        const tmdbData = await fetchTmdbDirect('/search/collection', { query });
        if (tmdbData) {
          res.writeHead(200);
          res.end(JSON.stringify(tmdbData));
          return;
        }
      } catch (e) {
        // Return clean empty array rather than breaking search
        res.writeHead(200);
        res.end(JSON.stringify({ results: [] }));
        return;
      }
    }

    // Image proxy
    if (pathname === '/api/image') {
      const imgPath = parsedUrl.query.path;
      if (!imgPath || !imgPath.startsWith('/')) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid path' }));
        return;
      }
      const size = parsedUrl.query.size || 'w200';
      const imgUrl = `https://image.tmdb.org/t/p/${size}${imgPath}`;
      try {
        const imgResp = await fetch(imgUrl);
        if (!imgResp.ok) {
          res.writeHead(imgResp.status);
          res.end(JSON.stringify({ error: 'Image not found' }));
          return;
        }
        const imgBuf = await imgResp.arrayBuffer();
        res.writeHead(200, {
          'Content-Type': imgResp.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=604800'
        });
        res.end(Buffer.from(imgBuf));
        return;
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    // Handle collection route — try hardcoded fallback, then real TMDB, then upstream proxy
    const collMatch = pathname.match(/^\/api\/movie\/collection\/(\d+)$/);
    if (collMatch) {
      const collId = collMatch[1];
      if (POPULAR_COLLECTIONS[collId]) {
        res.writeHead(200);
        res.end(JSON.stringify(POPULAR_COLLECTIONS[collId]));
        return;
      }
      // Not in local cache — fetch directly from TMDB
      try {
        const tmdbData = await fetchTmdbDirect(`/collection/${collId}`);
        if (tmdbData) {
          res.writeHead(200);
          res.end(JSON.stringify(tmdbData));
          return;
        }
      } catch (e) {
        // fall through to upstream proxy
      }
    }

    try {
      const upstreamUrl = `${UPSTREAM_PROXY}${req.url}`;
      const upstreamRes = await fetch(upstreamUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Logger-Dev-Server/1.0'
        }
      });
      let data = await upstreamRes.json();

      // Enrich TV Series with genuine content ratings from TMDB
      const tvMatch = pathname.match(/^\/api\/tv\/(\d+)$/);
      if (tvMatch && (!data.content_ratings || !data.content_ratings.results || !data.content_ratings.results.length)) {
        const id = tvMatch[1];
        try {
          const crUrl = `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${TMDB_API_KEY}`;
          const crRes = await fetch(crUrl);
          if (crRes.ok) {
            const crData = await crRes.json();
            if (crData && crData.results && crData.results.length) {
              data.content_ratings = crData;
            }
          }
        } catch (e) {
          // ignore
        }
        if ((!data.content_ratings || !data.content_ratings.results || !data.content_ratings.results.length) && POPULAR_TV_RATINGS[id]) {
          data.content_ratings = POPULAR_TV_RATINGS[id];
        }
      }

      // Enrich Game Details with background_image / cover if missing from old deployed worker
      const gameMatch = pathname.match(/^\/api\/game\/([a-zA-Z0-9_-]+)$/);
      if (gameMatch && data && !data.background_image && !data.cover) {
        const gameIdOrTitle = gameMatch[1];
        const searchQ = data.name || gameIdOrTitle.replace(/-/g, ' ');
        try {
          const sRes = await fetch(`${UPSTREAM_PROXY}/api/search/game?query=${encodeURIComponent(searchQ)}&page_size=5`);
          const sData = await sRes.json();
          const list = sData.results || sData;
          if (Array.isArray(list) && list.length > 0) {
            const matched = list.find(g => String(g.id) === String(data.id) || (g.name && data.name && g.name.toLowerCase() === data.name.toLowerCase())) || list[0];
            if (matched && matched.background_image) {
              data.background_image = matched.background_image;
              data.cover = matched.background_image;
            }
          }
        } catch (err) {
          // ignore
        }
      }

      // Enrich Movies with genuine release dates & certifications from TMDB
      const movieMatch = pathname.match(/^\/api\/movie\/(\d+)$/);
      if (movieMatch && (!data.release_dates || !data.release_dates.results || !data.release_dates.results.length)) {
        const id = movieMatch[1];
        try {
          const rdUrl = `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${TMDB_API_KEY}`;
          const rdRes = await fetch(rdUrl);
          if (rdRes.ok) {
            const rdData = await rdRes.json();
            if (rdData && rdData.results && rdData.results.length) {
              data.release_dates = rdData;
            }
          }
        } catch (e) {
          // ignore
        }
        if ((!data.release_dates || !data.release_dates.results || !data.release_dates.results.length) && POPULAR_MOVIE_RATINGS[id]) {
          data.release_dates = POPULAR_MOVIE_RATINGS[id];
        }
      }

      res.writeHead(upstreamRes.status);
      res.end(JSON.stringify(data));
      return;
    } catch (err) {
      console.error('Proxy Error:', err);
      // If collection failed upstream, check fallback
      if (collMatch && POPULAR_COLLECTIONS[collMatch[1]]) {
        res.writeHead(200);
        res.end(JSON.stringify(POPULAR_COLLECTIONS[collMatch[1]]));
        return;
      }
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // ── STATIC FILE SERVING ───────────────────────────────────────
  let safePath = decodeURIComponent(pathname.replace(/^\/+/, ''));
  if (!safePath) safePath = 'index.html';

  let filePath = path.join(ROOT, safePath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('=================================================');
  console.log(` Logger Node Server (Static + Rich API Proxy)`);
  console.log(` Local URL:   http://localhost:${PORT}`);
  console.log(` LAN URL:     http://192.168.0.103:${PORT}`);
  console.log('=================================================');
});
