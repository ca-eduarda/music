# Music Moods

An app that reads a user's mood and returns a friendly response with Spotify playlist suggestions.

## Project Structure

```text
music/
  back/   -> API (Node + Express)
  front/  -> Web app (React + Vite + Tailwind)
```

## Run Locally

### 1) Backend

```bash
cd back
npm install
cp .env.example .env
npm run dev
```

Backend default URL: `http://localhost:3001`

### 2) Frontend

```bash
cd front
npm install
cp .env.example .env
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Environment Variables

### Frontend (`front/.env`)

Based on `front/.env.example`:

- `VITE_API_URL` - backend base URL used by the UI.  
  Example: `http://localhost:3001`

### Backend (`back/.env`)

Based on `back/.env.example`:

- `PORT` - API port (default `3001`)
- `FRONTEND_ORIGIN` - allowed CORS origin(s), comma-separated when needed
- `JSON_BODY_LIMIT` - JSON payload limit (default `10kb`)
- `MOOD_MAX_LENGTH` - max allowed mood length (default `280`)
- `MOOD_RATE_LIMIT_WINDOW_MS` - rate-limit window duration in ms
- `MOOD_RATE_LIMIT_MAX` - max requests per window for `POST /api/mood`
- `LOG_FORMAT` - `morgan` format string (default `dev`)
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` - Spotify API credentials

## API Endpoints

- `GET /health` - health check
- `POST /api/mood` - receives `{ "mood": "..." }` and returns:
  - `mood`
  - `friendlyMessage`
  - `playlists` (`name`, `url`, `reason`, `thumbnailUrl`)
  - `source` (`spotify` or `fallback`)

## Tests

### Backend

```bash
cd back
npm test
```

### Frontend

```bash
cd front
npm test
```

## Deployment Strategy

Simple and low-maintenance option:

- Deploy `front/` to **Vercel**
- Deploy `back/` to **Render**, **Fly.io**, or **Railway**

Recommended production setup:

1. Deploy backend and copy its public URL
2. Set `VITE_API_URL` on frontend to backend URL
3. Deploy frontend and copy its public URL
4. Set backend `FRONTEND_ORIGIN` to the frontend domain (real production domain)
5. Redeploy backend so CORS only accepts your frontend origin

Example:

- Frontend: `https://music-moods.vercel.app`
- Backend env: `FRONTEND_ORIGIN=https://music-moods.vercel.app`
