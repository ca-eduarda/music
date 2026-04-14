# music-ai

An app that understands the user's mood and returns a friendly message with a playlist recommendation.

## Initial structure

```text
music-ai/
  back/   -> API (Node + Express)
  front/  -> Web interface (placeholder)
```

## Minimal backend

The backend lives in `back/` and already includes:

- `POST /api/mood` to receive `{ "mood": "..." }`
- a response with `friendlyMessage` + `playlist`
- `GET /health` for status checks

### Running the backend

1. Go to the backend folder:
   - `cd back`
2. Install dependencies:
   - `npm install`
3. (Optional) copy `.env.example` to `.env`
4. Run:
   - `npm run dev`

Default server URL: `http://localhost:3001`
