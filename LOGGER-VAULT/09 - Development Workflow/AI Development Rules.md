# 🤖 AI Development Rules — Mandatory Coding Standards

> **Tag**: #workflow #rules #ai
> **Related Notes**: [[AI-START-HERE]], [[How to Add a Feature]], [[How to Modify a Component]]

## Non-Negotiable Directives for AI Coding Assistants
1. **Source Code Is Ground Truth**: If vault documentation conflicts with `index.html` or `worker/src/index.js`, trust the source code.
2. **Never Break Single-File Architecture**: Do not introduce bundlers (Vite, Webpack) or split `index.html` into multiple files unless specifically commanded by Aditya.
3. **Preserve Secrets**: Never commit `worker/.dev.vars` or expose secret keys in client-side code.
4. **Targeted Line Edits**: Never rewrite the entire 14,000-line `index.html` file in one call. Use targeted string replacements or precise line editing tools.
5. **No Transform on Sticky Ancestors**: Never apply CSS `transform`, `perspective`, or `filter` to `.page` or ancestor scroll containers.
6. **Update the Vault**: Any material change to features, components, or architecture must be accompanied by an update to the corresponding notes in this vault.
