/* ==========================================================================
   LOGGER - ADD & EDIT ENTRY MODAL COMPONENT
   ========================================================================== */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { RATINGS, RATING_LABELS, getStatusOptions, getDoneLabel } from '../config/constants.js';
import { todayVal, dateToMidnightTs } from '../utils/dates.js';
import { searchMedia, fetchTvSeasons } from '../services/api.js';
import { fsSave } from '../services/firestore.js';
import { toast, debounce } from '../utils/helpers.js';

let _editId = null;
let _mType = 'movie';
let _mTitle = '';
let _mPoster = '';
let _mGenre = '';
let _mYear = '';
let _mFav = false;
let _mRating = 'decent';
let _mSeasons = 0;
let _mLastSeason = 0;
let _mRewatch = false;
let _mStartDate = '';
let _mCustomDate = '';

export function initEntryModal() {
  // Register with router
  router.registerModalHandler('entry_modal', {
    onOpen: (params) => {
      _showModalDOM(params.entry, params.prefill);
    },
    onClose: () => {
      _hideModalDOM();
    }
  });

  // Type chips (🎬 Film, 📺 Series, 🎮 Game)
  document.querySelectorAll('.type-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.type-chip').forEach(c => c.className = 'type-chip ' + c.dataset.t);
      chip.classList.add('on');
      _mType = chip.dataset.t;
      _updateTypeState();
    });
  });

  // Search input with live API
  const searchInp = document.getElementById('searchInp');
  const dropdown = document.getElementById('dropdown');
  const spin = document.getElementById('spin');

  if (searchInp) {
    const debouncedSearch = debounce(async (q) => {
      if (q.length < 2) {
        if (dropdown) dropdown.classList.remove('show');
        return;
      }
      if (spin) spin.classList.add('show');
      try {
        const results = await searchMedia(q, _mType);
        if (spin) spin.classList.remove('show');
        if (dropdown) {
          const icon = _mType === 'game' ? '🎮' : _mType === 'movie' ? '🎬' : '📺';
          dropdown.innerHTML = !results.length
            ? '<div class="dr-empty">No results found</div>'
            : results.map((r, i) => {
                const th = r.poster
                  ? `<img class="dr-thumb" src="${r.poster}" alt="">`
                  : `<div class="dr-ph">${icon}</div>`;
                return `<div class="dr-item" data-idx="${i}">${th}<div><div class="dr-name">${r.title}</div><div class="dr-meta">${[r.year, r.genre].filter(Boolean).join(' · ') || '—'}</div></div></div>`;
              }).join('');

          dropdown.querySelectorAll('.dr-item').forEach(el => {
            el.addEventListener('click', () => {
              const selected = results[+el.dataset.idx];
              _pickSearchResult(selected);
            });
          });
          dropdown.classList.add('show');
        }
      } catch (e) {
        if (spin) spin.classList.remove('show');
        if (dropdown) {
          dropdown.innerHTML = '<div class="dr-empty">Search failed — check connection</div>';
          dropdown.classList.add('show');
        }
      }
    }, 350);

    searchInp.addEventListener('input', () => {
      const q = searchInp.value.trim();
      _mTitle = '';
      _mPoster = '';
      _mGenre = '';
      _mYear = '';
      _hidePreview();
      _checkDup(q);
      debouncedSearch(q);
    });
  }

  // Clear preview button
  const selClear = document.getElementById('selClear');
  if (selClear) {
    selClear.addEventListener('click', () => {
      _hidePreview();
      if (searchInp) {
        searchInp.value = '';
        searchInp.focus();
      }
    });
  }

  // Rating slider interaction
  const slider = document.getElementById('ratingSlider');
  if (slider) {
    slider.addEventListener('input', () => {
      _updateSlider(slider.value);
    });
  }
  document.querySelectorAll('.r-label').forEach(lbl => {
    lbl.addEventListener('click', () => {
      const idx = RATINGS.indexOf(lbl.dataset.r);
      if (idx !== -1 && slider) {
        slider.value = idx;
        _updateSlider(idx);
      }
    });
  });

  // Modal Favorite toggle
  const favBtn = document.getElementById('modalFav');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      _mFav = !_mFav;
      favBtn.classList.toggle('on', _mFav);
    });
  }

  // Custom Date toggle
  const dateBtn = document.getElementById('modalDateBtn');
  const dateRow = document.getElementById('dateRow');
  if (dateBtn && dateRow) {
    dateBtn.addEventListener('click', () => {
      const isVisible = dateRow.classList.toggle('show');
      dateBtn.classList.toggle('on', isVisible);
    });
  }

  // Cancel button
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      router.closeModal('entry_modal');
    });
  }

  // Backdrop click
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        router.closeModal('entry_modal');
      }
    });
  }

  // Save button
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', _handleSave);
  }

  // Mobile Keyboard Viewport Resizing
  _initVisualViewport();
}

