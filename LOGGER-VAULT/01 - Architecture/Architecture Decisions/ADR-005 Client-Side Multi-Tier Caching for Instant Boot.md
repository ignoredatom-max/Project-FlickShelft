# ADR-005: Client-Side Multi-Tier Caching for Instant Boot

- **Status**: Accepted
- **Date**: March 2026
- **Context**: Waiting for Firebase Auth and Firestore network handshakes created a blank screen or spinner for 2-4 seconds on startup.
- **Decision**: Implement a multi-tier local storage cache keyed by UID (`lgr_cache_<uid>`).
- **Consequences**:
  - *Positive*: Diary renders on the very first frame (0ms perceived load time).
  - *Negative*: In-memory cache must be synchronized with Firestore snapshot updates.
