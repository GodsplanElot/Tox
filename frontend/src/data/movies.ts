// src/data/movies.ts
import type { Movie } from "../types/movie";

/* ================= MOCK MOVIE RAIL DATA ================= */
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Endless Horizon",
    poster: "/img/covers/cover1.jpg",
    rating: 8.2,
    releaseDate: "2023-06-21",
    categoryIds: [3],
  },
  {
    id: 2,
    title: "Dark Waters",
    poster: "/img/covers/cover2.jpg",
    rating: 7.9,
    releaseDate: "2023-06-21",
    categoryIds: [3],
  },
  {
    id: 3,
    title: "Lost Signal",
    poster: "/img/covers/cover3.jpg",
    rating: 8.5,
    releaseDate: "2023-06-21",
    categoryIds: [3],  
  },
  {
    id: 4,
    title: "Neon City",
    poster: "/img/covers/cover4.jpg",
    rating: 7.4,
    releaseDate: "2023-06-21",
    categoryIds: [3],
  },
];

/* ================= MOCK DB GRID DATA ================= */
export const moviesFromDb: Movie[] = [
  {
    id: 101,
    title: "Neon City",
    poster: "/img/covers/cover1.jpg",
    rating: 8.3,
    releaseDate: "2024-01-12",
    categoryIds: [1]
  },
  {
    id: 102,
    title: "Broken Silence",
    poster: "/img/covers/cover2.jpg",
    rating: 7.6,
    releaseDate: "2022-08-03",
    categoryIds: [2],
  },
  {
    id: 103,
    title: "Laugh Riot",
    poster: "/img/covers/cover3.jpg",
    rating: 7.9,
    releaseDate: "2023-06-21",
    categoryIds: [3],
  },
  {
    id: 104,
    title: "Laugh Rioyt",
    poster: "/img/covers/cover4.jpg",
    rating: 7.9,
    releaseDate: "2023-06-21",
    categoryIds: [3],
  },
  {
    id: 105,
    title: "Mystic Falls",
    poster: "/img/covers/cover4.jpg",
    rating: 8.1,
    releaseDate: "2023-06-21",
    categoryIds: [3],
  },
  
];
