/* ==========================================================================
   LOGGER - UNIFIED ENTRY INFO CARD COMPONENT
   ========================================================================== */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { RATING_LABELS, getDoneLabel, getPillLabel, getTypeIcon } from '../config/constants.js';
import { formatLogDate, formatDateDiff } from '../utils/dates.js';
import { fetchExtraDetails } from '../services/api.js';
import { fsDelete } from '../services/firestore.js';
import { toast } from '../utils/helpers.js';

let _activeEntry = null;
let _activeContext = 'log';
let _onEditRequest = null;
let _onShareRequest = null;

export function initEntryInfo({ onEdit, onShare }) {
  _onEditRequest = onEdit;
  _onShareRequest = onShare;

  // Register modal with router
  router.registerModalHandler('info', {
    onOpen: (params) => {
      _showInfoCardDOM(params.entry, params.context);
    },
    onClose: () => {
      _hideInfoCardDOM();
    }
  });

  // Close button (pinned top-right)
  const closeBtn = document.getElementById('infoClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      router.closeModal('info');
    });
  }

  // Backdrop click to close
  const overlay = document.getElementById('infoOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        router.closeModal('info');
      }
    });
  }

  // Action button clicks inside Info Card
  const editBtn = document.getElementById('infoBtnEdit');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (_activeEntry && _onEditRequest) {
        _onEditRequest(_activeEntry);
      }
    });
  }

  const shareBtn = document.getElementById('infoBtnShare');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (_activeEntry && _onShareRequest) {
        const entryToShare = _activeEntry;
        _onShareRequest(entryToShare);
      }
    });
  }

  const delBtn = document.getElementById('infoBtnDelete');
  if (delBtn) {
    delBtn.addEventListener('click', () => {
      if (_activeEntry) {
        openDeleteConfirm(_activeEntry);
      }
    });
  }

  initDeleteConfirm();

  // Refresh active entry if state updates while info sheet is open
  state.subscribe((event) => {
    if (event === 'entries_changed' && _activeEntry) {
      const updated = state.entries.find(x => x.id === _activeEntry.id);
      if (updated) {
        _activeEntry = updated;
        const overlay = document.getElementById('infoOverlay');
        if (overlay && overlay.classList.contains('show')) {
          _showInfoCardDOM(updated, _activeContext);
        }
      }
    }
  });
}

export function openInfo(entryOrId, context = 'log') {
  let entry = entryOrId;
  if (typeof entryOrId === 'number' || typeof entryOrId === 'string') {
    entry = state.entries.find(x => String(x.id) === String(entryOrId));
  }
  if (!entry) return;

  _activeEntry = entry;
  _activeContext = context;
  router.openModal('info', { entry, context });
}

