import type { Category } from "./category";

export interface Episode {
  id: number;
  episode_number: number;
  title: string;
  slug: string;
  plot?: string;
  thumbnail?: string;
  runtime?: number;
  release_date?: string;
  source_type?: "upload" | "external";
  video_file?: string;
  external_url?: string;
}

export interface Season {
  id: number;
  season_number: number;
  title?: string;
  slug: string;
  description?: string;
  poster?: string;
  episodes: Episode[];
}

export interface Series {
  id: number;
  title: string;
  slug: string;
  description: string;
  poster: string;
  trailer_url?: string;
  rating?: number;
  first_air_date?: string;
  categories: Category[];
  seasons: Season[];
  tmdb_id?: number;
  created_at?: string;
}
