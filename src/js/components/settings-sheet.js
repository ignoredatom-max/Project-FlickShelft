/* ==========================================================================
   LOGGER - SETTINGS & ABOUT OVERLAYS COMPONENT
   ========================================================================== */

import { state } from '../core/state.js';
import { router } from '../core/router.js';
import { signInWithGoogle, signOutUser } from '../services/auth.js';
import { fsSave, fsDelete } from '../services/firestore.js';
import { cacheWrite, saveWL } from '../core/storage.js';
import { toast } from '../utils/helpers.js';

export function initSettingsSheet() {
  // Register settings with router
  router.registerModalHandler('settings', {
    onOpen: () => {
      const sheet = document.getElementById('settingsSheet');
      const overlay = document.getElementById('sheetOverlay');
      if (sheet && overlay) {
        sheet.classList.add('show');
        overlay.classList.add('show');
      }
    },
    onClose: () => {
      const sheet = document.getElementById('settingsSheet');
      const overlay = document.getElementById('sheetOverlay');
      if (sheet && overlay) {
        sheet.classList.remove('show');
        overlay.classList.remove('show');
      }
    }
  });

  // Register about modal with router
  router.registerModalHandler('about', {
    onOpen: () => {
      const overlay = document.getElementById('aboutOverlay');
      if (overlay) overlay.style.display = 'flex';
    },
    onClose: () => {
      const overlay = document.getElementById('aboutOverlay');
      if (overlay) overlay.style.display = 'none';
    }
  });

  // Settings button
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      router.openModal('settings');
    });
  }

  // Backdrop click to close settings
  const sheetOverlay = document.getElementById('sheetOverlay');
  if (sheetOverlay) {
    sheetOverlay.addEventListener('click', () => {
      router.closeModal('settings');
    });
  }

  // Auth button in settings
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', async () => {
      router.closeModal('settings');
      if (state.currentUser) {
        await signOutUser();
      } else {
        await signInWithGoogle();
      }
    });
  }

  // Export JSON backup
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      router.closeModal('settings');
      const payload = {
        entries: state.entries,
        watchlist: state.watchlist,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logger-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('📥 Backup downloaded');
    });
  }

  // Import JSON backup
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => {
      importFile.click();
    });
    importFile.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      router.closeModal('settings');
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const importedEntries = Array.isArray(parsed) ? parsed : (parsed.entries || []);
        const importedWl = parsed.watchlist || [];

        if (!importedEntries.length && !importedWl.length) {
          toast('⚠️ No valid entries in file');
          return;
        }

        // Save imported data
        for (const entry of importedEntries) {
          await fsSave(entry);
        }
        if (importedWl.length) {
          saveWL(importedWl);
        }
        state.entries = [...importedEntries];
        cacheWrite(state.entries);
        toast(`✅ Imported ${importedEntries.length} entries!`);
      } catch (err) {
        toast('❌ Failed to parse backup file');
      }
      importFile.value = '';
    });
  }

  // Clear data
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      router.closeModal('settings');
      if (confirm('Are you sure you want to clear local cache? This will not delete cloud data.')) {
        localStorage.clear();
        state.entries = [];
        state.watchlist = [];
        toast('🧹 Cache cleared');
      }
    });
  }

  // About modal close
  const aboutOverlay = document.getElementById('aboutOverlay');
  if (aboutOverlay) {
    aboutOverlay.addEventListener('click', (e) => {
      if (e.target === aboutOverlay) {
        router.closeModal('about');
      }
    });
  }
}

export function openAbout() {
  router.openModal('about');
}

export function closeAbout() {
  router.closeModal('about');
}
