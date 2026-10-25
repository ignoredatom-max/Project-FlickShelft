# 🐞 How to Debug Logger

> **Tag**: #workflow #debugging #troubleshooting
> **Related Notes**: [[Bug Fix History]], [[Known Issues]]

1. **Syntax Errors**:
   Run: `node -e "const fs=require('fs'); const vm=require('vm'); const c=fs.readFileSync('index.html','utf8'); const s=c.match(/<script type=\"module\">([\s\S]*?)<\/script>/)[1].replace(/import[\s\S]*?from['\"][^'\"]+['\"];?/g,''); new vm.Script(s); console.log('Syntax valid!');"`
2. **Sticky Header Debugging**:
   Check if any ancestor element has `transform`, `overflow: hidden`, or `will-change: transform`. Run `updateStickyTop()` in the console to inspect computed header heights.
3. **API Proxy Issues**:
   - Check Network tab in browser dev tools.
   - If in local dev, ensure `node server.js` is active on port 8080.
   - If in production, verify `https://logger-proxy.ignoredatom.workers.dev/api/health` returns `{"status":"ok"}`.
4. **Cache Invalidation**:
   Clear `localStorage` keys starting with `lgr_` and reload to verify fresh Firestore sync.
