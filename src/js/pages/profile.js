/* ==========================================================================
   LOGGER - PROFILE PAGE & STATISTICS
   ========================================================================== */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { RATING_LABELS, getTypeIcon } from '../config/constants.js';
import {
  getPfp,
  savePfp,
  getCustomName,
  saveCustomName,
  getPicks,
  savePicks,
  getPickExtras,
  savePickExtras,
  getDisplayName
} from '../core/storage.js';
import { formatShortMonth } from '../utils/dates.js';
import { openInfo } from '../components/entry-info.js';
import { toast } from '../utils/helpers.js';
import { updateHeaderAvatar } from '../components/navigation.js';

let _editingPicks = false;

export function initProfilePage() {
  // Favourites card click -> navigate to favourites page
  const favsCard = document.getElementById('profileFavsCard') || document.getElementById('profileFavsShortcut');
  if (favsCard) {
    favsCard.addEventListener('click', () => {
      router.navigate('favs');
    });
  }

  // Name edit
  const nameEl = document.getElementById('profileName');
  if (nameEl) {
    nameEl.addEventListener('click', () => {
      if (document.body.classList.contains('readonly')) return;
      const current = getCustomName() || state.currentUser?.displayName || 'Aditya';
      const input = prompt('Enter your name:', current);
      if (input !== null && input.trim()) {
        saveCustomName(input.trim());
        updateProfileDisplay();
        updateHeaderAvatar();
      }
    });
  }

  // Profile picture file upload
  const pfpInput = document.getElementById('pfpInput');
  if (pfpInput) {
    pfpInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target.result;
        savePfp(url);
        updateHeaderAvatar(url);
        toast('📷 Profile photo updated');
      };
      reader.readAsDataURL(file);
    });
  }

  // Edit Top Picks button
  const editPicksBtn = document.getElementById('editPicksBtn');
  if (editPicksBtn) {
    editPicksBtn.addEventListener('click', () => {
      _editingPicks = !_editingPicks;
      const grid = document.getElementById('topPicksGrid');
      if (grid) grid.classList.toggle('editing-picks', _editingPicks);
      editPicksBtn.textContent = _editingPicks ? 'Done' : 'Edit';
    });
  }

  // Add Pick button in grid
  const addPickBtn = document.getElementById('addPickBtn');
  if (addPickBtn) {
    addPickBtn.addEventListener('click', () => {
      _openPickSelectorModal();
    });
  }

  // Activity range toggle buttons (6M / 12M / All Time)
  document.querySelectorAll('.act-range-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.act-range-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      state.activityRange = btn.dataset.range;
      state.selectedActivityMonth = null;
      renderActivityGraph();
    });
  });

  // Mini sticky header observer on scroll
  const headerBlock = document.getElementById('profileHeaderBlock');
  const miniHeader = document.getElementById('profileMiniHeader');
  if (headerBlock && miniHeader) {
    window.addEventListener('scroll', () => {
      if (!document.getElementById('page-profile')?.classList.contains('on')) return;
      const rect = headerBlock.getBoundingClientRect();
      miniHeader.classList.toggle('visible', rect.bottom < 40);
    }, { passive: true });
  }

  state.subscribe((event) => {
    if (event === 'entries_changed') {
      renderProfile();
    }
  });
}

export function updateProfileDisplay() {
  const name = getDisplayName();
  const nameEl = document.getElementById('profileName');
  const miniNameEl = document.getElementById('profileMiniName');
  if (nameEl) nameEl.textContent = name;
  if (miniNameEl) miniNameEl.textContent = name;

  const total = state.entries.length;
  const subEl = document.getElementById('profileSub');
  if (subEl) {
    subEl.textContent = `${total} ${total === 1 ? 'entry' : 'entries'} logged`;
  }
}

export function renderProfile() {
  updateProfileDisplay();
  updateHeaderAvatar();
  renderTopPicks();
  renderProfileStats();
  renderActivityGraph();
}

export function renderTopPicks() {
  const grid = document.getElementById('topPicksGrid');
  if (!grid) return;

  const picks = getPicks();
  const addBtn = document.getElementById('addPickBtn');

  // Remove existing cards (preserve add button)
  grid.querySelectorAll('.profile-card:not(#addPickBtn)').forEach(c => c.remove());

  picks.forEach(e => {
    const card = document.createElement('div');
    card.className = `profile-card ${e.type || 'movie'}`;
    card.dataset.id = e.id;

    const icon = getTypeIcon(e.type);
    const posterHtml = e.poster
      ? `<img src="${e.poster}" alt="">`
      : `<div class="profile-card-ph">${icon}</div>`;

    card.innerHTML = `
      ${posterHtml}
      <div class="profile-card-overlay"></div>
      <div class="profile-card-type-bar"></div>
      <div class="profile-card-info">
        <div class="profile-card-title">${e.title}</div>
        <span class="profile-card-badge" style="background:rgba(255,255,255,0.15);color:#fff">${e.year || ''}</span>
      </div>
      <button class="profile-card-remove" title="Remove" aria-label="Remove">✕</button>
    `;

    card.addEventListener('click', (ev) => {
      if (ev.target.closest('.profile-card-remove')) return;
      openInfo(e.id, 'profile');
    });

    const removeBtn = card.querySelector('.profile-card-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const remaining = getPicks().filter(x => x.id !== e.id);
        savePicks(remaining);
        renderTopPicks();
      });
    }

    if (addBtn) {
      grid.insertBefore(card, addBtn);
    } else {
      grid.appendChild(card);
    }
  });

  if (addBtn) {
    addBtn.style.display = picks.length < 6 && _editingPicks ? 'flex' : 'none';
  }
}

