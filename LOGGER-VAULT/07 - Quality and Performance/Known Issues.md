# ⚠️ Known Issues & Active Limitations

> **Tag**: #known-issues #bugs
> **Related Notes**: [[CURRENT-STATE]], [[Technical Debt]]

1. **Guest Mode Data Volatility**:
   - Data entered in guest mode is in-memory only and lost on page refresh.
2. **Cloudflare Worker Deploy Decoupling**:
   - Pushing to GitHub does not deploy Cloudflare Worker changes. Developers must run `npm run deploy` inside `worker/`.
3. **Local Dev Server LAN IP**:
   - `server.js` displays hardcoded LAN IP `192.168.0.103`. When connecting from different networks, check actual local IP via `ipconfig` or `ip a`.
