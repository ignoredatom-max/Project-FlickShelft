/* ==========================================================================
   LOGGER - WATCHLIST & UPCOMING PAGE
   ========================================================================== */

import { state } from '../core/state.js';
import { getTypeIcon } from '../config/constants.js';
import { getWL, saveWL } from '../core/storage.js';
import { searchMedia } from '../services/api.js';
import { fsWLSave } from '../services/firestore.js';
import { openInfo } from '../components/entry-info.js';
import { openModal } from '../components/entry-modal.js';
import { toast, debounce } from '../utils/helpers.js';

let _wlType = 'movie';
let _wlPicked = null;

export function initWatchlistPage() {
  // Watchlist Type selector
  document.querySelectorAll('.wl-tsel').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wl-tsel').forEach(b => b.className = 'wl-tsel ' + b.dataset.wt);
      btn.classList.add('on');
      _wlType = btn.dataset.wt;
      _wlPicked = null;
      const inp = document.getElementById('wlInp');
      if (inp) {
        inp.value = '';
        _closeWlDropdown();
      }
    });
  });

  const wlInp = document.getElementById('wlInp');
  const wlDropdown = document.getElementById('wlDropdown');
  const wlSpin = document.getElementById('wlSpin');

  if (wlInp) {
    const debouncedWlSearch = debounce(async (q) => {
      if (q.length < 2) {
        _closeWlDropdown();
        return;
      }
      if (wlSpin) wlSpin.classList.add('show');
      try {
        const results = await searchMedia(q, _wlType);
        if (wlSpin) wlSpin.classList.remove('show');
        if (wlDropdown) {
          const icon = _wlType === 'game' ? '🎮' : _wlType === 'movie' ? '🎬' : '📺';
          wlDropdown.innerHTML = !results.length
            ? '<div class="dr-empty">No results found</div>'
            : results.map((r, i) => {
                const th = r.poster
                  ? `<img class="dr-thumb" src="${r.poster}" alt="">`
                  : `<div class="dr-ph">${icon}</div>`;
                return `<div class="dr-item" data-idx="${i}">${th}<div><div class="dr-name">${r.title}</div><div class="dr-meta">${[r.year, r.genre].filter(Boolean).join(' · ') || '—'}</div></div></div>`;
              }).join('');

          wlDropdown.querySelectorAll('.dr-item').forEach(el => {
            el.addEventListener('click', () => {
              const selected = results[+el.dataset.idx];
              _wlPicked = selected;
              wlInp.value = selected.title;
              _closeWlDropdown();
              _confirmAddWl();
            });
          });
          wlDropdown.classList.add('show');
        }
      } catch (e) {
        if (wlSpin) wlSpin.classList.remove('show');
      }
    }, 350);

    wlInp.addEventListener('input', () => {
      _wlPicked = null;
      debouncedWlSearch(wlInp.value.trim());
    });
  }

  const wlAddBtn = document.getElementById('wlAddBtn');
  if (wlAddBtn) {
    wlAddBtn.addEventListener('click', _confirmAddWl);
  }

  // Load initial watchlist from storage
  state.watchlist = getWL();

  state.subscribe((event) => {
    if (event === 'watchlist_changed') {
      renderWL();
      renderUpcoming();
    }
  });
}

function _closeWlDropdown() {
  const wlDropdown = document.getElementById('wlDropdown');
  if (wlDropdown) wlDropdown.classList.remove('show');
}

async function _confirmAddWl() {
  const wlInp = document.getElementById('wlInp');
  const title = (wlInp?.value || '').trim();
  if (!title) {
    toast('⚠️ Enter a title to add');
    return;
  }

  const item = {
    title: _wlPicked ? _wlPicked.title : title,
    type: _wlType,
    year: _wlPicked ? _wlPicked.year : '',
    poster: _wlPicked ? _wlPicked.poster : '',
    genre: _wlPicked ? _wlPicked.genre : '',
    releaseDate: _wlPicked ? (_wlPicked.releaseDate || '') : '',
    addedAt: Date.now()
  };

  const list = getWL();
  list.unshift(item);
  saveWL(list);
  await fsWLSave(list);

  if (wlInp) wlInp.value = '';
  _wlPicked = null;
  _closeWlDropdown();
  toast('📌 Added to watchlist');
  renderWL();
  renderUpcoming();
}

