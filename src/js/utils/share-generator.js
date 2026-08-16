/* ==========================================================================
   LOGGER - SHARE CARD IMAGE GENERATOR
   ========================================================================== */

import { ensureImgDecoded } from './helpers.js';

export async function generateShareCardImage(cardElement, entry) {
  const rect = cardElement.getBoundingClientRect();
  const scale = 3;
  const W = Math.round(rect.width * scale);
  const H = Math.round(rect.height * scale);

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = W;
  finalCanvas.height = H;
  const ctx = finalCanvas.getContext('2d');

  const bg = document.getElementById('scBg');
  const domPosterImg = document.getElementById('scPoster');
  const posterSrc = entry?.poster
    ? (entry.poster + (entry.poster.includes('?') ? '&' : '?') + 'notaint=1')
    : '';

  // 1. Draw blurred background
  if (entry?.poster) {
    const exportBgImg = new Image();
    exportBgImg.crossOrigin = 'anonymous';
    await new Promise(res => {
      exportBgImg.onload = () => res();
      exportBgImg.onerror = () => res();
      exportBgImg.src = posterSrc;
    });
    await ensureImgDecoded(exportBgImg, 2000);

    if (exportBgImg.naturalWidth > 0) {
      ctx.save();
      const r = 24 * scale;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(W - r, 0);
      ctx.quadraticCurveTo(W, 0, W, r);
      ctx.lineTo(W, H - r);
      ctx.quadraticCurveTo(W, H, W - r, H);
      ctx.lineTo(r, H);
      ctx.quadraticCurveTo(0, H, 0, H - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      ctx.filter = `blur(${28 * scale}px) brightness(0.55) saturate(2)`;
      ctx.drawImage(exportBgImg, -80, -80, W + 160, H + 160);
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    } else {
      ctx.fillStyle = '#161616';
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Hide bg & poster so html2canvas doesn't taint
  const posterEl = document.getElementById('scPoster');
  if (posterEl) posterEl.style.visibility = 'hidden';
  if (bg) bg.style.display = 'none';

  const htmlCanvas = await window.html2canvas(cardElement, {
    backgroundColor: null,
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: rect.width,
    height: rect.height,
    imageTimeout: 0
  });

  if (bg) bg.style.display = '';
  if (posterEl) posterEl.style.visibility = '';

  // 3. Composite DOM HTML
  ctx.drawImage(htmlCanvas, 0, 0);

  // 4. Draw crisp poster
  if (entry?.poster) {
    await ensureImgDecoded(domPosterImg, 1200);
    const posterOk = domPosterImg && domPosterImg.naturalWidth > 0;
    const exportPosterImg = posterOk ? domPosterImg : (() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = posterSrc;
      return img;
    })();

    if (!posterOk) {
      await ensureImgDecoded(exportPosterImg, 2000);
    }

    if (exportPosterImg && exportPosterImg.naturalWidth > 0) {
      const POSTER_X = 20, POSTER_Y = 20, POSTER_W = 72, POSTER_H = 106, POSTER_R = 10;
      const px = POSTER_X * scale, py = POSTER_Y * scale, pw = POSTER_W * scale, ph = POSTER_H * scale, pr2 = POSTER_R * scale;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px + pr2, py);
      ctx.lineTo(px + pw - pr2, py);
      ctx.quadraticCurveTo(px + pw, py, px + pw, py + pr2);
      ctx.lineTo(px + pw, py + ph - pr2);
      ctx.quadraticCurveTo(px + pw, py + ph, px + pw - pr2, py + ph);
      ctx.lineTo(px + pr2, py + ph);
      ctx.quadraticCurveTo(px, py + ph, px, py + ph - pr2);
      ctx.lineTo(px, py + pr2);
      ctx.quadraticCurveTo(px, py, px + pr2, py);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(exportPosterImg, px, py, pw, ph);
      ctx.restore();
    }
  }

  return finalCanvas.toDataURL('image/jpeg', 0.95);
}
