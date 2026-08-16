/* ==========================================================================
   LOGGER - LOCAL STORAGE & CACHE SERVICE
   ========================================================================== */

import { CACHE_KEY, OWNER_UID, PUBLIC_UID } from '../config/constants.js';
import { state } from './state.js';

export function getCacheKey() {
  const uid = state.currentUser?.uid || PUBLIC_UID;
  return uid ? `lgr_cache_${uid}` : CACHE_KEY;
}

export function cacheWrite(entries) {
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify(entries));
  } catch (e) {
    console.warn('Failed to write local cache', e);
  }
}

export function cacheRead() {
  try {
    const uid = state.currentUser?.uid || PUBLIC_UID;
    if (uid) {
      const v = localStorage.getItem(`lgr_cache_${uid}`);
      if (v) return JSON.parse(v);
    }
    const fallback = localStorage.getItem(CACHE_KEY);
    return fallback ? JSON.parse(fallback) : null;
  } catch (e) {
    return null;
  }
}

export function getWL() {
  try {
    return JSON.parse(localStorage.getItem('logger-wl') || '[]');
  } catch (e) {
    return [];
  }
}

export function saveWL(list) {
  try {
    localStorage.setItem('logger-wl', JSON.stringify(list));
    state.watchlist = list;
  } catch (e) {
    console.warn('Failed to save watchlist to localStorage', e);
  }
}

// Profile LocalStorage
function profileKey(k) {
  const uid = state.currentUser?.uid || PUBLIC_UID || 'anon';
  return `lgr_p_${uid}_${k}`;
}

export function getPfp() {
  return localStorage.getItem(profileKey('pfp')) || '';
}

export function savePfp(url) {
  localStorage.setItem(profileKey('pfp'), url);
}

export function getCustomName() {
  return localStorage.getItem(profileKey('name')) || '';
}

export function saveCustomName(name) {
  localStorage.setItem(profileKey('name'), name);
}

export function getPicks() {
  try {
    const v = localStorage.getItem(profileKey('picks'));
    if (v) {
      const ids = JSON.parse(v);
      return ids.map(id => state.entries.find(e => e.id === id)).filter(Boolean);
    }
  } catch (e) {}
  return state.entries.filter(e => e.fav).slice(0, 3);
}

export function savePicks(entries) {
  try {
    const ids = entries.map(e => e.id);
    localStorage.setItem(profileKey('picks'), JSON.stringify(ids));
  } catch (e) {}
}

export function getPickExtras() {
  try {
    return JSON.parse(localStorage.getItem(profileKey('extras')) || '[]');
  } catch (e) {
    return [];
  }
}

export function savePickExtras(arr) {
  try {
    localStorage.setItem(profileKey('extras'), JSON.stringify(arr));
  } catch (e) {}
}

export function getDisplayName() {
  const custom = getCustomName();
  if (custom) return custom;
  if (state.currentUser?.displayName) return state.currentUser.displayName;
  if (PUBLIC_UID && PUBLIC_UID === OWNER_UID) return 'Aditya';
  return 'Aditya';
}
