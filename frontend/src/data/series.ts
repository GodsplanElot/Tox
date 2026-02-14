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
  },
  {
    id: 10,
    title: "Crimson Empire",
    slug: "crimson-empire",
    description: "In a world where blood determines power, a commoner discovers they have royal blood and must navigate deadly court politics.",
    poster: "/img/covers/cover2.jpg",
    rating: 9.3,
    first_air_date: "2024-01-15",
    categories: [categories[1], categories[2]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "crimson-empire-season-1",
        episodes: [
          { id: 1, episode_number: 1, title: "The Awakening", slug: "crimson-empire-s1e1", runtime: 52, source_type: "upload", video_file: "/videos/crimson/s1e1.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 2, episode_number: 2, title: "First Blood", slug: "crimson-empire-s1e2", runtime: 48, source_type: "upload", video_file: "/videos/crimson/s1e2.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 3, episode_number: 3, title: "The Court", slug: "crimson-empire-s1e3", runtime: 50, source_type: "upload", video_file: "/videos/crimson/s1e3.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 4, episode_number: 4, title: "Betrayal", slug: "crimson-empire-s1e4", runtime: 51, source_type: "upload", video_file: "/videos/crimson/s1e4.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 5, episode_number: 5, title: "The Coronation", slug: "crimson-empire-s1e5", runtime: 55, source_type: "upload", video_file: "/videos/crimson/s1e5.mp4", thumbnail: "/img/covers/cover2.jpg" }
        ]
      },
      {
        id: 2,
        season_number: 2,
        slug: "crimson-empire-season-2",
        episodes: [
          { id: 6, episode_number: 1, title: "New Alliances", slug: "crimson-empire-s2e1", runtime: 49, source_type: "upload", video_file: "/videos/crimson/s2e1.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 7, episode_number: 2, title: "The Rebellion", slug: "crimson-empire-s2e2", runtime: 52, source_type: "upload", video_file: "/videos/crimson/s2e2.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 8, episode_number: 3, title: "War Council", slug: "crimson-empire-s2e3", runtime: 48, source_type: "upload", video_file: "/videos/crimson/s2e3.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 9, episode_number: 4, title: "The Battle", slug: "crimson-empire-s2e4", runtime: 54, source_type: "upload", video_file: "/videos/crimson/s2e4.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 10, episode_number: 5, title: "Victory and Loss", slug: "crimson-empire-s2e5", runtime: 50, source_type: "upload", video_file: "/videos/crimson/s2e5.mp4", thumbnail: "/img/covers/cover2.jpg" }
        ]
      },
      {
        id: 3,
        season_number: 3,
        slug: "crimson-empire-season-3",
        episodes: [
          { id: 11, episode_number: 1, title: "The Aftermath", slug: "crimson-empire-s3e1", runtime: 51, source_type: "upload", video_file: "/videos/crimson/s3e1.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 12, episode_number: 2, title: "Hidden Enemies", slug: "crimson-empire-s3e2", runtime: 49, source_type: "upload", video_file: "/videos/crimson/s3e2.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 13, episode_number: 3, title: "The Prophecy", slug: "crimson-empire-s3e3", runtime: 52, source_type: "upload", video_file: "/videos/crimson/s3e3.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 14, episode_number: 4, title: "Dark Magic", slug: "crimson-empire-s3e4", runtime: 50, source_type: "upload", video_file: "/videos/crimson/s3e4.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 15, episode_number: 5, title: "The Ritual", slug: "crimson-empire-s3e5", runtime: 53, source_type: "upload", video_file: "/videos/crimson/s3e5.mp4", thumbnail: "/img/covers/cover2.jpg" }
        ]
      },
      {
        id: 4,
        season_number: 4,
        slug: "crimson-empire-season-4",
        episodes: [
          { id: 16, episode_number: 1, title: "New Threats", slug: "crimson-empire-s4e1", runtime: 48, source_type: "upload", video_file: "/videos/crimson/s4e1.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 17, episode_number: 2, title: "The Invasion", slug: "crimson-empire-s4e2", runtime: 51, source_type: "upload", video_file: "/videos/crimson/s4e2.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 18, episode_number: 3, title: "Siege", slug: "crimson-empire-s4e3", runtime: 55, source_type: "upload", video_file: "/videos/crimson/s4e3.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 19, episode_number: 4, title: "The Last Stand", slug: "crimson-empire-s4e4", runtime: 52, source_type: "upload", video_file: "/videos/crimson/s4e4.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 20, episode_number: 5, title: "Redemption", slug: "crimson-empire-s4e5", runtime: 50, source_type: "upload", video_file: "/videos/crimson/s4e5.mp4", thumbnail: "/img/covers/cover2.jpg" }
        ]
      },
      {
        id: 5,
        season_number: 5,
        slug: "crimson-empire-season-5",
        episodes: [
          { id: 21, episode_number: 1, title: "The Final Chapter", slug: "crimson-empire-s5e1", runtime: 49, source_type: "upload", video_file: "/videos/crimson/s5e1.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 22, episode_number: 2, title: "Legacy", slug: "crimson-empire-s5e2", runtime: 51, source_type: "upload", video_file: "/videos/crimson/s5e2.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 23, episode_number: 3, title: "The Truth Revealed", slug: "crimson-empire-s5e3", runtime: 53, source_type: "upload", video_file: "/videos/crimson/s5e3.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 24, episode_number: 4, title: "Endgame", slug: "crimson-empire-s5e4", runtime: 54, source_type: "upload", video_file: "/videos/crimson/s5e4.mp4", thumbnail: "/img/covers/cover2.jpg" },
          { id: 25, episode_number: 5, title: "The Crown", slug: "crimson-empire-s5e5", runtime: 60, source_type: "upload", video_file: "/videos/crimson/s5e5.mp4", thumbnail: "/img/covers/cover2.jpg" }
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Neon Nights",
    slug: "neon-nights",
    description: "A cyberpunk thriller following a hacker collective fighting against a corrupt mega-corporation in a neon-lit dystopian city.",
    poster: "/img/covers/cover3.jpg",
    rating: 8.7,
    first_air_date: "2024-02-20",
    categories: [categories[0], categories[3]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "neon-nights-season-1",
        episodes: [
          { id: 1, episode_number: 1, title: "System Breach", slug: "neon-nights-s1e1", runtime: 45, source_type: "upload", video_file: "/videos/neon/s1e1.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 2, episode_number: 2, title: "Digital Ghost", slug: "neon-nights-s1e2", runtime: 47, source_type: "upload", video_file: "/videos/neon/s1e2.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 3, episode_number: 3, title: "The Network", slug: "neon-nights-s1e3", runtime: 46, source_type: "upload", video_file: "/videos/neon/s1e3.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 4, episode_number: 4, title: "Corporate Secrets", slug: "neon-nights-s1e4", runtime: 48, source_type: "upload", video_file: "/videos/neon/s1e4.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 5, episode_number: 5, title: "Zero Day", slug: "neon-nights-s1e5", runtime: 50, source_type: "upload", video_file: "/videos/neon/s1e5.mp4", thumbnail: "/img/covers/cover3.jpg" }
        ]
      },
      {
        id: 2,
        season_number: 2,
        slug: "neon-nights-season-2",
        episodes: [
          { id: 6, episode_number: 1, title: "Reboot", slug: "neon-nights-s2e1", runtime: 46, source_type: "upload", video_file: "/videos/neon/s2e1.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 7, episode_number: 2, title: "The Virus", slug: "neon-nights-s2e2", runtime: 48, source_type: "upload", video_file: "/videos/neon/s2e2.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 8, episode_number: 3, title: "Firewall", slug: "neon-nights-s2e3", runtime: 45, source_type: "upload", video_file: "/videos/neon/s2e3.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 9, episode_number: 4, title: "Encrypted", slug: "neon-nights-s2e4", runtime: 49, source_type: "upload", video_file: "/videos/neon/s2e4.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 10, episode_number: 5, title: "Mainframe", slug: "neon-nights-s2e5", runtime: 47, source_type: "upload", video_file: "/videos/neon/s2e5.mp4", thumbnail: "/img/covers/cover3.jpg" }
        ]
      },
      {
        id: 3,
        season_number: 3,
        slug: "neon-nights-season-3",
        episodes: [
          { id: 11, episode_number: 1, title: "Upgrade", slug: "neon-nights-s3e1", runtime: 48, source_type: "upload", video_file: "/videos/neon/s3e1.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 12, episode_number: 2, title: "Neural Link", slug: "neon-nights-s3e2", runtime: 46, source_type: "upload", video_file: "/videos/neon/s3e2.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 13, episode_number: 3, title: "AI Uprising", slug: "neon-nights-s3e3", runtime: 50, source_type: "upload", video_file: "/videos/neon/s3e3.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 14, episode_number: 4, title: "Quantum Leap", slug: "neon-nights-s3e4", runtime: 47, source_type: "upload", video_file: "/videos/neon/s3e4.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 15, episode_number: 5, title: "The Singularity", slug: "neon-nights-s3e5", runtime: 49, source_type: "upload", video_file: "/videos/neon/s3e5.mp4", thumbnail: "/img/covers/cover3.jpg" }
        ]
      },
      {
        id: 4,
        season_number: 4,
        slug: "neon-nights-season-4",
        episodes: [
          { id: 16, episode_number: 1, title: "New World Order", slug: "neon-nights-s4e1", runtime: 45, source_type: "upload", video_file: "/videos/neon/s4e1.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 17, episode_number: 2, title: "Resistance", slug: "neon-nights-s4e2", runtime: 48, source_type: "upload", video_file: "/videos/neon/s4e2.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 18, episode_number: 3, title: "Underground", slug: "neon-nights-s4e3", runtime: 46, source_type: "upload", video_file: "/videos/neon/s4e3.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 19, episode_number: 4, title: "Revolution", slug: "neon-nights-s4e4", runtime: 50, source_type: "upload", video_file: "/videos/neon/s4e4.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 20, episode_number: 5, title: "Liberation", slug: "neon-nights-s4e5", runtime: 47, source_type: "upload", video_file: "/videos/neon/s4e5.mp4", thumbnail: "/img/covers/cover3.jpg" }
        ]
      },
      {
        id: 5,
        season_number: 5,
        slug: "neon-nights-season-5",
        episodes: [
          { id: 21, episode_number: 1, title: "Aftermath", slug: "neon-nights-s5e1", runtime: 46, source_type: "upload", video_file: "/videos/neon/s5e1.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 22, episode_number: 2, title: "Rebuilding", slug: "neon-nights-s5e2", runtime: 48, source_type: "upload", video_file: "/videos/neon/s5e2.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 23, episode_number: 3, title: "New Dawn", slug: "neon-nights-s5e3", runtime: 45, source_type: "upload", video_file: "/videos/neon/s5e3.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 24, episode_number: 4, title: "Final Protocol", slug: "neon-nights-s5e4", runtime: 49, source_type: "upload", video_file: "/videos/neon/s5e4.mp4", thumbnail: "/img/covers/cover3.jpg" },
          { id: 25, episode_number: 5, title: "Shutdown", slug: "neon-nights-s5e5", runtime: 52, source_type: "upload", video_file: "/videos/neon/s5e5.mp4", thumbnail: "/img/covers/cover3.jpg" }
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Stellar Odyssey",
    slug: "stellar-odyssey",
    description: "A space exploration epic following the crew of the starship Odyssey as they venture into uncharted regions of the galaxy.",
    poster: "/img/covers/cover4.jpg",
    rating: 9.0,
    first_air_date: "2024-03-10",
    categories: [categories[0], categories[4]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "stellar-odyssey-season-1",
        episodes: [
          { id: 1, episode_number: 1, title: "First Contact", slug: "stellar-odyssey-s1e1", runtime: 50, source_type: "upload", video_file: "/videos/stellar/s1e1.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 2, episode_number: 2, title: "The Void", slug: "stellar-odyssey-s1e2", runtime: 48, source_type: "upload", video_file: "/videos/stellar/s1e2.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 3, episode_number: 3, title: "Alien Worlds", slug: "stellar-odyssey-s1e3", runtime: 52, source_type: "upload", video_file: "/videos/stellar/s1e3.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 4, episode_number: 4, title: "Cosmic Storm", slug: "stellar-odyssey-s1e4", runtime: 49, source_type: "upload", video_file: "/videos/stellar/s1e4.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 5, episode_number: 5, title: "The Discovery", slug: "stellar-odyssey-s1e5", runtime: 51, source_type: "upload", video_file: "/videos/stellar/s1e5.mp4", thumbnail: "/img/covers/cover4.jpg" }
        ]
      },
      {
        id: 2,
        season_number: 2,
        slug: "stellar-odyssey-season-2",
        episodes: [
          { id: 6, episode_number: 1, title: "New Horizons", slug: "stellar-odyssey-s2e1", runtime: 48, source_type: "upload", video_file: "/videos/stellar/s2e1.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 7, episode_number: 2, title: "The Nebula", slug: "stellar-odyssey-s2e2", runtime: 50, source_type: "upload", video_file: "/videos/stellar/s2e2.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 8, episode_number: 3, title: "Ancient Ruins", slug: "stellar-odyssey-s2e3", runtime: 49, source_type: "upload", video_file: "/videos/stellar/s2e3.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 9, episode_number: 4, title: "Wormhole", slug: "stellar-odyssey-s2e4", runtime: 51, source_type: "upload", video_file: "/videos/stellar/s2e4.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 10, episode_number: 5, title: "Parallel Universe", slug: "stellar-odyssey-s2e5", runtime: 52, source_type: "upload", video_file: "/videos/stellar/s2e5.mp4", thumbnail: "/img/covers/cover4.jpg" }
        ]
      },
      {
        id: 3,
        season_number: 3,
        slug: "stellar-odyssey-season-3",
        episodes: [
          { id: 11, episode_number: 1, title: "The Return", slug: "stellar-odyssey-s3e1", runtime: 50, source_type: "upload", video_file: "/videos/stellar/s3e1.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 12, episode_number: 2, title: "Galactic War", slug: "stellar-odyssey-s3e2", runtime: 48, source_type: "upload", video_file: "/videos/stellar/s3e2.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 13, episode_number: 3, title: "The Alliance", slug: "stellar-odyssey-s3e3", runtime: 51, source_type: "upload", video_file: "/videos/stellar/s3e3.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 14, episode_number: 4, title: "Dark Matter", slug: "stellar-odyssey-s3e4", runtime: 49, source_type: "upload", video_file: "/videos/stellar/s3e4.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 15, episode_number: 5, title: "The Artifact", slug: "stellar-odyssey-s3e5", runtime: 53, source_type: "upload", video_file: "/videos/stellar/s3e5.mp4", thumbnail: "/img/covers/cover4.jpg" }
        ]
      },
      {
        id: 4,
        season_number: 4,
        slug: "stellar-odyssey-season-4",
        episodes: [
          { id: 16, episode_number: 1, title: "Time Rift", slug: "stellar-odyssey-s4e1", runtime: 48, source_type: "upload", video_file: "/videos/stellar/s4e1.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 17, episode_number: 2, title: "Temporal Paradox", slug: "stellar-odyssey-s4e2", runtime: 50, source_type: "upload", video_file: "/videos/stellar/s4e2.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 18, episode_number: 3, title: "The Prophecy", slug: "stellar-odyssey-s4e3", runtime: 49, source_type: "upload", video_file: "/videos/stellar/s4e3.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 19, episode_number: 4, title: "Final Frontier", slug: "stellar-odyssey-s4e4", runtime: 52, source_type: "upload", video_file: "/videos/stellar/s4e4.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 20, episode_number: 5, title: "Homecoming", slug: "stellar-odyssey-s4e5", runtime: 51, source_type: "upload", video_file: "/videos/stellar/s4e5.mp4", thumbnail: "/img/covers/cover4.jpg" }
        ]
      },
      {
        id: 5,
        season_number: 5,
        slug: "stellar-odyssey-season-5",
        episodes: [
          { id: 21, episode_number: 1, title: "New Mission", slug: "stellar-odyssey-s5e1", runtime: 49, source_type: "upload", video_file: "/videos/stellar/s5e1.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 22, episode_number: 2, title: "The Guardians", slug: "stellar-odyssey-s5e2", runtime: 51, source_type: "upload", video_file: "/videos/stellar/s5e2.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 23, episode_number: 3, title: "Universal Truth", slug: "stellar-odyssey-s5e3", runtime: 50, source_type: "upload", video_file: "/videos/stellar/s5e3.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 24, episode_number: 4, title: "The End of All Things", slug: "stellar-odyssey-s5e4", runtime: 52, source_type: "upload", video_file: "/videos/stellar/s5e4.mp4", thumbnail: "/img/covers/cover4.jpg" },
          { id: 25, episode_number: 5, title: "Eternal Journey", slug: "stellar-odyssey-s5e5", runtime: 55, source_type: "upload", video_file: "/videos/stellar/s5e5.mp4", thumbnail: "/img/covers/cover4.jpg" }
        ]
      }
    ]
  },
  {
    id: 13,
    title: "The Forgotten Realm",
    slug: "the-forgotten-realm",
    description: "An epic fantasy saga about a group of heroes who must restore balance to a world where magic is fading and ancient evils are awakening.",
    poster: "/img/covers/cover5.jpg",
    rating: 8.9,
    first_air_date: "2024-04-05",
    categories: [categories[1], categories[5]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "forgotten-realm-season-1",
        episodes: [
          { id: 1, episode_number: 1, title: "The Calling", slug: "forgotten-realm-s1e1", runtime: 54, source_type: "upload", video_file: "/videos/realm/s1e1.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 2, episode_number: 2, title: "The Quest Begins", slug: "forgotten-realm-s1e2", runtime: 52, source_type: "upload", video_file: "/videos/realm/s1e2.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 3, episode_number: 3, title: "The Dark Forest", slug: "forgotten-realm-s1e3", runtime: 50, source_type: "upload", video_file: "/videos/realm/s1e3.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 4, episode_number: 4, title: "The Dragon's Lair", slug: "forgotten-realm-s1e4", runtime: 53, source_type: "upload", video_file: "/videos/realm/s1e4.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 5, episode_number: 5, title: "The First Trial", slug: "forgotten-realm-s1e5", runtime: 51, source_type: "upload", video_file: "/videos/realm/s1e5.mp4", thumbnail: "/img/covers/cover5.jpg" }
        ]
      },
      {
        id: 2,
        season_number: 2,
        slug: "forgotten-realm-season-2",
        episodes: [
          { id: 6, episode_number: 1, title: "The Wizard's Tower", slug: "forgotten-realm-s2e1", runtime: 52, source_type: "upload", video_file: "/videos/realm/s2e1.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 7, episode_number: 2, title: "Ancient Secrets", slug: "forgotten-realm-s2e2", runtime: 50, source_type: "upload", video_file: "/videos/realm/s2e2.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 8, episode_number: 3, title: "The Betrayal", slug: "forgotten-realm-s2e3", runtime: 54, source_type: "upload", video_file: "/videos/realm/s2e3.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 9, episode_number: 4, title: "The Shadow King", slug: "forgotten-realm-s2e4", runtime: 51, source_type: "upload", video_file: "/videos/realm/s2e4.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 10, episode_number: 5, title: "The Siege", slug: "forgotten-realm-s2e5", runtime: 55, source_type: "upload", video_file: "/videos/realm/s2e5.mp4", thumbnail: "/img/covers/cover5.jpg" }
        ]
      },
      {
        id: 3,
        season_number: 3,
        slug: "forgotten-realm-season-3",
        episodes: [
          { id: 11, episode_number: 1, title: "The Fallen Kingdom", slug: "forgotten-realm-s3e1", runtime: 53, source_type: "upload", video_file: "/videos/realm/s3e1.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 12, episode_number: 2, title: "The Prophecy Unfolds", slug: "forgotten-realm-s3e2", runtime: 51, source_type: "upload", video_file: "/videos/realm/s3e2.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 13, episode_number: 3, title: "The Sacred Sword", slug: "forgotten-realm-s3e3", runtime: 52, source_type: "upload", video_file: "/videos/realm/s3e3.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 14, episode_number: 4, title: "The Battle of Ages", slug: "forgotten-realm-s3e4", runtime: 56, source_type: "upload", video_file: "/videos/realm/s3e4.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 15, episode_number: 5, title: "The Resurrection", slug: "forgotten-realm-s3e5", runtime: 54, source_type: "upload", video_file: "/videos/realm/s3e5.mp4", thumbnail: "/img/covers/cover5.jpg" }
        ]
      },
      {
        id: 4,
        season_number: 4,
        slug: "forgotten-realm-season-4",
        episodes: [
          { id: 16, episode_number: 1, title: "The New Order", slug: "forgotten-realm-s4e1", runtime: 50, source_type: "upload", video_file: "/videos/realm/s4e1.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 17, episode_number: 2, title: "The Magic Returns", slug: "forgotten-realm-s4e2", runtime: 52, source_type: "upload", video_file: "/videos/realm/s4e2.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 18, episode_number: 3, title: "The Demon Lord", slug: "forgotten-realm-s4e3", runtime: 54, source_type: "upload", video_file: "/videos/realm/s4e3.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 19, episode_number: 4, title: "The Final Sacrifice", slug: "forgotten-realm-s4e4", runtime: 53, source_type: "upload", video_file: "/videos/realm/s4e4.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 20, episode_number: 5, title: "The Reckoning", slug: "forgotten-realm-s4e5", runtime: 55, source_type: "upload", video_file: "/videos/realm/s4e5.mp4", thumbnail: "/img/covers/cover5.jpg" }
        ]
      },
      {
        id: 5,
        season_number: 5,
        slug: "forgotten-realm-season-5",
        episodes: [
          { id: 21, episode_number: 1, title: "The Aftermath", slug: "forgotten-realm-s5e1", runtime: 51, source_type: "upload", video_file: "/videos/realm/s5e1.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 22, episode_number: 2, title: "The New Age", slug: "forgotten-realm-s5e2", runtime: 52, source_type: "upload", video_file: "/videos/realm/s5e2.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 23, episode_number: 3, title: "The Last Guardian", slug: "forgotten-realm-s5e3", runtime: 54, source_type: "upload", video_file: "/videos/realm/s5e3.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 24, episode_number: 4, title: "The Ultimate Power", slug: "forgotten-realm-s5e4", runtime: 53, source_type: "upload", video_file: "/videos/realm/s5e4.mp4", thumbnail: "/img/covers/cover5.jpg" },
          { id: 25, episode_number: 5, title: "The Eternal Legacy", slug: "forgotten-realm-s5e5", runtime: 58, source_type: "upload", video_file: "/videos/realm/s5e5.mp4", thumbnail: "/img/covers/cover5.jpg" }
        ]
      }
    ]
  },
  {
    id: 14,
    title: "Urban Legends",
    slug: "urban-legends",
    description: "A supernatural mystery series where each season explores different urban legends that turn out to be terrifyingly real.",
    poster: "/img/covers/cover6.jpg",
    rating: 8.4,
    first_air_date: "2024-05-12",
    categories: [categories[3], categories[5]],
    seasons: [
      {
        id: 1,
        season_number: 1,
        slug: "urban-legends-season-1",
        episodes: [
          { id: 1, episode_number: 1, title: "The Vanishing Hitchhiker", slug: "urban-legends-s1e1", runtime: 44, source_type: "upload", video_file: "/videos/legends/s1e1.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 2, episode_number: 2, title: "The Hook Man", slug: "urban-legends-s1e2", runtime: 46, source_type: "upload", video_file: "/videos/legends/s1e2.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 3, episode_number: 3, title: "Bloody Mary", slug: "urban-legends-s1e3", runtime: 45, source_type: "upload", video_file: "/videos/legends/s1e3.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 4, episode_number: 4, title: "The Slender Man", slug: "urban-legends-s1e4", runtime: 47, source_type: "upload", video_file: "/videos/legends/s1e4.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 5, episode_number: 5, title: "The Black-Eyed Children", slug: "urban-legends-s1e5", runtime: 48, source_type: "upload", video_file: "/videos/legends/s1e5.mp4", thumbnail: "/img/covers/cover6.jpg" }
        ]
      },
      {
        id: 2,
        season_number: 2,
        slug: "urban-legends-season-2",
        episodes: [
          { id: 6, episode_number: 1, title: "The Babysitter", slug: "urban-legends-s2e1", runtime: 45, source_type: "upload", video_file: "/videos/legends/s2e1.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 7, episode_number: 2, title: "The Killer in the Backseat", slug: "urban-legends-s2e2", runtime: 46, source_type: "upload", video_file: "/videos/legends/s2e2.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 8, episode_number: 3, title: "The Clown Statue", slug: "urban-legends-s2e3", runtime: 44, source_type: "upload", video_file: "/videos/legends/s2e3.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 9, episode_number: 4, title: "The Midnight Game", slug: "urban-legends-s2e4", runtime: 48, source_type: "upload", video_file: "/videos/legends/s2e4.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 10, episode_number: 5, title: "The Elevator Game", slug: "urban-legends-s2e5", runtime: 47, source_type: "upload", video_file: "/videos/legends/s2e5.mp4", thumbnail: "/img/covers/cover6.jpg" }
        ]
      },
      {
        id: 3,
        season_number: 3,
        slug: "urban-legends-season-3",
        episodes: [
          { id: 11, episode_number: 1, title: "The Rake", slug: "urban-legends-s3e1", runtime: 46, source_type: "upload", video_file: "/videos/legends/s3e1.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 12, episode_number: 2, title: "The Smiling Man", slug: "urban-legends-s3e2", runtime: 45, source_type: "upload", video_file: "/videos/legends/s3e2.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 13, episode_number: 3, title: "The Russian Sleep Experiment", slug: "urban-legends-s3e3", runtime: 48, source_type: "upload", video_file: "/videos/legends/s3e3.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 14, episode_number: 4, title: "The Expressionless", slug: "urban-legends-s3e4", runtime: 44, source_type: "upload", video_file: "/videos/legends/s3e4.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 15, episode_number: 5, title: "The Skin Walker", slug: "urban-legends-s3e5", runtime: 47, source_type: "upload", video_file: "/videos/legends/s3e5.mp4", thumbnail: "/img/covers/cover6.jpg" }
        ]
      },
      {
        id: 4,
        season_number: 4,
        slug: "urban-legends-season-4",
        episodes: [
          { id: 16, episode_number: 1, title: "The Goatman", slug: "urban-legends-s4e1", runtime: 45, source_type: "upload", video_file: "/videos/legends/s4e1.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 17, episode_number: 2, title: "The Bunny Man", slug: "urban-legends-s4e2", runtime: 46, source_type: "upload", video_file: "/videos/legends/s4e2.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 18, episode_number: 3, title: "The Jersey Devil", slug: "urban-legends-s4e3", runtime: 48, source_type: "upload", video_file: "/videos/legends/s4e3.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 19, episode_number: 4, title: "The Mothman", slug: "urban-legends-s4e4", runtime: 47, source_type: "upload", video_file: "/videos/legends/s4e4.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 20, episode_number: 5, title: "The Wendigo", slug: "urban-legends-s4e5", runtime: 49, source_type: "upload", video_file: "/videos/legends/s4e5.mp4", thumbnail: "/img/covers/cover6.jpg" }
        ]
      },
      {
        id: 5,
        season_number: 5,
        slug: "urban-legends-season-5",
        episodes: [
          { id: 21, episode_number: 1, title: "The Collective", slug: "urban-legends-s5e1", runtime: 46, source_type: "upload", video_file: "/videos/legends/s5e1.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 22, episode_number: 2, title: "The Truth Behind", slug: "urban-legends-s5e2", runtime: 47, source_type: "upload", video_file: "/videos/legends/s5e2.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 23, episode_number: 3, title: "The Final Legend", slug: "urban-legends-s5e3", runtime: 48, source_type: "upload", video_file: "/videos/legends/s5e3.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 24, episode_number: 4, title: "The Convergence", slug: "urban-legends-s5e4", runtime: 49, source_type: "upload", video_file: "/videos/legends/s5e4.mp4", thumbnail: "/img/covers/cover6.jpg" },
          { id: 25, episode_number: 5, title: "The End of Legends", slug: "urban-legends-s5e5", runtime: 52, source_type: "upload", video_file: "/videos/legends/s5e5.mp4", thumbnail: "/img/covers/cover6.jpg" }
        ]
      }
    ]
  }
];
