# ⭐ Feature: Ratings and Reviews

> **Tag**: #feature #ratings #reviews
> **Related Notes**: [[Media Logging]], [[Design System]], [[Sharing and Snapshots]]

## Purpose
Emotive, non-numeric evaluation system providing immediate clarity on how much a user enjoyed an experience.

## The 4-Tier Rating Scale
| Rating Key | Display Label | Color Token | Semantic Meaning |
|---|---|---|---|
| `skip` | Skip | `--red: #ff453a` | Not recommended, disappointing, or abandoned |
| `decent` | Decent | `--teal: #00b4d8` | Solid, enjoyable, well worth the time |
| `excellent`| Excellent | `--green: #00c566` | High quality, outstanding execution |
| `peak` | Peak | `--purple: #bf5af2` | Masterpiece, personal favorite |

> [!NOTE] Legacy Tier Migration
> In November 2026, the intermediate *Mediocre* tier was sunset. All historical entries with `rating: "mediocre"` are seamlessly and automatically migrated to `rating: "decent"` across both local caches and Firestore, with zero data loss. Legacy backups containing `mediocre` also safely alias to `Decent`.

## Interactive Rating Bar
- Segmented pill container (`.rating-bar`, height `46px`, `border-radius: 14px`) spanning 100% modal dialog width.
- Sliding indicator (`.rating-indicator`) with playful spring animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Distinct per-tier vibrant pill colors: Skip (`#ff4d42`), Decent (`#00b4d8`), Excellent (`#30d158`), Peak (`#bf5af2`).
- High-contrast active typography: Active button text becomes solid bold black (`#000000`, 800) on top of the colored indicator.
- Supports both single-tap button selection and continuous touch/pointer swipe gestures with haptic vibration.

## Review & Notes Field
- Optional multiline text field attached to any entry.
- Displayed with an italicized quote styling (`ᯓ`) in diary rows.
- Included in high-res share cards generated for Instagram or social media.
