/* ==========================================================================
   LOGGER - DATE & TIME UTILITIES
   ========================================================================== */

export function todayVal() {
  return new Date().toISOString().slice(0, 10);
}

export function dateToMidnightTs(yyyyMmDd) {
  if (!yyyyMmDd) return Date.now();
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).getTime();
}

export function formatLogDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatShortMonth(year, month) {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('en-US', { month: 'short' });
}

export function formatFullMonth(year, month) {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatDateDiff(d1Str, d2Str) {
  if (!d1Str || !d2Str) return null;
  const d1 = new Date(d1Str);
  const d2 = new Date(d2Str);
  if (isNaN(d1) || isNaN(d2)) return null;

  const diffMs = Math.abs(d2 - d1);
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Same day';
  if (diffDays === 1) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;

  const months = Math.floor(diffDays / 30);
  const remDays = diffDays % 30;
  if (months < 12) {
    if (remDays === 0) return `${months} mo`;
    return `${months} mo ${remDays} d`;
  }

  const years = Math.floor(diffDays / 365);
  const remMonths = Math.floor((diffDays % 365) / 30);
  if (remMonths === 0) return `${years} yr`;
  return `${years} yr ${remMonths} mo`;
}
