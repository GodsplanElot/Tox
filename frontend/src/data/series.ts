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
    firstAirDate: new Date("2023-02-14"),
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
            thumb: "/img/covers/cover15.jpg",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes",
            runtime: 50,
            videoUrl: "/videos/dark-signal/s1e2.mp4",
            thumb: "/img/covers/cover15.jpg",
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
    title: "Dry fit",
    description: "Rain or shine, the adventure begins.",
    poster: "/img/covers/cover16.jpg",
    backdrop: "/img/covers/cover16.jpg",
    rating: 4.9,
    year: 2023,
    firstAirDate: new Date("2023-06-01"),
    genres: ["Action", "Thriller"],
    categoryIds: [3],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "Restless Wind",
            runtime: 48,
            videoUrl: "/videos/jolly/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "flying high",
            runtime: 50,
            videoUrl: "/videos/jolly/s1e2.mp4",
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
            title: "connected souls",
            runtime: 48,
            videoUrl: "/videos/jolly/s2e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "calling home",
            runtime: 50,
            videoUrl: "/videos/dry-fit/s2e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Molly King",
    description: "An adventurous tale of a young detective solving mysteries. and unexpected twists.",
    poster: "/img/covers/cover17.jpg",
    backdrop: "/img/covers/cover17.jpg",
    rating: 3.0,
    year: 2023,
    firstAirDate: new Date("2022-02-04"),
    genres: ["Crime", "Adventure"],
    categoryIds: [4],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "chase the thief",
            runtime: 48,
            videoUrl: "/videos/jolly/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "scream in the dark",
            runtime: 50,
            videoUrl: "/videos/jolly/s1e2.mp4",
          },
          {
            id: 3,
            episodeNumber: 3,
            title: "mystery of the night",
            runtime: 50,
            videoUrl: "/videos/jolly/s1e2.mp4",
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
            title: "Magic begins",
            runtime: 48,
            videoUrl: "/videos/jolly/s2e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Thunder strikes",
            runtime: 50,
            videoUrl: "/videos/jolly/s2e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Jolly",
    description: "A happy-go-lucky show full of unexpected twists.",
    poster: "/img/covers/cover16.jpg",
    backdrop: "/img/covers/cover16.jpg",
    rating: 9.9,
    year: 2023,
    firstAirDate: new Date("2023-06-01"),
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
            videoUrl: "/videos/jolly/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes",
            runtime: 50,
            videoUrl: "/videos/jolly/s1e2.mp4",
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
            title: "The Signalx",
            runtime: 48,
            videoUrl: "/videos/jolly/s2e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes vc",
            runtime: 50,
            videoUrl: "/videos/jolly/s2e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "slade winger",
    description: "A warrior's journey through a land of myths and legends.",
    poster: "/img/covers/cover17.jpg",
    backdrop: "/img/covers/cover17.jpg",
    rating: 9.9,
    year: 2023,
    firstAirDate: new Date("2023-06-01"),
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
            videoUrl: "/videos/jolly/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes",
            runtime: 50,
            videoUrl: "/videos/jolly/s1e2.mp4",
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
            videoUrl: "/videos/jolly/s2e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes vc",
            runtime: 50,
            videoUrl: "/videos/jolly/s2e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Rain man",
    description: "A thrilling saga of survival and hope in a post-apocalyptic world.",
    poster: "/img/covers/cover18.jpg",
    backdrop: "/img/covers/cover18.jpg",
    rating: 9.9,
    year: 2023,
    firstAirDate: new Date("2023-06-01"),
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
            videoUrl: "/videos/jolly/s1e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes",
            runtime: 50,
            videoUrl: "/videos/jolly/s1e2.mp4",
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
            videoUrl: "/videos/jolly/s2e1.mp4",
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Echoes vc",
            runtime: 50,
            videoUrl: "/videos/jolly/s2e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Quantum Leap",
    description: "A scientist travels through time, leaping into the lives of others to correct history's mistakes.",
    poster: "/img/covers/cover1.jpg",
    backdrop: "/img/covers/cover1.jpg",
    rating: 8.5,
    year: 2024,
    firstAirDate: new Date("2024-03-10"),
    genres: ["Sci-Fi", "Drama"],
    categoryIds: [1],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "The First Jump",
            runtime: 45,
            videoUrl: "/videos/quantum/s1e1.mp4",
            thumb: "/img/covers/cover1.jpg"
          },
          {
            id: 2,
            episodeNumber: 2,
            title: "Missing Memories",
            runtime: 48,
            videoUrl: "/videos/quantum/s1e2.mp4",
            thumb: "/img/covers/cover1.jpg"
          }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "The Last Kingdom",
    description: "A young Saxon nobleman is raised by Vikings and must choose between his birthright and the people who raised him.",
    poster: "/img/covers/cover14.jpg",
    backdrop: "/img/covers/cover14.jpg",
    rating: 9.1,
    year: 2023,
    firstAirDate: new Date("2023-11-05"),
    genres: ["Action", "History"],
    categoryIds: [3],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "Destiny is All",
            runtime: 52,
            videoUrl: "/videos/kingdom/s1e1.mp4",
            thumb: "/img/covers/cover14.jpg"
          }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Shadow and Bone",
    description: "Sinister forces plot against a young soldier when she reveals a magical power that might unite her world.",
    poster: "/img/covers/cover15.jpg",
    backdrop: "/img/covers/cover15.jpg",
    rating: 8.2,
    year: 2023,
    firstAirDate: new Date("2023-04-21"),
    genres: ["Fantasy", "Adventure"],
    categoryIds: [1, 4],
    seasons: [
      {
        id: 1,
        seasonNumber: 1,
        episodes: [
          {
            id: 1,
            episodeNumber: 1,
            title: "Aftermath",
            runtime: 50,
            videoUrl: "/videos/shadow/s1e1.mp4",
            thumb: "/img/covers/cover15.jpg"
          }
        ]
      }
    ]
  }
];