function _showInfoCardDOM(entry, context) {
  const overlay = document.getElementById('infoOverlay');
  const sheet = document.getElementById('infoSheet');
  if (!overlay || !sheet) return;

  _activeEntry = entry;
  sheet.className = `info-sheet ${entry.type || 'movie'}`;

  // Poster
  const posterEl = document.getElementById('infoPoster');
  const phEl = document.getElementById('infoPosterPh');
  if (posterEl && phEl) {
    if (entry.poster) {
      posterEl.src = entry.poster;
      posterEl.style.display = 'block';
      phEl.style.display = 'none';
    } else {
      posterEl.style.display = 'none';
      phEl.style.display = 'flex';
      phEl.textContent = getTypeIcon(entry.type);
    }
  }

  // Type & Status Pill
  const typePill = document.getElementById('infoTypePill');
  if (typePill) {
    const typeName = entry.type === 'game' ? 'Game' : entry.type === 'series' ? 'Series' : 'Film';
    typePill.textContent = typeName;
  }

  // Fav Tag
  const favTag = document.getElementById('infoFavTag');
  if (favTag) favTag.style.display = entry.fav ? 'inline-flex' : 'none';

  // Rewatch Tag
  const rwTag = document.getElementById('infoRewatchTag');
  if (rwTag) rwTag.style.display = entry.rewatch ? 'inline-flex' : 'none';

  // TMDB Score placeholder
  const scoreTag = document.getElementById('infoScore');
  if (scoreTag) scoreTag.style.display = 'none';

  // Title, Year, Genre
  const titleEl = document.getElementById('infoTitle');
  if (titleEl) titleEl.textContent = entry.title || '';

  const yearEl = document.getElementById('infoYear');
  if (yearEl) yearEl.textContent = entry.year ? `(${entry.year})` : '';

  const genreEl = document.getElementById('infoGenre');
  if (genreEl) genreEl.textContent = entry.genre || '';

  // Overview
  const ovEl = document.getElementById('infoOverview');
  if (ovEl) {
    ovEl.textContent = 'Loading overview…';
    ovEl.style.display = 'block';
  }

  // Details grid
  const detailsEl = document.getElementById('infoDetails');
  if (detailsEl) detailsEl.innerHTML = '';

  // My Diary Entry section
  const diarySec = document.getElementById('infoDiarySection');
  if (context === 'wl') {
    if (diarySec) diarySec.style.display = 'none';
  } else {
    if (diarySec) diarySec.style.display = 'block';

    // Rating
    const rKey = entry.rating || 'decent';
    const rLabel = RATING_LABELS[rKey] || 'Decent';
    const rContainer = document.getElementById('infoDiaryRating');
    if (rContainer) {
      rContainer.innerHTML = `<span class="rating-badge r-${rKey}">${rLabel}</span>`;
    }
    const rPill = document.getElementById('infoRatingPill');
    if (rPill) {
      rPill.className = `info-rating-pill r-${rKey}`;
      rPill.textContent = rLabel;
    }

    // Date
    const formattedDate = entry.loggedAt ? formatLogDate(entry.loggedAt) : (entry.date || '—');
    const dateVal = document.getElementById('infoDiaryDate') || document.getElementById('infoLoggedDateVal');
    if (dateVal) dateVal.textContent = formattedDate;

    // Status
    const statusText = getPillLabel(entry.status, entry.type, entry);
    const statusVal = document.getElementById('infoDiaryStatus') || document.getElementById('infoStatusVal');
    if (statusVal) statusVal.textContent = statusText;

    // Review Box
    const revBox = document.getElementById('infoDiaryReviewBox') || document.getElementById('infoReviewBox');
    const revContent = document.getElementById('infoDiaryNotes') || document.getElementById('infoReviewContent');
    if (revBox && revContent) {
      if (entry.notes && entry.notes.trim()) {
        revBox.classList.remove('is-empty');
        revContent.textContent = entry.notes;
      } else {
        revBox.classList.add('is-empty');
        revContent.textContent = 'No review added yet';
      }
    }
  }

  // Render Journey Section
  renderJourneySection(entry, context);

  // Actions
  const isReadOnly = document.body.classList.contains('readonly') || context === 'wl';
  const actionsWrap = document.getElementById('infoActions');
  if (actionsWrap) {
    if (isReadOnly) {
      actionsWrap.innerHTML = '';
      actionsWrap.style.display = 'none';
    } else {
      actionsWrap.innerHTML = `
        <button class="btn-share" id="infoShareBtn" style="margin-bottom:8px">🔗 Share Card</button>
        <button class="info-btn-edit" id="infoEditBtn" style="width:100%;padding:13px;background:var(--bg3);border:1px solid var(--border2);color:var(--text);border-radius:14px;font-size:14px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">✏️ Edit Entry</button>
      `;
      actionsWrap.style.display = 'block';

      document.getElementById('infoShareBtn')?.addEventListener('click', () => {
        if (_onShareRequest) _onShareRequest(_activeEntry);
      });
      document.getElementById('infoEditBtn')?.addEventListener('click', () => {
        if (_onEditRequest && _activeEntry) {
          _onEditRequest(_activeEntry);
        }
      });
    }
  }

  // Fetch full details asynchronously from API
  fetchExtraDetails(entry).then(extra => {
    if (!extra || _activeEntry?.id !== entry.id) return;
    if (extra.overview && ovEl) {
      ovEl.textContent = extra.overview;
    } else if (ovEl) {
      ovEl.style.display = 'none';
    }
    if (extra.score && scoreTag) {
      scoreTag.textContent = extra.score;
      scoreTag.style.display = 'inline-flex';
    }
    if (extra.details && detailsEl) {
      detailsEl.innerHTML = extra.details.map(d => `
        <div class="info-detail-item">
          <div class="info-detail-lbl">${d.l}</div>
          <div class="info-detail-val">${d.v}</div>
        </div>
      `).join('');
    }
  });

  overlay.classList.add('show');
}

