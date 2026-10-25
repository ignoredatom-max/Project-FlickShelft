# 🔒 Security & Privacy

> **Tag**: #security #privacy
> **Related Notes**: [[Security Rules]], [[Cloudflare Worker Proxy]]

- **API Secret Isolation**: All upstream keys (`TMDB_API_KEY`, `TWITCH_CLIENT_SECRET`) reside in Cloudflare Secrets and are never delivered to the client.
- **Firestore Isolation**: Write access strictly bounded to authenticated UID matching the document path.
- **Public Profile Privacy**: Only diary entries, public profile name, and Top Picks are publicly visible; user emails, private watchlist queues, and credentials are protected.
