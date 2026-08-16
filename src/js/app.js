/* ==========================================================================
   LOGGER - MASTER APPLICATION BOOTSTRAPPER
   ========================================================================== */

import { state } from './core/state.js';
import { router } from './core/router.js';
import { cacheRead, getWL } from './core/storage.js';
import { initAuth, setReadOnly, updateAuthUI } from './services/auth.js';
import { fsLoad, fsLoadPublic } from './services/firestore.js';
import { PUBLIC_UID } from './config/constants.js';

// Components
import { initNavigation, updateHeaderAvatar } from './components/navigation.js';
import { initEntryInfo, openInfo } from './components/entry-info.js';
import { initEntryModal, openModal } from './components/entry-modal.js';
import { initDiarySearch, openDiarySearch } from './components/diary-search.js';
import { initSettingsSheet, openAbout, closeAbout } from './components/settings-sheet.js';
import { initShareCard, openShareCard } from './components/share-card.js';

// Pages
import { initLogPage, renderLog, renderStats } from './pages/log.js';
import { initCalendarPage, renderCalendar } from './pages/calendar.js';
import { initWatchlistPage, renderWL, renderUpcoming } from './pages/watchlist.js';
import { initFavouritesPage, renderFavs } from './pages/favourites.js';
import { initProfilePage, renderProfile } from './pages/profile.js';

// Expose key helpers to window
window.openModal = openModal;
window.openInfo = openInfo;
window.openDiarySearch = openDiarySearch;
window.openAbout = openAbout;
window.closeAbout = closeAbout;
window.openShareCard = openShareCard;
window.openFavsFromProfile = () => router.navigate('favs');

// Tutorial helpers
function showTutorial() {
  const tut = document.getElementById('tutorialOverlay');
  if (tut) tut.style.display = 'flex';
}
function hideTutorial() {
  const tut = document.getElementById('tutorialOverlay');
  if (tut) tut.style.display = 'none';
}
window.showTutorial = showTutorial;
window.hideTutorial = hideTutorial;

// Main Bootstrap
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Instantly render cached data from LocalStorage
  const cached = cacheRead();
  if (cached && Array.isArray(cached) && cached.length) {
    state.entries = cached;
  }
  state.watchlist = getWL();

  // 2. Initialize Components
  initNavigation({
    onAddClick: () => openModal()
  });

  initEntryInfo({
    onEdit: (entry) => openModal(entry),
    onShare: (entry) => openShareCard(entry)
  });

  initEntryModal();
  initDiarySearch();
  initSettingsSheet();
  initShareCard();

  // 3. Initialize Pages
  initLogPage();
  initCalendarPage();
  initWatchlistPage();
  initFavouritesPage();
  initProfilePage();

  // 4. Initial Render
  renderLog();
  renderStats();
  renderCalendar();
  renderWL();
  renderUpcoming();
  renderFavs();
  renderProfile();

  // 5. Initialize Native History Router
  router.init();

  // 6. Initialize Auth & Sync
  initAuth(async (user) => {
    updateAuthUI();
    if (user) {
      hideTutorial();
      setReadOnly(false);
      await fsLoad();
      renderLog();
      renderStats();
      renderCalendar();
      renderWL();
      renderUpcoming();
      renderFavs();
      renderProfile();
    } else {
      updateHeaderAvatar('', 'A');
      if (PUBLIC_UID) {
        hideTutorial();
        setReadOnly(true);
        await fsLoadPublic(PUBLIC_UID);
        renderLog();
        renderStats();
        renderFavs();
        renderProfile();
      } else {
        setReadOnly(false);
        if (!state.entries.length) {
          showTutorial();
        }
      }
    }
  });

  // Tutorial Sign In button
  const tutSignIn = document.getElementById('tutorialSignInBtn');
  if (tutSignIn) {
    tutSignIn.addEventListener('click', () => {
      document.getElementById('authBtn')?.click();
    });
  }

  // PWA Install Prompt Banner
  _initPwaInstall();
});

function _initPwaInstall() {
  const INSTALL_DISMISSED_KEY = 'lgr_install_dismissed';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) return;

  const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
  if (dismissed && (Date.now() - parseInt(dismissed, 10)) < 7 * 24 * 60 * 60 * 1000) return;

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    _showInstallBanner(() => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
      }
    });
  });

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if (isIos) {
    setTimeout(() => {
      _showInstallBanner(() => {
        alert('To install Logger on iOS:\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"');
      });
    }, 4000);
  }
}

function _showInstallBanner(onInstall) {
  let banner = document.getElementById('installBanner');
  if (banner) return;

  banner = document.createElement('div');
  banner.id = 'installBanner';
  banner.style.cssText = `
    position: fixed;
    bottom: 74px;
    left: 14px;
    right: 14px;
    max-width: 480px;
    margin: 0 auto;
    background: rgba(24,24,27,0.95);
    border: 1px solid var(--border2);
    border-radius: 18px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 99;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    animation: fadeUp 0.3s ease;
  `;

  banner.innerHTML = `
    <img src="icon-192.png" style="width:36px;height:36px;border-radius:9px;flex-shrink:0" alt="">
    <div style="flex:1;min-width:0">
      <div style="font-size:12.5px;font-weight:700;color:var(--text)">Add to Home Screen</div>
      <div style="font-size:10.5px;color:var(--text3)">Install Logger for quick access</div>
    </div>
    <button id="installAcceptBtn" style="background:var(--blue);color:#fff;border:none;padding:7px 14px;border-radius:10px;font-size:11.5px;font-weight:700;cursor:pointer">Install</button>
    <button id="installDismissBtn" style="background:none;border:none;color:var(--text3);font-size:14px;cursor:pointer;padding:4px;line-height:1">✕</button>
  `;

  document.body.appendChild(banner);

  document.getElementById('installAcceptBtn')?.addEventListener('click', () => {
    banner.remove();
    if (onInstall) onInstall();
  });

  document.getElementById('installDismissBtn')?.addEventListener('click', () => {
    localStorage.setItem('lgr_install_dismissed', Date.now().toString());
    banner.remove();
  });
}
