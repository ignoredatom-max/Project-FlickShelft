/* ==========================================================================
   LOGGER - CENTRAL REACTIVE STATE
   ========================================================================== */

class StateManager {
  constructor() {
    this._entries = [];
    this._watchlist = [];
    this._currentUser = null;
    this._isReadOnly = false;

    // Log Feed filters
    this._activeFilter = 'all';
    this._activeSort = 'new';

    // Favourites filter
    this._favsFilter = 'all';

    // Calendar state
    const now = new Date();
    this._calYear = now.getFullYear();
    this._calMonth = now.getMonth();
    this._selectedCalDate = this._getTodayIso();

    // Profile state
    this._activityRange = '6m';
    this._selectedActivityMonth = null;

    // Listeners
    this._listeners = new Set();
  }

  _getTodayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  notify(event, payload) {
    this._listeners.forEach(fn => {
      try {
        fn(event, payload);
      } catch (e) {
        console.error('State listener error', e);
      }
    });
  }

  // Getters & Setters
  get entries() { return this._entries; }
  set entries(val) {
    this._entries = Array.isArray(val) ? val : [];
    this.notify('entries_changed', this._entries);
  }

  get watchlist() { return this._watchlist; }
  set watchlist(val) {
    this._watchlist = Array.isArray(val) ? val : [];
    this.notify('watchlist_changed', this._watchlist);
  }

  get currentUser() { return this._currentUser; }
  set currentUser(val) {
    this._currentUser = val;
    this.notify('auth_changed', this._currentUser);
  }

  get isReadOnly() { return this._isReadOnly; }
  set isReadOnly(val) {
    this._isReadOnly = Boolean(val);
    this.notify('readonly_changed', this._isReadOnly);
  }

  get activeFilter() { return this._activeFilter; }
  set activeFilter(val) {
    this._activeFilter = val;
    this.notify('filter_changed', this._activeFilter);
  }

  get activeSort() { return this._activeSort; }
  set activeSort(val) {
    this._activeSort = val;
    this.notify('sort_changed', this._activeSort);
  }

  get favsFilter() { return this._favsFilter; }
  set favsFilter(val) {
    this._favsFilter = val;
    this.notify('favs_filter_changed', this._favsFilter);
  }

  get calYear() { return this._calYear; }
  get calMonth() { return this._calMonth; }
  setCalMonth(year, month) {
    this._calYear = year;
    this._calMonth = month;
    this.notify('cal_month_changed', { year, month });
  }

  get selectedCalDate() { return this._selectedCalDate; }
  set selectedCalDate(val) {
    this._selectedCalDate = val;
    this.notify('cal_date_changed', this._selectedCalDate);
  }

  get activityRange() { return this._activityRange; }
  set activityRange(val) {
    this._activityRange = val;
    this.notify('activity_range_changed', this._activityRange);
  }

  get selectedActivityMonth() { return this._selectedActivityMonth; }
  set selectedActivityMonth(val) {
    this._selectedActivityMonth = val;
    this.notify('activity_month_changed', this._selectedActivityMonth);
  }
}

export const state = new StateManager();
