import type { Category } from "./category";

export interface Movie {
  id: number;
  title: string;
  slug: string;
  poster: string;
  hero_image?: string | null;
  description: string;
  rating?: number;
  release_date?: string;
  runtime?: number;
  categories: Category[];
  tmdb_id?: number;
  
  // Video Source Fields
  source_type?: "upload" | "external";
  download_available?: boolean;
  
  created_at?: string;
}
