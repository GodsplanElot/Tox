export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  poster?: string;
  is_active?: boolean;
  /** Published titles in this category (list endpoint only). */
  movie_count?: number;
  series_count?: number;
};
