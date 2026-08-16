/* ==========================================================================
   LOGGER - AUTHENTICATION SERVICE
   ========================================================================== */

import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from '../config/firebase.js';
import { state } from '../core/state.js';
import { toast } from '../utils/helpers.js';

export function updateAuthUI() {
  const ico = document.getElementById('authIco');
  const lbl = document.getElementById('authLabel');
  const sub = document.getElementById('authSub');
  const arr = document.getElementById('authArrow');
  if (!ico || !lbl || !sub || !arr) return;

  if (state.currentUser) {
    ico.textContent = '✅';
    lbl.textContent = state.currentUser.displayName || 'Signed in';
    sub.textContent = `${state.currentUser.email} — tap to sign out`;
    arr.textContent = '';
  } else {
    ico.textContent = '🔑';
    lbl.textContent = 'Sign in with Google';
    sub.textContent = 'Sync everything to the cloud';
    arr.textContent = '›';
  }
}

export function setReadOnly(isReadOnly) {
  state.isReadOnly = isReadOnly;
  document.body.classList.toggle('readonly', isReadOnly);
  const banner = document.getElementById('readonlyBanner');
  if (banner) {
    banner.style.display = isReadOnly ? 'flex' : 'none';
  }
}

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    toast('❌ Sign-in failed: ' + e.message);
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    toast('Signed out');
  } catch (e) {
    toast('Sign out failed: ' + e.message);
  }
}

export function initAuth(onAuthChange) {
  onAuthStateChanged(auth, async (user) => {
    state.currentUser = user;
    updateAuthUI();
    if (onAuthChange) {
      await onAuthChange(user);
    }
  });
}
