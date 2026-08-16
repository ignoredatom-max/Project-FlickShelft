/* ==========================================================================
   LOGGER - LOG FEED PAGE
   ========================================================================== */

import { state } from '../core/state.js';
import { RATING_LABELS, getDoneLabel, getPillLabel, getTypeIcon } from '../config/constants.js';
import { formatLogDate } from '../utils/dates.js';
import { animCount, toast } from '../utils/helpers.js';
import { openInfo } from '../components/entry-info.js';
import { fsSave } from '../services/firestore.js';

export function initLogPage() {
  // Category segment buttons (All / Film / Series / Game)
  document.querySelectorAll('#page-log .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#page-log .seg-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      state.activeFilter = btn.dataset.f;
      renderLog();
    });
  });

  // Sort dropdown (Newest / Oldest / Rating / A-Z)
  const sortSel = document.getElementById('sortSel');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      state.activeSort = sortSel.value;
      renderLog();
    });
  }

  // Subscribe to state changes
  state.subscribe((event) => {
    if (event === 'entries_changed' || event === 'filter_changed' || event === 'sort_changed') {
      renderLog();
      renderStats();
    }
  });
}

export function renderStats() {
  const m = state.entries.filter(x => x.type === 'movie').length;
  const s = state.entries.filter(x => x.type === 'series').length;
  const g = state.entries.filter(x => x.type === 'game').length;
  animCount('cm', m);
  animCount('cs', s);
  animCount('cg', g);
}

export function renderLog() {
  const list = document.getElementById('list');
  if (!list) return;

  let arr = [...state.entries];

  // Category filter
  if (state.activeFilter !== 'all') {
    arr = arr.filter(x => x.type === state.activeFilter);
  }

  // Sort
  if (state.activeSort === 'new') {
    arr.sort((a, b) => (b.loggedAt || 0) - (a.loggedAt || 0));
  } else if (state.activeSort === 'old') {
    arr.sort((a, b) => (a.loggedAt || 0) - (b.loggedAt || 0));
  } else if (state.activeSort === 'rate') {
    const order = { peak: 5, excellent: 4, decent: 3, mediocre: 2, skip: 1 };
    arr.sort((a, b) => (order[b.rating] || 0) - (order[a.rating] || 0));
  } else if (state.activeSort === 'az') {
    arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  if (!arr.length) {
    list.innerHTML = `
      <div class="empty">
        <div class="empty-ico-svg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="empty-title">Nothing in your diary yet</div>
        <div class="empty-sub">Tap + in the bottom nav to start tracking</div>
      </div>
      <div class="list-footer">made with love by <span onclick="window.openAbout()" style="cursor:pointer;text-decoration:underline;text-underline-offset:2px;">Aditya</span> ♥️</div>
    `;
    return;
  }

  // Group by Month if sorted by date
  let lastMonth = '';
  let html = '';

  arr.forEach((e, i) => {
    if (state.activeSort === 'new' || state.activeSort === 'old') {
      const d = new Date(e.loggedAt || Date.now());
      const monthYear = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (monthYear !== lastMonth) {
        lastMonth = monthYear;
        html += `<div class="month-header">${monthYear}</div>`;
      }
    }
    html += _renderRow(e, i);
  });

  html += `<div class="list-footer">made with love by <span onclick="window.openAbout()" style="cursor:pointer;text-decoration:underline;text-underline-offset:2px;">Aditya</span> ♥️</div>`;
  list.innerHTML = html;

  // Row click -> Open Unified Info Card
  list.querySelectorAll('.row').forEach(el => {
    el.addEventListener('click', (ev) => {
      if (ev.target.closest('.row-fav-inline')) return;
      const id = el.dataset.id;
      openInfo(id, 'log');
    });
  });

  // Inline Heart Toggle
  list.querySelectorAll('.row-fav-inline').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      if (document.body.classList.contains('readonly')) return;
      const id = parseInt(btn.dataset.id, 10);
      const entry = state.entries.find(x => x.id === id);
      if (entry) {
        entry.fav = !entry.fav;
        btn.classList.toggle('on', entry.fav);
        await fsSave(entry);
        toast(entry.fav ? '❤️ Added to favourites' : 'Removed from favourites');
      }
    });
  });
}

function _renderRow(e, i) {
  const icon = getTypeIcon(e.type);
  const rKey = e.rating || 'decent';
  const rLabel = RATING_LABELS[rKey] || 'Decent';
  const rClass = `r-${rKey}`;
  const statusLabel = getPillLabel(e.status, e.type, e);
  const statusClass = `pill-${e.status || 'done'}`;
  const d = new Date(e.loggedAt || Date.now());
  const dayNum = String(d.getDate()).padStart(2, '0');

  const posterHtml = e.poster
    ? `<img class="row-thumb" src="${e.poster}" alt="" loading="lazy">`
    : `<div class="row-thumb-ph">${icon}</div>`;

  return `
    <div class="row ${e.type || 'movie'}" data-id="${e.id}" style="animation-delay:${Math.min(i * 25, 300)}ms">
      <div class="row-day">${dayNum}</div>
      ${posterHtml}
      <div class="row-info">
        <div class="row-title-wrap">
          <div class="row-title">${e.title}</div>
          <span class="row-year">${e.year || ''}</span>
        </div>
        <div class="row-meta">
          <span class="rating-badge ${rClass}">${rLabel}</span>
          <span class="pill ${statusClass}">${statusLabel}</span>
          ${e.notes ? '<span class="note-icon" title="Has review">📝</span>' : ''}
          <button class="row-fav-inline ${e.fav ? 'on' : ''}" data-id="${e.id}" title="Toggle Favourite" aria-label="Toggle Favourite">❤️</button>
        </div>
      </div>
    </div>
  `;
}
