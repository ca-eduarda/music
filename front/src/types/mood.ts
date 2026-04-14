export interface PlaylistItem {
  name: string;
  url: string;
  reason: string;
  thumbnailUrl?: string;
}

export interface MoodRecommendation {
  mood: string;
  friendlyMessage: string;
  playlists: PlaylistItem[];
  source: string;
}