export function openModal(entry = null, prefill = null) {
  router.openModal('entry_modal', { entry, prefill });
}

function _showModalDOM(entry, prefill) {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;

  _editId = entry ? entry.id : null;
  _mFav = entry ? !!entry.fav : false;
  _mRewatch = entry ? !!entry.rewatch : false;
  _mStartDate = entry ? (entry.startDate || '') : '';
  _mCustomDate = entry ? (entry.date || '') : '';
  _mLastSeason = entry ? (entry.lastSeason || 0) : 0;
  _mSeasons = 0;

  const titleEl = document.getElementById('modalTitle');
  if (titleEl) titleEl.textContent = entry ? 'Edit Entry' : 'Log Media';

  const favBtn = document.getElementById('modalFav');
  if (favBtn) favBtn.classList.toggle('on', _mFav);

  // Type selection
  _mType = entry ? entry.type : (prefill ? prefill.type : 'movie');
  document.querySelectorAll('.type-chip').forEach(c => {
    c.className = 'type-chip ' + c.dataset.t;
    if (c.dataset.t === _mType) c.classList.add('on');
  });

  // Prefill or populate
  const src = entry || prefill;
  const searchInp = document.getElementById('searchInp');
  if (src) {
    _mTitle = src.title || '';
    _mPoster = src.poster || '';
    _mGenre = src.genre || '';
    _mYear = src.year || '';
    if (searchInp) searchInp.value = _mTitle;
    _showPreview(_mPoster, _mTitle, [_mYear, _mGenre].filter(Boolean).join(' · '));
  } else {
    _mTitle = '';
    _mPoster = '';
    _mGenre = '';
    _mYear = '';
    if (searchInp) searchInp.value = '';
    _hidePreview();
  }

  // Rating
  _mRating = entry ? (entry.rating || 'decent') : 'decent';
  const rIdx = RATINGS.indexOf(_mRating);
  const slider = document.getElementById('ratingSlider');
  if (slider) {
    slider.value = rIdx !== -1 ? rIdx : 2;
    _updateSlider(slider.value);
  }

  // Status options & dates
  _updateTypeState();
  const statusSel = document.getElementById('statusSel');
  if (statusSel && entry) {
    statusSel.value = entry.status || 'done';
  }

  const startDateInp = document.getElementById('startDateInp');
  if (startDateInp) startDateInp.value = _mStartDate;

  const dateInp = document.getElementById('dateInp');
  const dateRow = document.getElementById('dateRow');
  const dateBtn = document.getElementById('modalDateBtn');
  if (dateInp) {
    dateInp.value = _mCustomDate || todayVal();
    const hasCustom = !!_mCustomDate && _mCustomDate !== todayVal();
    if (dateRow) dateRow.classList.toggle('show', hasCustom);
    if (dateBtn) dateBtn.classList.toggle('on', hasCustom);
  }

  const notesInp = document.getElementById('notesInp');
  if (notesInp) notesInp.value = entry ? (entry.notes || '') : '';

  // Series Season Fetch
  if (_mType === 'series' && _mTitle) {
    fetchTvSeasons(_mTitle).then(seasons => {
      _mSeasons = seasons;
      _renderSeasonPicker(_mLastSeason);
    });
  }

  overlay.classList.add('show');
}

function _hideModalDOM() {
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.remove('show');
  const dropdown = document.getElementById('dropdown');
  if (dropdown) dropdown.classList.remove('show');
}

function _updateTypeState() {
  const statusSel = document.getElementById('statusSel');
  if (statusSel) {
    const opts = getStatusOptions(_mType);
    statusSel.innerHTML = opts.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  }

  const seasonField = document.getElementById('seasonField');
  if (seasonField) {
    seasonField.style.display = _mType === 'series' ? 'block' : 'none';
  }
}

function _pickSearchResult(r) {
  _mTitle = r.title;
  _mPoster = r.poster;
  _mGenre = r.genre;
  _mYear = r.year;

  const searchInp = document.getElementById('searchInp');
  if (searchInp) searchInp.value = r.title;

  const dropdown = document.getElementById('dropdown');
  if (dropdown) dropdown.classList.remove('show');

  _showPreview(_mPoster, _mTitle, [_mYear, _mGenre].filter(Boolean).join(' · '));
  _checkDup(r.title);

  if (_mType === 'series') {
    fetchTvSeasons(r.title).then(seasons => {
      _mSeasons = seasons;
      _renderSeasonPicker(_mLastSeason);
    });
  }
}

