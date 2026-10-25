# 🚢 How to Release Changes

> **Tag**: #workflow #release #deployment
> **Related Notes**: [[Deployment Workflows]]

1. **Commit and Push Frontend**:
   ```bash
   git add index.html
   git commit -m "feat: your descriptive commit message"
   git push origin main
   ```
   GitHub Pages will automatically update within 1-2 minutes.
2. **Deploy Worker (If `worker/src/index.js` changed)**:
   ```bash
   cd worker
   npm run deploy
   ```
3. **Update Vault**:
   Update [[CURRENT-STATE]], [[CHANGELOG]], and [[CURRENT-TASK]].
