export interface Movie {
  id: number;
  title: string;
  poster: string;
  year?: string;
  rating?: number;
  releaseDate?: string; // ISO string for sorting
  categoryIds: number[]; // <-- key for filtering
}
