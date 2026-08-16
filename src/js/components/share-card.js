/* ==========================================================================
   LOGGER - SHARE CARD COMPONENT
   ========================================================================== */

import { router } from '../core/router.js';
import { RATINGS, RATING_LABELS, getTypeIcon } from '../config/constants.js';
import { getDisplayName } from '../core/storage.js';
import { generateShareCardImage } from '../utils/share-generator.js';
import { toast } from '../utils/helpers.js';

const RATING_COLOURS = {
  skip: 'var(--red)',
  mediocre: 'var(--orange)',
  decent: 'var(--teal)',
  excellent: 'var(--green)',
  peak: 'var(--purple)'
};

const RATING_BG = {
  skip: 'rgba(255,69,58,0.18)',
  mediocre: 'rgba(255,159,10,0.18)',
  decent: 'rgba(0,180,216,0.18)',
  excellent: 'rgba(0,197,102,0.18)',
  peak: 'rgba(191,90,242,0.18)'
};

let _shareEntry = null;

export function initShareCard() {
  // Register with router
  router.registerModalHandler('share_card', {
    onOpen: (params) => {
      _showShareDOM(params.entry);
    },
    onClose: () => {
      _hideShareDOM();
    }
  });

  const closeBtn = document.getElementById('shareCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      router.closeModal('share_card');
    });
  }

  const overlay = document.getElementById('shareOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        router.closeModal('share_card');
      }
    });
  }

  const dlBtn = document.getElementById('shareDlBtn');
  if (dlBtn) {
    dlBtn.addEventListener('click', async () => {
      if (!_shareEntry) return;
      dlBtn.textContent = '⏳ Generating…';
      dlBtn.disabled = true;
      try {
        const card = document.getElementById('shareCard');
        const dataUrl = await generateShareCardImage(card, _shareEntry);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `logger-${(_shareEntry.title || 'card').replace(/\s+/g, '-').toLowerCase()}.jpg`;
        a.click();
        toast('✅ Card saved!');
      } catch (e) {
        console.error(e);
        toast('❌ Could not generate image');
      }
      dlBtn.textContent = '⬇ Save Image';
      dlBtn.disabled = false;
    });
  }
}

export function openShareCard(entry) {
  if (!entry) return;
  _shareEntry = entry;
  router.openModal('share_card', { entry });
}

function _showShareDOM(entry) {
  _shareEntry = entry;
  const overlay = document.getElementById('shareOverlay');
  if (!overlay) return;

  const icon = getTypeIcon(entry.type);
  const rKey = RATINGS.includes(entry.rating) ? entry.rating : 'decent';

  const nameEl = document.getElementById('scName');
  if (nameEl) nameEl.textContent = getDisplayName();

  const bg = document.getElementById('scBg');
  if (bg) {
    if (entry.poster) {
      bg.style.backgroundImage = `url(${entry.poster})`;
    } else {
      bg.style.backgroundImage = 'none';
    }
  }

  const poster = document.getElementById('scPoster');
  const ph = document.getElementById('scPosterPh');
  if (poster && ph) {
    if (entry.poster) {
      poster.crossOrigin = 'anonymous';
      poster.src = entry.poster + (entry.poster.includes('?') ? '&' : '?') + 'notaint=1';
      poster.style.display = 'block';
      ph.style.display = 'none';
    } else {
      poster.style.display = 'none';
      ph.style.display = 'flex';
      ph.textContent = icon;
    }
  }

  const rWord = document.getElementById('scRatingWord');
  if (rWord) {
    rWord.textContent = RATING_LABELS[rKey];
    rWord.style.background = RATING_BG[rKey];
    rWord.style.color = RATING_COLOURS[rKey];
  }

  const metaEl = document.getElementById('scMeta');
  if (metaEl) {
    metaEl.innerHTML = `<span>${icon}</span>${[entry.genre, entry.year].filter(Boolean).map(x => `<span>${x.toUpperCase()}</span>`).join('<span style="color:rgba(255,255,255,0.2)"> · </span>')}`;
  }

  const titleEl = document.getElementById('scTitle');
  if (titleEl) titleEl.textContent = entry.title || '';

  const noteEl = document.getElementById('scNote');
  if (noteEl) {
    if (entry.notes && entry.notes.trim()) {
      noteEl.textContent = `"${entry.notes}"`;
      noteEl.classList.add('show');
    } else {
      noteEl.classList.remove('show');
    }
  }

  overlay.classList.add('show');
}

function _hideShareDOM() {
  const overlay = document.getElementById('shareOverlay');
  if (overlay) overlay.classList.remove('show');
}
