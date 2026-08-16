/* ==========================================================================
   LOGGER - CALENDAR PAGE
   ========================================================================== */

import { state } from '../core/state.js';
import { RATING_LABELS, getDoneLabel, getPillLabel, getTypeIcon } from '../config/constants.js';
import { formatFullMonth, formatLogDate, todayVal } from '../utils/dates.js';
import { openInfo } from '../components/entry-info.js';

export function initCalendarPage() {
  const prevBtn = document.getElementById('calPrevMonth');
  const nextBtn = document.getElementById('calNextMonth');
  const todayBtn = document.getElementById('calTodayBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let y = state.calYear;
      let m = state.calMonth - 1;
      if (m < 0) { m = 11; y--; }
      state.setCalMonth(y, m);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let y = state.calYear;
      let m = state.calMonth + 1;
      if (m > 11) { m = 0; y++; }
      state.setCalMonth(y, m);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      state.setCalMonth(now.getFullYear(), now.getMonth());
      state.selectedCalDate = todayVal();
      renderCalendar();
    });
  }

  state.subscribe((event) => {
    if (event === 'entries_changed' || event === 'cal_month_changed' || event === 'cal_date_changed') {
      renderCalendar();
    }
  });
}

export function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const monthLbl = document.getElementById('calCurrentMonthLabel');
  if (!grid || !monthLbl) return;

  const year = state.calYear;
  const month = state.calMonth;

  monthLbl.textContent = formatFullMonth(year, month);

  // Group entries by date (YYYY-MM-DD)
  const dateMap = {};
  state.entries.forEach(e => {
    let dateStr = e.date || '';
    if (!dateStr && e.loggedAt) {
      dateStr = new Date(e.loggedAt).toISOString().slice(0, 10);
    }
    if (dateStr) {
      if (!dateMap[dateStr]) dateMap[dateStr] = [];
      dateMap[dateStr].push(e);
    }
  });

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = todayVal();

  let html = '';

  // Leading empty cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    html += `<div class="cal-day cal-empty"></div>`;
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEntries = dateMap[dayStr] || [];
    const isToday = (dayStr === todayStr);
    const isSelected = (dayStr === state.selectedCalDate);

    let mediaHtml = '';
    if (dayEntries.length > 0) {
      const firstEntry = dayEntries[0];
      const icon = getTypeIcon(firstEntry.type);
      const posterThumb = firstEntry.poster
        ? `<img class="cal-poster-thumb" src="${firstEntry.poster}" alt="">`
        : `<div class="cal-poster-ph">${icon}</div>`;

      const moreBadge = dayEntries.length > 1
        ? `<span class="cal-more-badge">+${dayEntries.length - 1}</span>`
        : '';

      mediaHtml = `<div class="cal-media-wrap">${posterThumb}${moreBadge}</div>`;
    }

    html += `
      <div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dayStr}">
        <span class="cal-day-num">${d}</span>
        ${mediaHtml}
      </div>
    `;
  }

  grid.innerHTML = html;

  // Day click selection
  grid.querySelectorAll('.cal-day:not(.cal-empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      state.selectedCalDate = cell.dataset.date;
      renderCalendar();
    });
  });

  renderCalendarSelectedEntries(dateMap);
}

function renderCalendarSelectedEntries(dateMap) {
  const container = document.getElementById('calendarDayEntries');
  const header = document.getElementById('calendarDayHeader');
  if (!container || !header) return;

  const dateStr = state.selectedCalDate || todayVal();
  const d = new Date(dateStr + 'T12:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const dayEntries = dateMap[dateStr] || [];

  header.textContent = `${dayName.toUpperCase()} (${dayEntries.length} ${dayEntries.length === 1 ? 'ENTRY' : 'ENTRIES'})`;

  if (!dayEntries.length) {
    container.innerHTML = `
      <div class="empty" style="padding:32px 14px;background:var(--bg2);border-radius:14px;border:1px solid var(--border)">
        <div class="empty-ico-svg" style="margin-bottom:8px">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div class="empty-title" style="font-size:14px">No entries logged on this date</div>
        <div class="empty-sub" style="font-size:11px">Tap + in the bottom nav to log an entry</div>
      </div>
    `;
    return;
  }

  container.innerHTML = dayEntries.map(e => {
    const icon = getTypeIcon(e.type);
    const rKey = e.rating || 'decent';
    const rLabel = RATING_LABELS[rKey] || 'Decent';
    const rClass = `r-${rKey}`;
    const statusLabel = getPillLabel(e.status, e.type, e);
    const statusClass = `pill-${e.status || 'done'}`;

    const posterHtml = e.poster
      ? `<img class="row-thumb" src="${e.poster}" alt="" loading="lazy">`
      : `<div class="row-thumb-ph">${icon}</div>`;

    return `
      <div class="row ${e.type || 'movie'}" data-id="${e.id}" style="margin-bottom:6px;border-radius:12px;border:1px solid var(--border)">
        <div class="row-day" style="display:none"></div>
        ${posterHtml}
        <div class="row-info">
          <div class="row-title-wrap">
            <div class="row-title">${e.title}</div>
            <span class="row-year">${e.year || ''}</span>
          </div>
          <div class="row-meta">
            <span class="rating-badge ${rClass}">${rLabel}</span>
            <span class="pill ${statusClass}">${statusLabel}</span>
            ${e.notes ? '<span class="note-icon" title="Has review">📝</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      openInfo(id, 'calendar');
    });
  });
}
