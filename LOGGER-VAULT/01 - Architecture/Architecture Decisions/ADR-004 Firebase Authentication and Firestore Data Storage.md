# ADR-004: Firebase Authentication and Firestore Data Storage

- **Status**: Accepted
- **Date**: March 2026
- **Context**: Users required seamless cross-device synchronization and Google login without self-hosting backend database servers.
- **Decision**: Implement Firebase Authentication with Google Sign-in and Cloud Firestore NoSQL document store.
- **Consequences**:
  - *Positive*: Real-time updates, rock-solid availability, zero backend server maintenance costs.
  - *Negative*: Requires careful Firestore security rules to protect user privacy.
