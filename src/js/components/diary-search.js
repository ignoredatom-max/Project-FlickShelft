/* ==========================================================================
   LOGGER - UNIVERSAL DIARY SEARCH COMPONENT
   ========================================================================== */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { RATING_LABELS, getDoneLabel, getPillLabel, getTypeIcon } from '../config/constants.js';
import { formatLogDate } from '../utils/dates.js';
import { openInfo } from './entry-info.js';

let _diarySearchFilter = 'all';

export function initDiarySearch() {
  // Register with router
  router.registerModalHandler('diary_search', {
    onOpen: () => {
      _showSearchDOM();
    },
    onClose: () => {
      _hideSearchDOM();
    }
  });

  const searchBtn = document.getElementById('toolbarSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      router.openModal('diary_search');
    });
  }

  const cancelBtn = document.getElementById('diarySearchCancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      router.closeModal('diary_search');
    });
  }

  const clearBtn = document.getElementById('diarySearchClear');
  const inputEl = document.getElementById('diarySearchInput');
  if (clearBtn && inputEl) {
    clearBtn.addEventListener('click', () => {
      inputEl.value = '';
      clearBtn.style.display = 'none';
      _renderResults('');
      inputEl.focus();
    });
  }

  if (inputEl) {
    inputEl.addEventListener('input', () => {
      const q = inputEl.value;
      if (clearBtn) clearBtn.style.display = q.length > 0 ? 'flex' : 'none';
      _renderResults(q);
    });
  }

  // Filter chips (All / Film / Series / Game)
  document.querySelectorAll('.diary-search-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diary-search-seg .seg-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      _diarySearchFilter = btn.dataset.sf || 'all';
      _renderResults(inputEl?.value || '');
    });
  });

  // Overlay click to close
  const overlay = document.getElementById('diarySearchOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        router.closeModal('diary_search');
      }
    });
  }
}

export function openDiarySearch() {
  router.openModal('diary_search');
}

function _showSearchDOM() {
  const overlay = document.getElementById('diarySearchOverlay');
  const inputEl = document.getElementById('diarySearchInput');
  if (!overlay) return;

  overlay.classList.add('show');
  if (inputEl) {
    inputEl.value = '';
    _renderResults('');
    setTimeout(() => inputEl.focus(), 80);
  }
}

function _hideSearchDOM() {
  const overlay = document.getElementById('diarySearchOverlay');
  if (overlay) overlay.classList.remove('show');
}

function _renderResults(query) {
  const resultsContainer = document.getElementById('diarySearchResults');
  const countEl = document.getElementById('diarySearchCount');
  if (!resultsContainer) return;

  const rawQuery = (query || '').trim();
  const q = rawQuery.toLowerCase();

  // Filter entries
  let filtered = state.entries;
  if (_diarySearchFilter !== 'all') {
    filtered = filtered.filter(e => e.type === _diarySearchFilter);
  }

  let matches = [];
  if (!q) {
    // Show all entries sorted newest first
    matches = [...filtered].sort((a, b) => (b.loggedAt || 0) - (a.loggedAt || 0));
  } else {
    // Search across Title, Notes/Review, and Genre
    matches = filtered.filter(e => {
      const matchTitle = (e.title || '').toLowerCase().includes(q);
      const matchNotes = (e.notes || '').toLowerCase().includes(q);
      const matchGenre = (e.genre || '').toLowerCase().includes(q);
      return matchTitle || matchNotes || matchGenre;
    }).sort((a, b) => {
      // Prioritize exact/prefix title matches
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      const aStarts = aTitle.startsWith(q);
      const bStarts = bTitle.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return (b.loggedAt || 0) - (a.loggedAt || 0);
    });
  }

  if (countEl) {
    countEl.textContent = `${matches.length} ${matches.length === 1 ? 'entry' : 'entries'}`;
  }

  if (!matches.length) {
    resultsContainer.innerHTML = `
      <div class="diary-search-empty">
        <div class="diary-search-empty-icon">🔍</div>
        <div class="diary-search-empty-title">No entries found</div>
        <div class="diary-search-empty-sub">Try searching with a different title or review keyword.</div>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = matches.map(e => _renderSearchCard(e, q)).join('');

  resultsContainer.querySelectorAll('.diary-search-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      router.closeModal('diary_search');
      setTimeout(() => openInfo(id, 'log'), 60);
    });
  });
}

function _renderSearchCard(e, q) {
  const icon = getTypeIcon(e.type);
  const rKey = e.rating || 'decent';
  const rLabel = RATING_LABELS[rKey] || 'Decent';
  const rClass = `r-${rKey}`;
  const statusLabel = getPillLabel(e.status, e.type, e);
  const statusClass = `pill-${e.status || 'done'}`;
  const dateStr = formatLogDate(e.loggedAt || (e.date ? new Date(e.date).getTime() : 0));

  const posterHtml = e.poster
    ? `<img class="diary-search-thumb" src="${e.poster}" alt="" loading="lazy">`
    : `<div class="diary-search-thumb-ph">${icon}</div>`;

  let notesSnippetHtml = '';
  if (e.notes && e.notes.trim()) {
    const rawNote = e.notes.trim();
    let snippet = rawNote;
    if (q && rawNote.toLowerCase().includes(q)) {
      const idx = rawNote.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 20);
      const end = Math.min(rawNote.length, idx + q.length + 35);
      snippet = (start > 0 ? '…' : '') + rawNote.slice(start, end) + (end < rawNote.length ? '…' : '');
      const regex = new RegExp(`(${_escapeRegex(q)})`, 'gi');
      snippet = snippet.replace(regex, '<mark>$1</mark>');
    } else {
      snippet = snippet.slice(0, 60) + (snippet.length > 60 ? '…' : '');
    }
    notesSnippetHtml = `<div class="diary-search-notes-preview">"${snippet}"</div>`;
  }

  return `
    <div class="diary-search-card ${e.type || 'movie'}" data-id="${e.id}">
      <div class="diary-search-thumb-wrap">${posterHtml}</div>
      <div class="diary-search-info">
        <div class="diary-search-title-row">
          <div class="diary-search-title">${e.title}</div>
          ${e.fav ? '<span style="font-size:11px;color:#ff2d55">❤️</span>' : ''}
        </div>
        <div class="diary-search-meta">${[e.year, dateStr].filter(Boolean).join(' · ')}</div>
        <div class="diary-search-badges">
          <span class="rating-badge ${rClass}">${rLabel}</span>
          <span class="pill ${statusClass}">${statusLabel}</span>
        </div>
        ${notesSnippetHtml}
      </div>
    </div>
  `;
}

function _escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
