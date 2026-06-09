// Resolve photo URLs — works both in dev (localhost) and production (Render)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getImageUrl(photoUrl) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http')) return photoUrl;
  return `${API_BASE}${photoUrl}`;
}
