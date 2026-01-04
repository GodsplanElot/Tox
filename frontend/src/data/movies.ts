// src/data/movies.ts
import type { Movie } from "../types/movie";

/* ================= MOCK MOVIE RAIL DATA ================= */
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Endless Horizon",
    poster: "/img/covers/cover1.jpg",
    rating: 8.2,
  },
  {
    id: 2,
    title: "Dark Waters",
    poster: "/img/covers/cover2.jpg",
    rating: 7.9,
  },
  {
    id: 3,
    title: "Lost Signal",
    poster: "/img/covers/cover3.jpg",
    rating: 8.5,
  },
  {
    id: 4,
    title: "Neon City",
    poster: "/img/covers/cover4.jpg",
    rating: 7.4,
  },
];

/* ================= MOCK DB GRID DATA ================= */
export const moviesFromDb: Movie[] = [
  {
    id: 101,
    title: "Mystic Falls",
    poster: "/img/covers/cover5.jpg",
    rating: 8.1,
  },
  {
    id: 102,
    title: "Mystic Falls",
    poster: "/img/covers/cover1.jpg",
    rating: 8.1,
  },
  {
    id: 103,
    title: "Mystic Falls",
    poster: "/img/covers/cover2.jpg",
    rating: 8.1,
  },
  {
    id: 104,
    title: "Mystic Falls",
    poster: "/img/covers/cover3.jpg",
    rating: 8.1,
  },
  {
    id: 105,
    title: "Mystic Falls",
    poster: "/img/covers/cover4.jpg",
    rating: 8.1,
  },
  {
    id: 106,
    title: "Mystic Falls",
    poster: "/img/covers/cover5.jpg",
    rating: 8.1,
  },
  {
    id: 107,
    title: "Mystic Falls",
    poster: "/img/covers/cover6.jpg",
    rating: 8.1,
  },
  {
    id: 108,
    title: "Mystic Falls",
    poster: "/img/covers/cover8.jpg",
    rating: 8.1,
  },
];
