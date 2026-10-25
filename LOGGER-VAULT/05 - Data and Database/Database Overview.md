# 🗄️ Database Overview

> **Tag**: #database #data-architecture
> **Related Notes**: [[Data Models]], [[Firestore Collections]], [[Local Storage Schemas]]

Logger uses a hybrid data architecture combining local-first browser storage with cloud document storage:
- **Cloud Database**: Google Cloud Firestore (NoSQL collection-document structure).
- **Client Cache**: `localStorage` for sub-millisecond instant-boot data retrieval.
- **Data Portability**: Full JSON export and import capabilities.
