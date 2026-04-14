# Frontend (React + Vite)

Main flow implemented:
- screen 1: mood message input
- loading state while calling backend
- screen 2: playlist grid with thumbnails

## Run locally

1. Start backend in another terminal:
   - `cd ../back && npm run dev`
2. Start frontend:
   - `npm install`
   - `npm run dev`
3. Open the URL shown by Vite (usually `http://localhost:5173`)

The app calls `POST http://localhost:3001/api/mood`.
