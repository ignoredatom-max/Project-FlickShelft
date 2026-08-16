/* ==========================================================================
   LOGGER - BOTTOM NAVIGATION COMPONENT
   ========================================================================== */

import { router } from '../core/router.js';
import { getPfp, getDisplayName } from '../core/storage.js';

export function initNavigation({ onAddClick }) {
  // Destination tab clicks
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page) {
        router.navigate(page);
      }
    });
  });

  // Hero Center Add button
  const navAddBtn = document.getElementById('navAddBtn');
  if (navAddBtn) {
    navAddBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.body.classList.contains('readonly')) return;
      if (onAddClick) onAddClick();
    });
  }

  // Hide on scroll down, show on scroll up
  const navEl = document.querySelector('.nav');
  if (navEl) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastScrollY + 8 && currentY > 60) {
            navEl.classList.add('hidden');
          } else if (currentY < lastScrollY - 8 || currentY <= 30) {
            navEl.classList.remove('hidden');
          }
          lastScrollY = Math.max(0, currentY);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  updateHeaderAvatar();
}

export function updateHeaderAvatar(pfp = null, name = null) {
  const finalPfp = pfp !== null ? pfp : getPfp();
  const finalName = name !== null ? name : getDisplayName();
  const letter = (finalName || 'A')[0].toUpperCase();

  // Header mini avatar
  const navPfp = document.getElementById('navPfp');
  const navPh = document.getElementById('navPh');
  if (navPfp && navPh) {
    if (finalPfp) {
      navPfp.src = finalPfp;
      navPfp.style.display = 'block';
      navPh.style.display = 'none';
    } else {
      navPfp.style.display = 'none';
      navPh.style.display = 'block';
      navPh.textContent = letter;
    }
  }

  // Profile page avatar
  const pfpEl = document.getElementById('profilePfp');
  const phEl = document.getElementById('profilePfpPh');
  if (pfpEl && phEl) {
    if (finalPfp) {
      pfpEl.src = finalPfp;
      pfpEl.style.display = 'block';
      phEl.style.display = 'none';
    } else {
      pfpEl.style.display = 'none';
      phEl.style.display = 'flex';
      phEl.textContent = letter;
    }
  }

  // Mini sticky header on profile page
  const miniPfp = document.getElementById('profileMiniPfp');
  const miniPh = document.getElementById('profileMiniPh');
  if (miniPfp && miniPh) {
    if (finalPfp) {
      miniPfp.src = finalPfp;
      miniPfp.style.display = 'block';
      miniPh.style.display = 'none';
    } else {
      miniPfp.style.display = 'none';
      miniPh.style.display = 'flex';
      miniPh.textContent = letter;
    }
  }
}
