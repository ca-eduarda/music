import { useState } from "react";

const API_BASE_URL = "http://localhost:3001";

function getPlaylistThumb(name) {
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/600/600`;
}

export default function App() {
  const [mood, setMood] = useState("");
  const [step, setStep] = useState("input");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedMood = mood.trim();
    if (!trimmedMood) {
      setError("Please describe your mood before submitting.");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const response = await fetch(`${API_BASE_URL}/api/mood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mood: trimmedMood })
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Something went wrong.");
        setStep("input");
        return;
      }

      setData(payload);
      setStep("result");
    } catch (_error) {
      setError(
        "Could not connect to backend. Make sure it is running on localhost:3001."
      );
      setStep("input");
    }
  }

  function handleTryAgain() {
    setStep("input");
  }

  return (
    <main className="page">
      <section className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-dot" />
            <span>Music AI</span>
          </div>
          <span className="chip">Mood to Playlist</span>
        </header>

        {step === "input" && (
          <section className="panel">
            <header className="hero">
              <p className="badge">Start Here</p>
              <h1>How are you feeling today?</h1>
              <p className="subtitle">
                Describe your mood in your own words and we will find matching
                playlists on Spotify.
              </p>
            </header>

            <form className="form panel-card" onSubmit={handleSubmit}>
              <label htmlFor="mood">Your message</label>
              <textarea
                id="mood"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                placeholder="Example: I feel calm, creative and a little nostalgic."
                rows={4}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit">Generate playlists</button>
            </form>
          </section>
        )}

        {step === "loading" && (
          <section className="center-state panel">
            <p className="badge">Loading</p>
            <h2>Preparing your music vibe...</h2>
            <p>Matching your mood keywords and searching Spotify.</p>
            <div className="spinner" />
          </section>
        )}

        {step === "result" && data && (
          <section className="panel">
            <header className="result-header">
              <p className="badge">Recommendations</p>
              <h2>Your playlist grid is ready</h2>
              <span className="source">{data.source || "unknown"}</span>
            </header>

            <p className="friendly panel-card">{data.friendlyMessage}</p>

            <section className="playlist-grid">
              {(data.playlists || []).map((playlist) => (
                <article className="playlist-card" key={playlist.url}>
                  <img
                    src={playlist.thumbnailUrl || getPlaylistThumb(playlist.name)}
                    alt={`${playlist.name} thumbnail`}
                    loading="lazy"
                  />
                  <div className="playlist-body">
                    <h3>{playlist.name}</h3>
                    <p>{playlist.reason}</p>
                    <a href={playlist.url} target="_blank" rel="noreferrer">
                      Open on Spotify
                    </a>
                  </div>
                </article>
              ))}
            </section>

            <button className="secondary" type="button" onClick={handleTryAgain}>
              Try another mood
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
