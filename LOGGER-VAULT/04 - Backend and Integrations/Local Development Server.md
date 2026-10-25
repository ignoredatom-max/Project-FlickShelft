# 🖥️ Local Development Server (`server.js`)

> **Tag**: #dev-server #node #testing
> **Related Notes**: [[Development Environment]], [[Build and Execution Process]]

## Source Location
`../server.js` (~380 lines)

## Features
- Zero npm dependencies; uses Node.js standard library.
- Serves static assets on port 8080.
- Proxies `/api/*` to the Cloudflare Worker or queries TMDB directly using a local key.
- Displays LAN IP (`http://192.168.*:8080`) for mobile testing over Wi-Fi.
