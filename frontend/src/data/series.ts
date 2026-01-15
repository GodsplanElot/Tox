import type { Series } from "../types/series"

export const seriesFromDb: Series[] = [
  {
    id: 1,
    title: "Dark Signal",
    description: "A mysterious signal changes the fate of a small town.",
    poster: "/img/covers/cover15.jpg",
    backdrop: "/img/covers/cover15.jpg",
    rating: 8.9,
    year: 2023,
    genres: ["Sci-Fi", "Thriller"],
    categoryIds: [1, 3],
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
      {
        id: 2,
        seasonNumber: 2,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "The Signalxx",
            runtime: 48,
            videoUrl: "/videos/dark-signal/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes vc",
            runtime: 50,
            videoUrl: "/videos/dark-signal/s1e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "jolly",
    description: "happy go lucky show  ",
    poster: "/img/covers/cover16.jpg",
    backdrop: "/img/covers/cover16.jpg",
    rating: 9.9,
    year: 2023,
    genres: ["Sci-Fi", "Thriller"],
    categoryIds: [1],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "Runaway Killer",
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
      {
        id: 2,
        seasonNumber: 2,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "The Signalxx",
            runtime: 48,
            videoUrl: "/videos/dark-signal/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes vc",
            runtime: 50,
            videoUrl: "/videos/dark-signal/s1e2.mp4",
          },
        ],
      },
    ],
  },
]
