# Project Logger (Project-FlickShelft)

## AI Instructions & Knowledge Base

Before undertaking any development tasks or architectural changes on Logger, you **MUST** consult the official project documentation vault:

👉 **[`LOGGER-VAULT/AI-START-HERE.md`](./LOGGER-VAULT/AI-START-HERE.md)**

### Key Entry Points:
1. **[[AI-START-HERE]]** (`LOGGER-VAULT/AI-START-HERE.md`): Development rules, 10-step fresh session procedure, and project overview.
2. **[[LOGGER-CONTEXT]]** (`LOGGER-VAULT/LOGGER-CONTEXT.md`): Durable project context, tech stack, constraints, and conventions.
3. **[[PROJECT-MAP]]** (`LOGGER-VAULT/PROJECT-MAP.md`): Physical code topology and line number mapping for `index.html` and `worker/src/index.js`.
4. **[[CURRENT-STATE]]** (`LOGGER-VAULT/CURRENT-STATE.md`): Verified feature status, current limitations, and recent changes.
5. **[[CURRENT-TASK]]** (`LOGGER-VAULT/CURRENT-TASK.md`): Active task handoff tracking.

### Core Rules:
- The source code in `index.html` and `worker/src/index.js` is the ground truth.
- Do not split `index.html` into separate framework components or add bundlers without explicit user command.
- Update the relevant documentation in `LOGGER-VAULT/` whenever you make material changes to features, components, or architecture.
