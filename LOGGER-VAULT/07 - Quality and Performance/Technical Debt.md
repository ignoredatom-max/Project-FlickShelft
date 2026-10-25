# 🛠️ Technical Debt & Future Architecture

> **Tag**: #technical-debt #refactoring
> **Related Notes**: [[ADR-001 Single-File Frontend Architecture]]

1. **Monolithic Source File**:
   - `index.html` contains ~14,000 lines. While convenient for zero-build deployments, code edits require careful line-targeting.
2. **Absence of Unit Tests**:
   - Core utility functions (e.g. `cleanTitle()`, `countUniqueMedia()`, `calculateGameRelevance()`) would benefit from standalone unit test scripts.
