# 🎧 Music Moods

A web app that reads the user's mood and responds with a friendly message plus Spotify playlist suggestions.

---

## ✨ Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/7b3fa7c7-3dfc-4b87-8b26-4bb2899ca031" width="80%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/278a65a7-5c57-4fc7-bd4f-5c02723bbc55" width="80%" />
</p>

---

## 🏗️ Project Structure

```bash
music/
├── back/   # API (Node + Express + TypeScript)
└── front/  # Web App (React + Vite + Tailwind + TypeScript)
```

---

## 🚀 Running Locally

### 🔙 Backend

```bash
cd back
npm install
cp .env.example .env
npm run dev
```

- Default URL: `http://localhost:3001`
- Build output: `back/dist`

---

### 🎨 Frontend

```bash
cd front
npm install
cp .env.example .env
npm run dev
```

- Default URL: `http://localhost:5173`

---

## ⚙️ TypeScript Setup

### Backend

- Source: `back/src/**/*.ts`

```bash
npm run build
npm run start
```

---

### Frontend

- Source: `front/src/**/*.ts` and `*.tsx`

```bash
npm run typecheck
npm run build
```

---

## 🔐 Environment Variables

### 🖥️ Frontend (`front/.env`)

```env
VITE_API_URL=http://localhost:3001
```

---

### 🔙 Backend (`back/.env`)

```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
JSON_BODY_LIMIT=10kb
MOOD_MAX_LENGTH=280
MOOD_RATE_LIMIT_WINDOW_MS=60000
MOOD_RATE_LIMIT_MAX=100
LOG_FORMAT=dev

SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

---

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

---

### Mood Analysis

```http
POST /api/mood
```

**Request Body**

```json
{
  "mood": "I'm feeling happy today!"
}
```

**Response**

```json
{
  "mood": "...",
  "friendlyMessage": "...",
  "playlists": [
    {
      "name": "...",
      "url": "...",
      "reason": "...",
      "thumbnailUrl": "..."
    }
  ],
  "source": "spotify | fallback"
}
```

---

## 🧪 Tests

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

---

## 🧹 Code Quality

Run in each package:

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

---

## ☁️ Deployment

### Simple Strategy

- Frontend → Vercel
- Backend → Render / Fly.io / Railway

---

### 🔄 Steps

1. Deploy the backend  
2. Copy the public backend URL  
3. Set it in the frontend:

```env
VITE_API_URL=https://your-backend.com
```

4. Deploy the frontend  
5. Set the frontend URL in the backend:

```env
FRONTEND_ORIGIN=https://your-frontend.com
```

6. Redeploy the backend  

---

### 🌍 Example

- Frontend: `https://music-moods.vercel.app`

```env
FRONTEND_ORIGIN=https://music-moods.vercel.app
```

---

## 💡 About the Project

Music Moods transforms feelings into music — creating a simple, empathetic, and personalized experience 🎶

---

## 📌 Tech Stack

- Backend: Node.js, Express, TypeScript
- Frontend: React, Vite, Tailwind CSS, TypeScript
- API: Spotify Web API

---

## 🤝 Contributing

Feel free to open issues or submit pull requests!

---

## 📄 License

This project is open-source and available under the MIT License.
