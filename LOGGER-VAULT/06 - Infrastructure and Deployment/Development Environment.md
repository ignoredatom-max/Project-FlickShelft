# 💻 Development Environment Setup

> **Tag**: #infrastructure #dev-env #setup
> **Related Notes**: [[Local Development Server]], [[Build and Execution Process]]

## Prerequisites
- Node.js (v18+) installed.
- PowerShell or bash shell.
- Modern browser (Chrome, Brave, Edge, Firefox, or Safari).

## Running the App Locally
```bash
# Start local server from project root
node server.js
# Access app at http://localhost:8080
```

## Running the Cloudflare Worker Locally
```bash
cd worker
npm install
npx wrangler dev --port 8787
```
*(Requires `worker/.dev.vars` containing API credentials).*
