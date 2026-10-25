# 🚦 Routing Architecture — In-Page Navigation & Deep Links

> **Tag**: #routing #frontend
> **Related Notes**: [[Navigation System]], [[ADR-007 Public Read-Only Profiles via URL Parameters]]

Logger uses a client-side routing model without URL hash clutter:

## Page Switching Mechanism
- Page containers share the class `.page`.
- Bottom navigation buttons specify `data-page="log|watchlist|favs|calendar|profile"`.
- Clicking a navigation button triggers:
  ```javascript
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.getElementById('page-' + pageName).classList.add('on');
  window.scrollTo(0, 0);
  ```

## Deep Linking via URL Query Parameters
- `?u=<UID>`: Loads public profile mode for the specified user UID.
- Toggles `document.body.classList.add('readonly')` and renders public read-only header banners.
