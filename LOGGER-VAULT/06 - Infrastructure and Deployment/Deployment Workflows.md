# 🚀 Deployment Workflows

> **Tag**: #deployment #ci-cd
> **Related Notes**: [[Development Environment]]

## 1. Frontend Deployment (GitHub Pages)
- Branch: `main`.
- Trigger: Pushing commits to `origin/main` automatically redeploys GitHub Pages live within 60 seconds.
- URL: `https://ignoredatom-max.github.io/Project-FlickShelft/`.

## 2. Cloudflare Worker Deployment
- Manual deployment required after changes to `worker/src/index.js`:
  ```bash
  cd worker
  npm run deploy # executes: npx wrangler deploy
  ```
