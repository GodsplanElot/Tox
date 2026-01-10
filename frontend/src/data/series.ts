import type { Series } from "../types/series"

export const seriesFromDb: Series[] = [
  {
    id: 1,
    title: "Dark Signal",
    description: "A mysterious signal changes the fate of a small town.",
    poster: "/img/series/dark-signal/poster.jpg",
    backdrop: "/img/series/dark-signal/bg.jpg",
    rating: 8.9,
    year: 2023,
    genres: ["Sci-Fi", "Thriller"],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "The Signal",
            runtime: 48,
            videoUrl: "/videos/dark-signal/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes",
            runtime: 50,
            videoUrl: "/videos/dark-signal/s1e2.mp4",
          },
        ],
      },
    ],
  },
]