function _hideInfoCardDOM() {
  const overlay = document.getElementById('infoOverlay');
  if (overlay) overlay.classList.remove('show');
  _activeEntry = null;
}

function renderJourneySection(entry, context) {
  const jSec = document.getElementById('infoJourneySection');
  if (!jSec) return;

  if (context === 'wl' || (!entry.startDate && !entry.status && !entry.loggedAt)) {
    jSec.style.display = 'none';
    return;
  }

  const startVal = entry.startDate || null;
  const finishVal = entry.loggedAt ? new Date(entry.loggedAt).toISOString().slice(0, 10) : (entry.date || null);
  const isDone = (entry.status === 'done' || !entry.status);
  const isOngoing = (entry.status === 'ongoing' || entry.status === 'playing' || entry.status === 'watching' || entry.status === 'started');

  if (!startVal && !isOngoing) {
    jSec.style.display = 'none';
    return;
  }

  let stepsHtml = '';
  if (startVal) {
    stepsHtml += `
      <div class="timeline-step">
        <div class="timeline-marker start"><div class="timeline-dot"></div><div class="timeline-line"></div></div>
        <div class="timeline-content">
          <span class="timeline-badge start">Started</span>
          <div class="timeline-meta">${formatLogDate(new Date(startVal).getTime())}</div>
        </div>
      </div>
    `;
  }

  if (isDone && finishVal) {
    stepsHtml += `
      <div class="timeline-step">
        <div class="timeline-marker end"><div class="timeline-dot"></div></div>
        <div class="timeline-content">
          <span class="timeline-badge end">${getDoneLabel(entry.type)}</span>
          <div class="timeline-meta">${formatLogDate(new Date(finishVal).getTime())}</div>
        </div>
      </div>
    `;
  } else if (isOngoing) {
    const ongoingLbl = entry.type === 'game' ? 'Playing' : 'Watching';
    stepsHtml += `
      <div class="timeline-step ongoing-step">
        <div class="timeline-marker ongoing"><div class="timeline-dot"></div></div>
        <div class="timeline-content">
          <span class="timeline-badge ongoing">${ongoingLbl}</span>
          <div class="timeline-meta">In Progress</div>
        </div>
      </div>
    `;
  }

  let durationHtml = '';
  if (startVal && finishVal && isDone) {
    const diff = formatDateDiff(startVal, finishVal);
    if (diff) {
      durationHtml = `
        <div class="timeline-duration-card">
          <span class="timeline-duration-lbl">Total Time</span>
          <span class="timeline-duration-val">${diff}</span>
        </div>
      `;
    }
  }

  jSec.innerHTML = `
    <div class="info-section-hdr">Journey</div>
    <div class="info-timeline">${stepsHtml}</div>
    ${durationHtml}
  `;
  jSec.style.display = 'block';
}

/* ── DELETE CONFIRMATION ────────────────────── */
let _pendingDeleteEntry = null;

function initDeleteConfirm() {
  const overlay = document.getElementById('confirmOverlay');
  const cancelBtn = document.getElementById('confirmCancelBtn');
  const dangerBtn = document.getElementById('confirmDeleteBtn') || document.getElementById('confirmDangerBtn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (overlay) overlay.style.display = 'none';
      _pendingDeleteEntry = null;
    });
  }

  if (dangerBtn) {
    dangerBtn.addEventListener('click', async () => {
      if (_pendingDeleteEntry) {
        const id = _pendingDeleteEntry.id;
        if (overlay) overlay.style.display = 'none';
        router.closeModal('info');
        await fsDelete(id);
        toast('🗑 Entry deleted');
        _pendingDeleteEntry = null;
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        _pendingDeleteEntry = null;
      }
    });
  }
}

function openDeleteConfirm(entry) {
  _pendingDeleteEntry = entry;
  const overlay = document.getElementById('confirmOverlay');
  const titleEl = document.getElementById('confirmTitle');
  const msgEl = document.getElementById('confirmMsg');

  if (titleEl) titleEl.textContent = 'Delete Entry?';
  if (msgEl) msgEl.textContent = `Are you sure you want to remove "${entry.title}" from your diary?`;
  if (overlay) overlay.style.display = 'flex';
}
