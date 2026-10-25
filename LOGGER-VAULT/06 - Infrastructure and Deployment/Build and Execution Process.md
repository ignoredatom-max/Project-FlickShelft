# ⚙️ Build and Execution Process

> **Tag**: #build #execution
> **Related Notes**: [[ADR-001 Single-File Frontend Architecture]], [[Deployment Workflows]]

- **Frontend**: Zero build step. `index.html` is executed directly by the browser as an ES module.
- **Worker**: Bundled on-the-fly by Cloudflare Wrangler via esbuild during `wrangler deploy`.
