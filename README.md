# music

An app that understands the user's mood and returns a friendly message with a playlist recommendation.

## Initial structure

```text
music/
  back/   -> API (Node + Express)
  front/  -> Web interface (placeholder)
```

## Minimal backend

The backend lives in `back/` and already includes:

- `POST /api/mood` to receive `{ "mood": "..." }`
- a response with `friendlyMessage` + Spotify playlist recommendations
- `GET /health` for status checks
- keyword-based mood detection + Spotify Search API integration

### Running the backend

1. Go to the backend folder:
   - `cd back`
2. Install dependencies:
   - `npm install`
3. (Optional) copy `.env.example` to `.env`
   - Add your Spotify app credentials:
   - `SPOTIFY_CLIENT_ID=your_spotify_client_id_here`
   - `SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here`
4. Run:
   - `npm run dev`

Default server URL: `http://localhost:3001`

### API response shape

`POST /api/mood` returns:

- `mood`: normalized user input
- `friendlyMessage`: keyword-based message
- `playlists`: list of playlists with `name`, `url`, `reason`, and `thumbnailUrl`
- `source`: `spotify` when Spotify API is used, `fallback` otherwise