export function renderWL() {
  const container = document.getElementById('wl-list');
  if (!container) return;

  const list = state.watchlist || [];

  if (!list.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-ico-svg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="empty-title">Your watchlist is empty</div>
        <div class="empty-sub">Search above and add something</div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, i) => {
    const icon = getTypeIcon(item.type);
    const posterHtml = item.poster
      ? `<img class="wl-thumb" src="${item.poster}" alt="" loading="lazy">`
      : `<div class="wl-ph">${icon}</div>`;

    return `
      <div class="wl-card ${item.type || 'movie'}" data-idx="${i}" style="animation-delay:${Math.min(i * 20, 200)}ms">
        ${posterHtml}
        <div class="wl-info">
          <div class="wl-title">${item.title}</div>
          <div class="wl-sub">${[item.year, item.genre].filter(Boolean).join(' · ')}</div>
        </div>
        <div class="wl-actions">
          <button class="wl-log-btn" data-idx="${i}">+ Log</button>
          <button class="wl-del" data-idx="${i}" title="Remove from Watchlist" aria-label="Remove">✕</button>
        </div>
      </div>
    `;
  }).join('');

  // Click card to open info
  container.querySelectorAll('.wl-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.wl-log-btn') || e.target.closest('.wl-del')) return;
      const idx = +card.dataset.idx;
      const item = list[idx];
      if (item) openInfo(item, 'wl');
    });
  });

  // Log button
  container.querySelectorAll('.wl-log-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = +btn.dataset.idx;
      const item = list[idx];
      if (item) {
        openModal(null, {
          title: item.title,
          type: item.type,
          poster: item.poster,
          genre: item.genre,
          year: item.year
        });
      }
    });
  });

  // Delete button
  container.querySelectorAll('.wl-del').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idx = +btn.dataset.idx;
      const currentList = getWL();
      currentList.splice(idx, 1);
      saveWL(currentList);
      await fsWLSave(currentList);
      renderWL();
      renderUpcoming();
      toast('Removed from watchlist');
    });
  });
}

export function renderUpcoming() {
  const section = document.getElementById('upcomingSection');
  const grid = document.getElementById('upcomingGrid');
  if (!section || !grid) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const itemsWithRelease = (state.watchlist || []).filter(x => x.releaseDate && x.releaseDate >= todayStr);

  if (!itemsWithRelease.length) {
    section.style.display = 'none';
    return;
  }

  // Sort by release date ascending
  itemsWithRelease.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

  grid.innerHTML = itemsWithRelease.map(item => {
    const icon = getTypeIcon(item.type);
    const posterHtml = item.poster
      ? `<img class="upcoming-poster" src="${item.poster}" alt="">`
      : `<div class="upcoming-poster-ph">${icon}</div>`;

    const diffDays = Math.ceil((new Date(item.releaseDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
    const countdownText = diffDays === 0 ? 'Today' : `${diffDays}d`;

    return `
      <div class="upcoming-card ${item.type}">
        <div class="upcoming-poster-wrap">${posterHtml}</div>
        <div class="upcoming-type-bar"></div>
        <div class="upcoming-body">
          <div class="upcoming-title">${item.title}</div>
          <div class="upcoming-countdown-num">${countdownText}</div>
          <div class="upcoming-countdown-lbl">${item.releaseDate}</div>
          <div class="upcoming-genre">${item.genre || ''}</div>
        </div>
      </div>
    `;
  }).join('');

  section.style.display = 'block';
}
