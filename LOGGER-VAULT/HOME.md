# 🧭 Logger Second Brain — Knowledge Base Dashboard

Welcome to the technical knowledge base and architecture vault for **Logger** (also known as *Project-FlickShelft*), a personal media diary application built by **ATOMYN** (creator: Aditya Kachare).

This Obsidian vault serves as the permanent architectural blueprint, system documentation, and living memory for Logger.

---

## ⚡ Quick Navigation

### 🤖 For AI Coding Assistants
> If you are an AI assistant starting a new pair-programming session, **START HERE**:
> 👉 **[[AI-START-HERE]]** — Orientation, discovery procedure, and development rules.
> 👉 **[[LOGGER-CONTEXT]]** — Durable project context, tech stack, and key decisions.
> 👉 **[[PROJECT-MAP]]** — Physical repository layout, file roles, and entry points.
> 👉 **[[CURRENT-STATE]]** — Verified feature status, current capabilities, and debt.
> 👉 **[[CURRENT-TASK]]** — Active task tracking and cross-session handoff.

---

### 📚 Knowledge Base Map

```
[[HOME]]
├── 00 - Project Overview
│   ├── [[Project Overview]] · [[Product Vision]] · [[Feature Inventory]]
│   └── [[Technology Stack]] · [[Glossary]]
├── 01 - Architecture
│   ├── [[System Architecture]] · [[Frontend Architecture]] · [[Backend Architecture]]
│   ├── [[Data Flow]] · [[Routing Architecture]] · [[State Management]]
│   ├── [[Component Relationships]] · [[Design System]]
│   └── Architecture Decisions: [[Decision Index]]
├── 02 - Features
│   ├── [[Media Logging]] · [[Movies]] · [[TV Series]] · [[Games]]
│   ├── [[Universal Search]] · [[Watchlist]] · [[Ratings and Reviews]]
│   ├── [[User Profiles]] · [[Favorites and Top Picks]] · [[Calendar View]]
│   └── [[Movie Wall]] · [[Sharing and Snapshots]] · [[Authentication]]
├── 03 - Frontend
│   ├── [[Application Shell]] · [[Navigation System]] · [[Styling and Design Tokens]]
│   ├── Pages: [[Diary Log Page]] · [[Watchlist Page]] · [[Favourites Page]] · [[Calendar Page]] · [[Profile Page]]
│   └── Components: [[Add and Edit Entry Modal]] · [[Deep Media Info Card]] · [[Movie Wall Overlay]] · [[Universal Search Overlay]]
├── 04 - Backend and Integrations
│   ├── [[Backend Overview]] · [[Cloudflare Worker Proxy]] · [[TMDB Integration]] · [[IGDB Integration]]
│   └── Firebase: [[Firebase Authentication]] · [[Firestore Database]] · [[Security Rules]]
├── 05 - Data and Database
│   ├── [[Database Overview]] · [[Data Models]] · [[Firestore Collections]]
│   └── [[Local Storage Schemas]] · [[Data Lifecycle and Synchronization]]
├── 06 - Infrastructure & Deployment
│   ├── [[Development Environment]] · [[Build and Execution Process]] · [[Deployment Workflows]]
│   └── [[Environment Variables and Secrets]] · [[PWA Configuration]]
├── 07 - Quality & Performance
│   ├── [[Testing Strategy]] · [[Performance Optimizations]] · [[Accessibility]]
│   └── [[Known Issues]] · [[Technical Debt]]
├── 08 - Development History
│   ├── [[Feature Evolution]] · [[Bug Fix History]] · [[Key Design Decisions]] · [[Lessons Learned]]
├── 09 - Development Workflow
│   ├── [[AI Development Rules]] · [[How to Add a Feature]] · [[How to Modify a Component]]
│   └── [[How to Debug Logger]] · [[How to Test Changes]] · [[How to Release Changes]]
├── 10 - Templates
│   ├── [[Feature Template]] · [[Component Template]] · [[Architecture Decision Template]]
└── 99 - Archive
    └── [[Archive Index]] · [[Obsidian Graph View Sunset]]
```

---

## 🔍 How to Explore in Obsidian

1. **Graph View (`Ctrl/Cmd + G`)**:
   Open Obsidian's global graph to visualize relationships across features, APIs, database models, and components.
2. **Local Graph**:
   Open the right sidebar and view **Local Graph** while reading any note to inspect its immediate dependencies.
3. **Quick Switcher (`Ctrl/Cmd + O`)**:
   Jump directly to any feature, component, or decision record by name.
4. **Tags**:
   Filter notes by `#feature`, `#architecture`, `#component`, `#integration`, `#database`, `#decision`, or `#debt`.

---

## 📌 Document Metadata
- **Project**: Logger (Project-FlickShelft)
- **Author**: Aditya Kachare (ATOMYN)
- **Vault Location**: `LOGGER-VAULT/` inside repository root
- **Primary Indexes**: [[DOCUMENTATION-INDEX]], [[CHANGELOG]]
