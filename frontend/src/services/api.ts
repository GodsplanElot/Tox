import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import type { Category } from "../types/category";
import type { WatchlistItem } from "../types/watchlist";
import type { AuthResponse, AuthUser, RegisterPendingResponse } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000/api";
const MEDIA_BASE_URL =
  import.meta.env.VITE_MEDIA_BASE_URL ??
  "http://localhost:8000";

export type { Movie, Series, Category };

const ACCESS_TOKEN_KEY = "tox_access_token";
const REFRESH_TOKEN_KEY = "tox_refresh_token";
const AUTH_CLEARED_EVENT = "tox-auth-cleared";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CLEARED_EVENT));
};

const storeAccessToken = (access: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let message = `API error: ${response.statusText}`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (typeof data === "object" && data !== null) {
        message = Object.values(data).flat().join(" ");
      }
    } catch {
      // Keep the HTTP status text when the response is not JSON.
    }
    throw new Error(message);
  }
  return response.json();
};

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const response = await fetch(`${API_BASE_URL}/users/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearAuthTokens();
    return false;
  }

  const data = (await response.json()) as { access?: string };
  if (!data.access) {
    clearAuthTokens();
    return false;
  }

  storeAccessToken(data.access);
  return true;
};

const authFetch = async (url: string, init: RequestInit = {}) => {
  const headers = {
    ...(init.headers as Record<string, string> | undefined),
    ...getAuthHeaders(),
  };

  const response = await fetch(url, { ...init, headers });
  if (response.status !== 401) return response;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return response;

  return fetch(url, {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...getAuthHeaders(),
    },
  });
};

const unwrapList = async <T>(response: Response): Promise<T[]> => {
  const data = await handleResponse(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
};

export const api = {
  register: (payload: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
  }): Promise<RegisterPendingResponse> =>
    fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  verifyEmail: (payload: { email: string; otp: string }): Promise<AuthResponse> =>
    fetch(`${API_BASE_URL}/users/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  resendOtp: (email: string): Promise<RegisterPendingResponse> =>
    fetch(`${API_BASE_URL}/users/resend-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(handleResponse),

  login: (email: string, password: string): Promise<AuthResponse> =>
    fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    }).then(handleResponse),

  googleLogin: (credential: string): Promise<AuthResponse> =>
    fetch(`${API_BASE_URL}/users/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    }).then(handleResponse),

  getCurrentUser: (): Promise<AuthUser> =>
    authFetch(`${API_BASE_URL}/users/me/`).then(handleResponse),

  getMovies: (): Promise<Movie[]> => 
    fetch(`${API_BASE_URL}/movies/`).then(unwrapList<Movie>),
  
  getMovie: (slug: string): Promise<Movie> => 
    fetch(`${API_BASE_URL}/movies/${slug}/`).then(handleResponse),

  getSeries: (): Promise<Series[]> => 
    fetch(`${API_BASE_URL}/series/`).then(unwrapList<Series>),

  getSeriesDetail: (slug: string): Promise<Series> => 
    fetch(`${API_BASE_URL}/series/${slug}/`).then(handleResponse),

  getCategories: (): Promise<Category[]> => 
    fetch(`${API_BASE_URL}/categories/`).then(unwrapList<Category>),

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
    authFetch(`${API_BASE_URL}/watchlist/`).then(unwrapList<WatchlistItem>),

  checkWatchlistStatus: (contentType: string, objectId: number): Promise<WatchlistItem[]> =>
    authFetch(`${API_BASE_URL}/watchlist/?content_type=${contentType}&object_id=${objectId}`).then(unwrapList<WatchlistItem>),

  addToWatchlist: (contentType: string, objectId: number): Promise<WatchlistItem> => {
    return authFetch(`${API_BASE_URL}/watchlist/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_type_model: contentType, object_id: objectId })
    }).then(handleResponse);
  },

  removeFromWatchlist: (itemId: number): Promise<void> => 
    authFetch(`${API_BASE_URL}/watchlist/${itemId}/`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error("Failed to remove from watchlist");
    })
};
