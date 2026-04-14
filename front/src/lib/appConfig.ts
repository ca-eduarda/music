export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

export function getPlaylistThumb(name: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/600/600`;
}
