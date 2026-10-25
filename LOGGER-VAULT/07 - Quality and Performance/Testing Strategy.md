# 🧪 Testing Strategy & Verification Procedures

> **Tag**: #testing #qa #verification
> **Related Notes**: [[How to Test Changes]], [[How to Debug Logger]]

Because Logger uses a vanilla architecture without automated test frameworks (Jest/Vitest), verification relies on:
1. **Node.js Syntax Compilation Verification**:
   ```bash
   node -e "const fs=require('fs'); const vm=require('vm'); const c=fs.readFileSync('index.html','utf8'); const s=c.match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/import[\s\S]*?from['"][^'"]+['"];?/g,''); new vm.Script(s); console.log('Syntax valid!');"
   ```
2. **Local HTTP Connectivity Check**:
   Verifying `http://localhost:8080` returns HTTP 200.
3. **Manual Feature Verification Checklist**:
   - Diary row rendering and sticky headers.
   - Search autocomplete and modal prefill.
   - Watchlist drag reordering and swipe actions.
   - Movie Wall grid rendering and 1080px canvas image export.