function _showPreview(poster, title, sub) {
  const preview = document.getElementById('selPreview');
  const img = document.getElementById('selImg');
  const t = document.getElementById('selTitle');
  const s = document.getElementById('selSub');
  if (!preview) return;

  if (poster && img) {
    img.src = poster;
    img.style.display = 'block';
  } else if (img) {
    img.style.display = 'none';
  }
  if (t) t.textContent = title;
  if (s) s.textContent = sub || '';
  preview.classList.add('show');
}

function _hidePreview() {
  const preview = document.getElementById('selPreview');
  if (preview) preview.classList.remove('show');
}

function _updateSlider(val) {
  const idx = Math.min(Math.max(parseInt(val, 10) || 0, 0), 4);
  _mRating = RATINGS[idx];

  const colors = ['#ff453a', '#ff9f0a', '#00b4d8', '#00c566', '#bf5af2'];
  const fill = document.getElementById('rTrackFill');
  if (fill) {
    fill.style.width = `${(idx / 4) * 100}%`;
    fill.style.background = colors[idx];
  }

  document.querySelectorAll('.r-label').forEach((lbl, i) => {
    lbl.classList.toggle('on', i === idx);
  });
}

function _renderSeasonPicker(selectedUpTo = 0) {
  const picker = document.getElementById('seasonPicker');
  if (!picker) return;

  if (!_mSeasons || _mSeasons < 1) {
    picker.innerHTML = '<span style="font-size:12px;color:var(--text3)">Season details not available</span>';
    return;
  }

  let html = '';
  for (let s = 1; s <= _mSeasons; s++) {
    const isSelected = selectedUpTo >= s;
    html += `<button type="button" class="season-btn ${isSelected ? 'on' : ''}" data-s="${s}">S${s}</button>`;
  }

  picker.innerHTML = html;
  picker.querySelectorAll('.season-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sNum = parseInt(btn.dataset.s, 10);
      _mLastSeason = (_mLastSeason === sNum) ? 0 : sNum;
      _renderSeasonPicker(_mLastSeason);
    });
  });
}

function _checkDup(title) {
  if (!title || _editId) return;
  const ex = state.entries.find(x => x.title.toLowerCase() === title.toLowerCase() && x.type === _mType);
  const isRewatch = !!ex && !(_mType === 'series' && ex.lastSeason > 0 && _mLastSeason > ex.lastSeason);
  const dupBanner = document.getElementById('dupBanner');
  if (dupBanner) {
    dupBanner.classList.toggle('show', isRewatch);
  }
}

async function _handleSave() {
  const searchInp = document.getElementById('searchInp');
  const titleVal = (_mTitle || searchInp?.value || '').trim();
  if (!titleVal) {
    toast('⚠️ Please enter a title');
    return;
  }

  const dateInp = document.getElementById('dateInp');
  const startDateInp = document.getElementById('startDateInp');
  const statusSel = document.getElementById('statusSel');
  const notesInp = document.getElementById('notesInp');

  const customDate = dateInp?.value || todayVal();
  const startDate = startDateInp?.value || '';
  const status = statusSel?.value || 'done';
  const notes = notesInp?.value.trim() || '';

  const entry = {
    id: _editId || Date.now(),
    type: _mType,
    title: titleVal,
    year: _mYear || '',
    genre: _mGenre || '',
    poster: _mPoster || '',
    rating: _mRating,
    fav: _mFav,
    status: status,
    startDate: startDate,
    date: customDate,
    loggedAt: _editId ? (state.entries.find(x => x.id === _editId)?.loggedAt || dateToMidnightTs(customDate)) : dateToMidnightTs(customDate),
    notes: notes,
    lastSeason: _mLastSeason || 0,
    rewatch: _mRewatch
  };

  router.closeModal('entry_modal');
  await fsSave(entry);
  toast(_editId ? '✅ Entry updated' : '✅ Media logged!');
}

function _initVisualViewport() {
  if (!window.visualViewport) return;

  window.visualViewport.addEventListener('resize', () => {
    const vv = window.visualViewport;
    const keyboardHeight = Math.max(0, window.innerHeight - vv.height);
    document.documentElement.style.setProperty('--keyboard-inset', `${keyboardHeight}px`);
    document.documentElement.style.setProperty('--visual-vh', `${vv.height}px`);
  });
}
