/* ==========================================================================
   LOGGER - NATIVE HISTORY API ROUTER
   ========================================================================== */

class Router {
  constructor() {
    this._pages = ['log', 'calendar', 'watchlist', 'profile', 'favs'];
    this._currentPage = 'log';
    this._modalStack = [];
    this._modalHandlers = new Map();
    this._isPopping = false;

    // Bind event handlers
    window.addEventListener('popstate', (e) => this._handlePopState(e));
    window.addEventListener('hashchange', () => this._handleHashChange());
  }

  init() {
    // Determine initial route from hash
    const initialHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const targetPage = this._pages.includes(initialHash) ? initialHash : 'log';
    
    // Set initial state without pushing extra history entry
    window.history.replaceState({ page: targetPage, modal: null }, '', `#/${targetPage}`);
    this._activatePage(targetPage, false);
  }

  registerModalHandler(name, { onOpen, onClose }) {
    this._modalHandlers.set(name, { onOpen, onClose });
  }

  // Navigate between top-level pages
  navigate(page, replace = false) {
    if (!this._pages.includes(page)) page = 'log';
    if (this._currentPage === page && !this._modalStack.length) return;

    // Close any open modals before switching pages
    this.closeAllModals(false);

    this._currentPage = page;
    const url = `#/${page}`;
    const stateObj = { page, modal: null };

    if (replace) {
      window.history.replaceState(stateObj, '', url);
    } else {
      window.history.pushState(stateObj, '', url);
    }

    this._activatePage(page, true);
  }

  _activatePage(page, animate = true) {
    this._currentPage = page;

    // Update DOM pages
    this._pages.forEach(p => {
      const el = document.getElementById(`page-${p}`);
      if (el) {
        const isTarget = (p === page);
        el.classList.toggle('on', isTarget);
        if (isTarget && !animate) {
          el.style.animation = 'none';
        } else if (isTarget) {
          el.style.animation = '';
        }
      }
    });

    // Update Bottom Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const btnPage = btn.dataset.page;
      const isTarget = (btnPage === page || (page === 'favs' && btnPage === 'profile'));
      btn.classList.toggle('on', isTarget);
    });

    // Scroll to top of the activated page
    window.scrollTo(0, 0);

    // Notify listeners
    window.dispatchEvent(new CustomEvent('page_changed', { detail: { page } }));
  }

  // Open modal / overlay with history support
  openModal(modalName, params = {}) {
    // If the modal is already top of the stack, skip
    const currentTop = this._modalStack[this._modalStack.length - 1];
    if (currentTop && currentTop.name === modalName && JSON.stringify(currentTop.params) === JSON.stringify(params)) {
      return;
    }

    this._modalStack.push({ name: modalName, params });
    const stateObj = { page: this._currentPage, modal: modalName, params };
    window.history.pushState(stateObj, '', window.location.hash);

    const handler = this._modalHandlers.get(modalName);
    if (handler && handler.onOpen) {
      handler.onOpen(params);
    }
  }

  // Close modal with proper history pop
  closeModal(modalName = null) {
    if (!this._modalStack.length) return;

    if (modalName) {
      const idx = this._modalStack.findIndex(m => m.name === modalName);
      if (idx === -1) return;
    }

    // Go back in history which will trigger _handlePopState and cleanly run onClose
    window.history.back();
  }

  // Programmatically close all modals without triggering history back
  closeAllModals(notify = true) {
    while (this._modalStack.length > 0) {
      const item = this._modalStack.pop();
      if (notify) {
        const handler = this._modalHandlers.get(item.name);
        if (handler && handler.onClose) {
          handler.onClose(item.params);
        }
      }
    }
  }

  _handlePopState(event) {
    const stateObj = event.state;

    // Check if we are popping a modal off the stack
    if (this._modalStack.length > 0) {
      const poppedModal = this._modalStack.pop();
      const handler = this._modalHandlers.get(poppedModal.name);
      if (handler && handler.onClose) {
        handler.onClose(poppedModal.params);
      }
      return;
    }

    // If no modal was on our stack, check page transition
    if (stateObj && stateObj.page) {
      this._activatePage(stateObj.page, false);
    } else {
      this._handleHashChange();
    }
  }

  _handleHashChange() {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const page = this._pages.includes(hash) ? hash : 'log';
    if (page !== this._currentPage) {
      this._activatePage(page, false);
    }
  }

  get currentPage() {
    return this._currentPage;
  }

  hasOpenModal() {
    return this._modalStack.length > 0;
  }
}

export const router = new Router();
