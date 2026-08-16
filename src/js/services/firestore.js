/* ==========================================================================
   LOGGER - FIRESTORE CLOUD DATA SERVICE
   ========================================================================== */

import {
  db_fs,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc
} from '../config/firebase.js';
import { state } from '../core/state.js';
import { cacheWrite, cacheRead, saveWL } from '../core/storage.js';

export function flashCloud() {
  let el = document.getElementById('cloudFlash');
  if (!el) {
    el = document.createElement('span');
    el.id = 'cloudFlash';
    el.style.cssText = 'position:fixed;top:14px;right:14px;font-size:13px;opacity:0;transition:opacity 0.3s;z-index:200;pointer-events:none;';
    document.body.appendChild(el);
  }
  el.textContent = '☁️';
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 1200);
}

function colEntries(uid) {
  return collection(db_fs, `users/${uid}/entries`);
}

function docWL(uid) {
  return doc(db_fs, `users/${uid}/meta/watchlist`);
}

export async function fsSave(entry) {
  if (state.currentUser) {
    try {
      const uid = state.currentUser.uid;
      await setDoc(doc(db_fs, `users/${uid}/entries/${entry.id}`), entry);
      flashCloud();
    } catch (e) {
      console.warn('Cloud sync error', e);
    }
  }

  // Update in-memory state & local cache (local-first)
  const idx = state.entries.findIndex(x => x.id === entry.id);
  if (idx !== -1) {
    state.entries[idx] = entry;
    state.entries = [...state.entries];
  } else {
    state.entries = [entry, ...state.entries];
  }
  cacheWrite(state.entries);
}

export async function fsDelete(id) {
  if (state.currentUser) {
    try {
      const uid = state.currentUser.uid;
      await deleteDoc(doc(db_fs, `users/${uid}/entries/${id}`));
      flashCloud();
    } catch (e) {
      console.warn('Cloud delete error', e);
    }
  }

  state.entries = state.entries.filter(x => x.id !== id);
  cacheWrite(state.entries);
}

export async function fsWLSave(wlList) {
  if (!state.currentUser) return;
  const uid = state.currentUser.uid;
  await setDoc(docWL(uid), { items: wlList });
}

export async function fsLoad() {
  if (!state.currentUser) return;
  const uid = state.currentUser.uid;

  // 1. Instantly use cache
  const cached = cacheRead();
  if (cached && cached.length) {
    state.entries = cached;
  }

  // 2. Silently sync from Firestore
  try {
    const snap = await getDocs(colEntries(uid));
    state.entries = snap.docs.map(d => d.data());
    cacheWrite(state.entries);

    const wlSnap = await getDoc(docWL(uid));
    if (wlSnap.exists()) {
      saveWL(wlSnap.data().items || []);
    }
    flashCloud();
  } catch (e) {
    console.error('Firestore sync failed', e);
  }
}

export async function fsLoadPublic(uid) {
  const cached = cacheRead();
  if (cached && cached.length) {
    state.entries = cached;
  } else {
    const listEl = document.getElementById('list');
    if (listEl) {
      listEl.innerHTML = `
        <div style="padding:40px 20px;text-align:center">
          <div style="font-size:13px;color:var(--text3);margin-bottom:8px;">Loading diary…</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px">
            ${[1, 2, 3, 4].map(() => `
              <div style="display:flex;gap:12px;align-items:center;padding:10px 16px;opacity:0.4;animation:pulse 1.4s ease infinite">
                <div style="width:36px;height:54px;border-radius:6px;background:var(--bg3);flex-shrink:0"></div>
                <div style="flex:1">
                  <div style="height:13px;background:var(--bg3);border-radius:6px;margin-bottom:8px;width:60%"></div>
                  <div style="height:10px;background:var(--bg3);border-radius:6px;width:40%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }
  }

  try {
    const snap = await getDocs(collection(db_fs, `users/${uid}/entries`));
    state.entries = snap.docs.map(d => d.data());
    cacheWrite(state.entries);
  } catch (e) {
    if (!cached) state.entries = [];
  }
}
