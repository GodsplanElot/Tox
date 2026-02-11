import type { Series } from "../types/series";
import { categories } from "./categories";

export const seriesFromDb: Series[] = [
  {
    id: 1,
    title: "Dark Signal",
    slug: "dark-signal",
    description: "A mysterious signal changes the fate of a small town.",
    poster: "/img/covers/cover15.jpg",
    rating: 8.9,
    first_air_date: "2023-02-14",
    categories: [categories[0], categories[2]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "dark-signal-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "The Signal",
            slug: "dark-signal-s1e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/dark-signal/s1e1.mp4",
            thumbnail: "/img/covers/cover15.jpg",
            plot: "When a strange radio signal is picked up by a local station, strange things begin to happen in the town of Blackwood."
          },
          {
            id: 2,
            episode_number: 2,
            title: "Echoes",
            slug: "dark-signal-s1e2",
            runtime: 50,
            source_type: "upload",
            video_file: "/videos/dark-signal/s1e2.mp4",
            thumbnail: "/img/covers/cover15.jpg",
            plot: "As the signal grows stronger, residents report hearing voices from their past through any electronic device."
          },
        ],
      },
      {
        id: 2,
        season_number: 2,
        slug: "dark-signal-season-2",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "The Signalxx",
            slug: "dark-signal-s2e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/dark-signal/s2e1.mp4",
          },
          {
            id: 2,
            episode_number: 2,
            title: "Echoes vc",
            slug: "dark-signal-s2e2",
            runtime: 50,
            source_type: "upload",
            video_file: "/videos/dark-signal/s2e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Dry fit",
    slug: "dry-fit",
    description: "Rain or shine, the adventure begins.",
    poster: "/img/covers/cover16.jpg",
    rating: 4.9,
    first_air_date: "2023-06-01",
    categories: [categories[2]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "dry-fit-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "Restless Wind",
            slug: "dry-fit-s1e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/jolly/s1e1.mp4",
          },
          {
            id: 2,
            episode_number: 2,
            title: "flying high",
            slug: "dry-fit-s1e2",
            runtime: 50,
            source_type: "upload",
            video_file: "/videos/jolly/s1e2.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Molly King",
    slug: "molly-king",
    description: "An adventurous tale of a young detective solving mysteries. and unexpected twists.",
    poster: "/img/covers/cover17.jpg",
    rating: 3.0,
    first_air_date: "2022-02-04",
    categories: [categories[3]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "molly-king-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "chase the thief",
            slug: "molly-king-s1e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/jolly/s1e1.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Jolly",
    slug: "jolly",
    description: "A happy-go-lucky show full of unexpected twists.",
    poster: "/img/covers/cover16.jpg",
    rating: 9.9,
    first_air_date: "2023-06-01",
    categories: [categories[0]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "jolly-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "Runaway Killer",
            slug: "jolly-s1e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/jolly/s1e1.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Slade Winger",
    slug: "slade-winger",
    description: "A warrior's journey through a land of myths and legends.",
    poster: "/img/covers/cover17.jpg",
    rating: 9.9,
    first_air_date: "2023-06-01",
    categories: [categories[0]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "slade-winger-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "Runaway Killer",
            slug: "slade-winger-s1e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/jolly/s1e1.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Rain Man",
    slug: "rain-man",
    description: "A thrilling saga of survival and hope in a post-apocalyptic world.",
    poster: "/img/covers/cover18.jpg",
    rating: 9.9,
    first_air_date: "2023-06-01",
    categories: [categories[0]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "rain-man-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "Runaway Killer",
            slug: "rain-man-s1e1",
            runtime: 48,
            source_type: "upload",
            video_file: "/videos/jolly/s1e1.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Quantum Leap",
    slug: "quantum-leap",
    description: "A scientist travels through time, leaping into the lives of others to correct history's mistakes.",
    poster: "/img/covers/cover1.jpg",
    rating: 8.5,
    first_air_date: "2024-03-10",
    categories: [categories[0]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "quantum-leap-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "The First Jump",
            slug: "quantum-leap-s1e1",
            runtime: 45,
            source_type: "upload",
            video_file: "/videos/quantum/s1e1.mp4",
            thumbnail: "/img/covers/cover1.jpg"
          },
        ]
      }
    ]
  },
  {
    id: 8,
    title: "The Last Kingdom",
    slug: "the-last-kingdom",
    description: "A young Saxon nobleman is raised by Vikings and must choose between his birthright and the people who raised him.",
    poster: "/img/covers/cover14.jpg",
    rating: 9.1,
    first_air_date: "2023-11-05",
    categories: [categories[2]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "the-last-kingdom-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "Destiny is All",
            slug: "the-last-kingdom-s1e1",
            runtime: 52,
            source_type: "upload",
            video_file: "/videos/kingdom/s1e1.mp4",
            thumbnail: "/img/covers/cover14.jpg"
          }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Shadow and Bone",
    slug: "shadow-and-bone",
    description: "Sinister forces plot against a young soldier when she reveals a magical power that might unite her world.",
    poster: "/img/covers/cover15.jpg",
    rating: 8.2,
    first_air_date: "2023-04-21",
    categories: [categories[0], categories[3]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "shadow-bone-season-1",
        episodes: [
          {
            id: 1,
            episode_number: 1,
            title: "Aftermath",
            slug: "shadow-bone-s1e1",
            runtime: 50,
            source_type: "upload",
            video_file: "/videos/shadow/s1e1.mp4",
            thumbnail: "/img/covers/cover15.jpg"
          }
        ]
      }
    ]
  }
];
