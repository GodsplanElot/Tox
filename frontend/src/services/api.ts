import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import type { Category } from "../types/category";

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
    return `${MEDIA_BASE_URL}${path}`;
  }
};
