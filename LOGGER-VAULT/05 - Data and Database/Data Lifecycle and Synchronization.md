# 🔄 Data Lifecycle & Synchronization

> **Tag**: #sync #lifecycle
> **Related Notes**: [[State Management]], [[Data Flow]]

1. **Write Flow**:
   - User adds or updates an entry -> in-memory array mutated -> `localStorage` updated -> Firestore write committed.
2. **Read Flow**:
   - Initial load from `localStorage` -> Firestore real-time listener attaches -> silent reconciliation if remote differences exist.
3. **Delete Flow**:
   - Entry removed from memory -> removed from cache -> `deleteDoc()` executed on Firestore document.
