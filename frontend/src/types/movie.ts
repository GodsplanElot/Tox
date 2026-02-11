import type { Category } from "./category";

export interface Movie {
  id: number;
  title: string;
  slug: string;
  poster: string;
  description: string;
  rating?: number;
  release_date?: string;
  runtime?: number;
  categories: Category[];
  tmdb_id?: number;
  
  // Video Source Fields
  source_type?: "upload" | "external";
  video_file?: string;
  external_url?: string;
  
  created_at?: string;
}
