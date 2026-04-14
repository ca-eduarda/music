import { Badge } from "@/components/ui/Badge/Badge";
import { Music2 } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between rounded-2xl border bg-card px-5 py-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Music2 className="h-4 w-4" />
        <span>Music Moods</span>
      </div>
      <Badge variant="outline">Mood to Playlist</Badge>
    </header>
  );
}
