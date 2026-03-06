import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import type { Category } from "../types/category";
import type { WatchlistItem } from "../types/watchlist";

const API_BASE_URL = 'http://localhost:8000/api';
const MEDIA_BASE_URL = 'http://localhost:8000';

export type { Movie, Series, Category };

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  getMovies: (): Promise<Movie[]> => 
    fetch(`${API_BASE_URL}/movies/`).then(handleResponse),
  
  getMovie: (slug: string): Promise<Movie> => 
    fetch(`${API_BASE_URL}/movies/${slug}/`).then(handleResponse),

  getSeries: (): Promise<Series[]> => 
    fetch(`${API_BASE_URL}/series/`).then(handleResponse),

  getSeriesDetail: (slug: string): Promise<Series> => 
    fetch(`${API_BASE_URL}/series/${slug}/`).then(handleResponse),

  getCategories: (): Promise<Category[]> => 
    fetch(`${API_BASE_URL}/categories/`).then(handleResponse),

  getMediaUrl: (path: string | null | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${MEDIA_BASE_URL}${cleanPath}`;
  },

  getVideoUrl: (item: { source_type?: string; video_file?: string; external_url?: string } | null | undefined) => {
    if (!item) return '';
    if (item.source_type === 'external') return item.external_url || '';
    return api.getMediaUrl(item.video_file);
  },

  getWatchlist: (): Promise<WatchlistItem[]> => 
    fetch(`${API_BASE_URL}/watchlist/`).then(handleResponse),

  checkWatchlistStatus: (contentType: string, objectId: number): Promise<WatchlistItem[]> =>
    fetch(`${API_BASE_URL}/watchlist/?content_type=${contentType}&object_id=${objectId}`).then(handleResponse),

  addToWatchlist: (contentType: string, objectId: number): Promise<WatchlistItem> => {
    return fetch(`${API_BASE_URL}/watchlist/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_type_model: contentType, object_id: objectId })
    }).then(handleResponse);
  },

  removeFromWatchlist: (itemId: number): Promise<void> => 
    fetch(`${API_BASE_URL}/watchlist/${itemId}/`, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error("Failed to remove from watchlist");
    })
};
