/* ==========================================================================
   LOGGER - FIREBASE INITIALIZATION
   ========================================================================== */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBie_QQ8tmHDnuosR7Goi5k7K87ft6zRXU",
  authDomain: "movie-logs.firebaseapp.com",
  projectId: "movie-logs",
  storageBucket: "movie-logs.firebasestorage.app",
  messagingSenderId: "966109923364",
  appId: "1:966109923364:web:c4b672666c2c132e2230b1"
};

export const fbApp = initializeApp(firebaseConfig);
export const auth = getAuth(fbApp);
export const db_fs = getFirestore(fbApp);

export {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch
};
