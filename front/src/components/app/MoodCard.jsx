import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { getPlaylistThumb } from "@/lib/appConfig";
import { Loader2, Sparkles } from "lucide-react";

export function MoodCard({
  step,
  mood,
  error,
  data,
  onMoodChange,
  onSubmit,
  onTryAgain,
}) {
  const playlists = Array.isArray(data?.playlists) ? data.playlists : [];
  const friendlyMessage =
    typeof data?.friendlyMessage === "string"
      ? data.friendlyMessage
      : "We found recommendations, but some details are unavailable.";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <Badge variant="outline" className="w-fit">
          <a
            href="https://www.figma.com/community/file/1203061493325953101"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            UI inspired by Shadcn (Figma)
          </a>
        </Badge>
        <CardTitle className="text-3xl tracking-tight sm:text-4xl">
          How are you feeling today?
        </CardTitle>
        <CardDescription className="max-w-2xl text-base leading-relaxed">
          Write your mood in your own words and get Spotify playlist
          recommendations based on your keywords.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "input" && (
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2.5">
              <label htmlFor="mood" className="text-sm font-medium">
                Describe your mood
              </label>
              <Textarea
                id="mood"
                value={mood}
                onChange={(event) => onMoodChange(event.target.value)}
                placeholder="Example: I feel calm, creative and a little nostalgic."
                rows={6}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "mood-error" : undefined}
              />
            </div>

            {error && (
              <p id="mood-error" className="error" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full gap-2 sm:w-auto" size="lg">
              <Sparkles className="h-4 w-4" />
              Generate playlists
            </Button>
          </form>
        )}

        {step === "loading" && (
          <section
            className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center"
            role="status"
            aria-live="polite"
          >
            <Badge variant="secondary">Loading</Badge>
            <h2 className="text-xl font-semibold">Preparing your music vibe...</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Matching your mood keywords and searching Spotify.
            </p>
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </section>
        )}

        {step === "result" && data && (
          <section className="space-y-5">
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
              <CardContent className="p-5 text-sm text-muted-foreground">
                {friendlyMessage}
              </CardContent>
            </Card>

            {playlists.length > 0 ? (
              <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {playlists.map((playlist, index) => (
                  <Card
                    key={`${playlist.url || playlist.name || "playlist"}-${index}`}
                    className="overflow-hidden"
                  >
                    <img
                      src={
                        playlist.thumbnailUrl || getPlaylistThumb(playlist.name)
                      }
                      alt={`${playlist.name} thumbnail`}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    <CardContent className="space-y-3 p-5">
                      <h3 className="text-sm font-semibold">{playlist.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {playlist.reason}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <a href={playlist.url} target="_blank" rel="noreferrer">
                          Open on Spotify
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>
            ) : (
              <Card className="border-dashed bg-muted/30">
                <CardContent className="p-5 text-sm text-muted-foreground">
                  No playlists are available right now. Try another mood.
                </CardContent>
              </Card>
            )}

            <Button
              variant="secondary"
              type="button"
              onClick={onTryAgain}
              size="lg"
            >
              Try another mood
            </Button>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
