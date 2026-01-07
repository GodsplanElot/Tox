export interface MovieVideo {
  src: string;        // mp4 / webm / HLS later
  poster?: string;    // fallback image
  duration?: number;  // seconds (optional)
}

export interface Movie {
  id: number;
  title: string;
  poster: string;
  year?: string;
  rating?: number;
  downloadUrl?: string
  releaseDate?: string; // ISO string for sorting
  categoryIds: number[]; // <-- key for filtering
  backdrop?: string
  runtime?: number
  genres?: string[]
  description?: string
  trailer?: string

  video?: MovieVideo; // 👈 NEW (mini screen video)
}




