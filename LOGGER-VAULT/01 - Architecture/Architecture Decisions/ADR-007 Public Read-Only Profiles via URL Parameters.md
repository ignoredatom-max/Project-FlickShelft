# ADR-007: Public Read-Only Profiles via URL Parameters

- **Status**: Accepted
- **Date**: March 2026
- **Context**: Users wanted to share their diary with friends without forcing them to create an account.
- **Decision**: Implement public profile viewing via `?u=<UID>` query parameter.
- **Consequences**:
  - *Positive*: Frictionless sharing via single links, visitors see custom display names and Top Picks.
  - *Security*: Public profile entries are read-only; Firestore security rules enforce write isolation.
