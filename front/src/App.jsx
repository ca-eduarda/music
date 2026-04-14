import { useState } from "react";
import { Loader2, Music2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/Card/Card";
import { Textarea } from "@/components/ui/Textarea/Textarea";

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
    setMood("");
    setStep("input");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <header className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Music2 className="h-4 w-4" />
              <span>Music AI</span>
            </div>
            <Badge variant="outline">Mood to Playlist</Badge>
          </header>

          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <Badge variant="outline" className="w-fit">
                Shadcn Style
              </Badge>
              <CardTitle className="text-3xl tracking-tight">
                How are you feeling today?
              </CardTitle>
              <CardDescription className="max-w-2xl">
                Write your mood in your own words and get Spotify playlist
                recommendations based on your keywords.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
        {step === "input" && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="mood" className="text-sm font-medium">
                    Your message
                  </label>
                  <Textarea
                id="mood"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                placeholder="Example: I feel calm, creative and a little nostalgic."
                    rows={5}
              />
                </div>

              {error && <p className="error">{error}</p>}

                <Button type="submit" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate playlists
                </Button>
              </form>
        )}

        {step === "loading" && (
              <section className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                <Badge variant="secondary">Loading</Badge>
                <h2 className="text-xl font-semibold">Preparing your music vibe...</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Matching your mood keywords and searching Spotify.
                </p>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </section>
        )}

        {step === "result" && data && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Badge variant="secondary">Recommendations</Badge>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Your playlist grid is ready
                    </h2>
                  </div>
                  <Badge variant="outline">{data.source || "unknown"}</Badge>
                </div>

                <Card className="border-dashed bg-muted/30">
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    {data.friendlyMessage}
                  </CardContent>
                </Card>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data.playlists || []).map((playlist) => (
                    <Card key={playlist.url} className="overflow-hidden">
                  <img
                    src={playlist.thumbnailUrl || getPlaylistThumb(playlist.name)}
                    alt={`${playlist.name} thumbnail`}
                    loading="lazy"
                        className="aspect-square w-full object-cover"
                  />
                      <CardContent className="space-y-2 p-4">
                        <h3 className="text-sm font-semibold">
                          {playlist.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {playlist.reason}
                        </p>
                        <Button asChild size="sm" variant="outline" className="w-full">
                          <a href={playlist.url} target="_blank" rel="noreferrer">
                            Open on Spotify
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
              ))}
                </section>

                <Button variant="secondary" type="button" onClick={handleTryAgain}>
                  Try another mood
                </Button>
              </section>
        )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