function renderProfileStats() {
  const mCount = state.entries.filter(x => x.type === 'movie').length;
  const sCount = state.entries.filter(x => x.type === 'series').length;
  const gCount = state.entries.filter(x => x.type === 'game').length;
  const fCount = state.entries.filter(x => x.fav).length;

  const pFilms = document.getElementById('pstatFilms');
  const pSeries = document.getElementById('pstatSeries');
  const pGames = document.getElementById('pstatGames');
  const pFavs = document.getElementById('pstatFavs');

  if (pFilms) pFilms.textContent = mCount;
  if (pSeries) pSeries.textContent = sCount;
  if (pGames) pGames.textContent = gCount;
  if (pFavs) pFavs.textContent = fCount;

  // Breakdown Total
  const bkTotal = document.getElementById('pstatBreakdownTotal');
  const bkFilms = document.getElementById('pstatBkFilms');
  const bkSeries = document.getElementById('pstatBkSeries');
  const bkGames = document.getElementById('pstatBkGames');

  if (bkTotal) bkTotal.textContent = state.entries.length;
  if (bkFilms) bkFilms.textContent = mCount;
  if (bkSeries) bkSeries.textContent = sCount;
  if (bkGames) bkGames.textContent = gCount;

  // Ratings distribution
  ['peak', 'excellent', 'decent', 'mediocre', 'skip'].forEach(r => {
    const el = document.getElementById(`pstatRating_${r}`);
    if (el) {
      el.textContent = state.entries.filter(x => x.rating === r).length;
    }
  });
}

export function renderActivityGraph() {
  const chart = document.getElementById('activityBarChart');
  const headerLbl = document.getElementById('activityHeaderLabel');
  const breakdownTitle = document.getElementById('activityBreakdownTitle');
  const breakdownCount = document.getElementById('activityBreakdownCount');
  const breakdownTags = document.getElementById('activityBreakdownTags');
  if (!chart) return;

  const range = state.activityRange || '6m';
  const rangeNum = range === 'all' ? 24 : (parseInt(range, 10) || 6);

  if (headerLbl) {
    headerLbl.textContent = range === 'all' ? 'ACTIVITY — ALL TIME' : `ACTIVITY — LAST ${rangeNum} MONTHS`;
  }

  // Calculate monthly stats
  const now = new Date();
  const months = [];

  for (let i = rangeNum - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = formatShortMonth(d.getFullYear(), d.getMonth());

    const monthEntries = state.entries.filter(e => {
      const eDate = e.date ? new Date(e.date + 'T12:00:00') : new Date(e.loggedAt || Date.now());
      const eKey = `${eDate.getFullYear()}-${String(eDate.getMonth() + 1).padStart(2, '0')}`;
      return eKey === key;
    });

    const films = monthEntries.filter(x => x.type === 'movie').length;
    const series = monthEntries.filter(x => x.type === 'series').length;
    const games = monthEntries.filter(x => x.type === 'game').length;

    months.push({
      key,
      label,
      fullLabel: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      total: monthEntries.length,
      films,
      series,
      games
    });
  }

  const maxTotal = Math.max(...months.map(m => m.total), 1);
  const activeMonthKey = state.selectedActivityMonth || months[months.length - 1]?.key;
  const activeMonthData = months.find(m => m.key === activeMonthKey) || months[months.length - 1];

  // Update breakdown banner
  if (breakdownTitle && activeMonthData) {
    breakdownTitle.innerHTML = `<span>${activeMonthData.fullLabel}</span>`;
  }
  if (breakdownCount && activeMonthData) {
    breakdownCount.textContent = `${activeMonthData.total} ${activeMonthData.total === 1 ? 'entry' : 'entries'} logged`;
  }
  if (breakdownTags && activeMonthData) {
    breakdownTags.innerHTML = `
      <span class="act-tag act-tag-film">🎬 ${activeMonthData.films}</span>
      <span class="act-tag act-tag-series">📺 ${activeMonthData.series}</span>
      <span class="act-tag act-tag-game">🎮 ${activeMonthData.games}</span>
    `;
  }

  // Render Bar Chart columns
  chart.innerHTML = months.map(m => {
    const pct = Math.max(Math.round((m.total / maxTotal) * 100), 4);
    const isSelected = (m.key === activeMonthKey);
    const countBadge = m.total > 0 ? `<span class="act-bar-count-badge">${m.total}</span>` : '';

    return `
      <div class="act-bar-col ${isSelected ? 'selected' : ''}" data-key="${m.key}">
        <div class="act-bar-track">
          <div class="act-bar-fill" style="height:${pct}%;opacity:${m.total > 0 ? 1 : 0.25}">
            ${countBadge}
          </div>
        </div>
        <span class="act-bar-month-lbl">${m.label}</span>
      </div>
    `;
  }).join('');

  chart.querySelectorAll('.act-bar-col').forEach(col => {
    col.addEventListener('click', () => {
      state.selectedActivityMonth = col.dataset.key;
      renderActivityGraph();
    });
  });
}

function _openPickSelectorModal() {
  const currentPicks = getPicks();
  const available = state.entries.filter(e => !currentPicks.some(p => p.id === e.id));

  if (!available.length) {
    toast('No other entries available to pick');
    return;
  }

  const title = prompt('Enter the title of the entry you want to add to Top Picks:');
  if (!title) return;

  const match = available.find(x => x.title.toLowerCase().includes(title.toLowerCase().trim()));
  if (match) {
    currentPicks.push(match);
    savePicks(currentPicks);
    renderTopPicks();
    toast(`⭐ Added "${match.title}" to Top Picks`);
  } else {
    toast('Entry not found in your diary');
  }
}
