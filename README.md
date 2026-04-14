# Music Moods

Web app that reads the user’s mood and returns a short message plus Spotify playlist suggestions.

## Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/7b3fa7c7-3dfc-4b87-8b26-4bb2899ca031" width="80%" alt="Music Moods — input" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/278a65a7-5c57-4fc7-bd4f-5c02723bbc55" width="80%" alt="Music Moods — results" />
</p>

## Structure

```text
music/
├── back/   # API — Node, Express, TypeScript
└── front/  # UI — React, Vite, Tailwind, TypeScript
```

## Run locally

**Backend** (`http://localhost:3001`, build → `back/dist`)

```bash
cd back && npm install && cp .env.example .env && npm run dev
```

**Frontend** (`http://localhost:5173`)

```bash
cd front && npm install && cp .env.example .env && npm run dev
```

Production-style: `back` → `npm run build` then `npm run start`; `front` → `npm run typecheck` then `npm run build`.

## Environment

**`front/.env`** (see `front/.env.example`)

| Variable       | Purpose              |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend base URL     |

**`back/.env`** (see `back/.env.example`)

| Variable                         | Purpose                          |
| -------------------------------- | -------------------------------- |
| `PORT`                           | API port (default `3001`)        |
| `FRONTEND_ORIGIN`                | Allowed CORS origin(s)           |
| `JSON_BODY_LIMIT`                | JSON body limit (e.g. `10kb`)    |
| `MOOD_MAX_LENGTH`                | Max mood text length             |
| `MOOD_RATE_LIMIT_*`              | Rate limit for `POST /api/mood`  |
| `LOG_FORMAT`                     | `morgan` format (`dev`, etc.)    |
| `SPOTIFY_CLIENT_ID` / `SECRET`   | Spotify API credentials          |

## API

- `GET /health` — health check  
- `POST /api/mood` — body `{ "mood": "..." }` → `mood`, `friendlyMessage`, `playlists` (`name`, `url`, `reason`, `thumbnailUrl`), `source` (`spotify` | `fallback`)

## Tests & quality

Per package (`back/` or `front/`):

```bash
npm test
npm run typecheck
npm run lint          # npm run lint:fix
npm run format        # npm run format:check
```

## Deploy

1. Deploy **backend** (e.g. Render, Fly.io, Railway).  
2. Set **`VITE_API_URL`** on the frontend to that URL.  
3. Deploy **frontend** (e.g. Vercel).  
4. Set **`FRONTEND_ORIGIN`** on the backend to the live frontend URL, then redeploy the API so CORS matches.

Example: frontend `https://music-moods.vercel.app` → `FRONTEND_ORIGIN=https://music-moods.vercel.app`.

## Stack

Node.js, Express, TypeScript · React, Vite, Tailwind · Spotify Web API

## License

MIT
