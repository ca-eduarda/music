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
- a response with `friendlyMessage` + dynamic AI playlist ideas
- `GET /health` for status checks
- OpenAI integration with fallback to Spotify search suggestions

### Running the backend

1. Go to the backend folder:
   - `cd back`
2. Install dependencies:
   - `npm install`
3. (Optional) copy `.env.example` to `.env`
   - Add your OpenAI key to enable real AI responses:
   - `OPENAI_API_KEY=your_openai_api_key_here`
4. Run:
   - `npm run dev`

Default server URL: `http://localhost:3001`

### API response shape

`POST /api/mood` returns:

- `mood`: normalized user input
- `friendlyMessage`: AI-generated (or fallback) message
- `playlists`: list of playlist ideas with `name`, `url`, and `reason`
- `source`: `ai` when OpenAI is used, `fallback` otherwise
