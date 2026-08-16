/* ==========================================================================
   LOGGER - FAVOURITES PAGE
   ========================================================================== */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { getTypeIcon } from '../config/constants.js';
import { openInfo } from '../components/entry-info.js';

export function initFavouritesPage() {
  // Category segment buttons
  document.querySelectorAll('#page-favs .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#page-favs .seg-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      state.favsFilter = btn.dataset.ff;
      renderFavs();
    });
  });

  // Back button -> navigate to Profile
  const backBtn = document.querySelector('.favs-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      router.navigate('profile');
    });
  }

  state.subscribe((event) => {
    if (event === 'entries_changed' || event === 'favs_filter_changed') {
      renderFavs();
    }
  });
}

export function renderFavs() {
  const container = document.getElementById('fav-list');
  const favsSub = document.getElementById('favsSub');
  if (!container) return;

  let list = state.entries.filter(x => x.fav);

  if (state.favsFilter !== 'all') {
    list = list.filter(x => x.type === state.favsFilter);
  }

  if (favsSub) {
    favsSub.textContent = `${list.length} ${list.length === 1 ? 'favourite' : 'favourites'} ❤️`;
  }

  if (!list.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-ico-svg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div class="empty-title">No favourites yet</div>
        <div class="empty-sub">Tap ❤️ on any log entry to add it here</div>
      </div>
      <div class="list-footer">made with love by <span onclick="window.openAbout()" style="cursor:pointer;text-decoration:underline;text-underline-offset:2px;">Aditya</span> ♥️</div>
    `;
    return;
  }

  container.innerHTML = list.map((e, i) => {
    const icon = getTypeIcon(e.type);
    const posterHtml = e.poster
      ? `<img class="fav-thumb" src="${e.poster}" alt="" loading="lazy">`
      : `<div class="fav-ph">${icon}</div>`;

    return `
      <div class="fav-card ${e.type || 'movie'}" data-id="${e.id}" style="animation-delay:${Math.min(i * 20, 200)}ms">
        ${posterHtml}
        <div class="fav-info">
          <div class="fav-title">${e.title}</div>
          <div class="fav-sub">${[e.year, e.genre].filter(Boolean).join(' · ')}</div>
        </div>
      </div>
    `;
  }).join('') + `<div class="list-footer">made with love by <span onclick="window.openAbout()" style="cursor:pointer;text-decoration:underline;text-underline-offset:2px;">Aditya</span> ♥️</div>`;

  container.querySelectorAll('.fav-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      openInfo(id, 'favs');
    });
  });
}
