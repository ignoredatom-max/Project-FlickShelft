# ADR-001: Single-File Frontend Architecture

- **Status**: Accepted
- **Date**: March 2026
- **Context**: Many web apps use heavy build pipelines (Webpack, Vite, React, Vue) requiring node_modules, complex bundling, and compilation steps.
- **Decision**: Keep the entire frontend in `index.html` using vanilla HTML, CSS, and ES Modules.
- **Consequences**:
  - *Positive*: Zero build time, instant editing, extreme portability, no dependencies to break.
  - *Negative*: Large file size (~14,000 lines), requiring disciplined code sectioning.
