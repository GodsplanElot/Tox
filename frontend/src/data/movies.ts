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
    runtime: 125,
    genres: ["Action", "Sci-Fi"],
    description: "In a sprawling metropolis bathed in neon lights, a renegade detective uncovers a conspiracy that threatens to unravel the fabric of society.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer"
  },


  /* 
   id: number;
  title: string;
  poster: string;
  year?: string;
  rating?: number;
  releaseDate?: string; // ISO string for sorting
  categoryIds: number[]; // <-- key for filtering
  backdrop?: string
  runtime?: number
  genres?: string[]
  description?: string
  trailer?: string
  */
];

/* ================= MOCK DB GRID DATA ================= */
export const moviesFromDb: Movie[] = [
  {
    id: 101,
    title: "Neon City",
    poster: "/img/covers/cover1.jpg",
    rating: 8.3,
    releaseDate: "2024-01-12",
    categoryIds: [1],
    runtime: 125,
    genres: ["Action", "Sci-Fi"],
    description: "In a sprawling metropolis bathed in neon lights, a renegade detective uncovers a conspiracy that threatens to unravel the fabric of society.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
  },
  {
    id: 100,
    title: "Endless Horizon",
    poster: "/img/covers/cover2.jpg",
    rating: 8.2,
    releaseDate: "2024-01-12",
    categoryIds: [1],
    runtime: 125,
    genres: ["Action", "Sci-Fi"],
    description: "Endless Horizon is a thrilling action-adventure film that follows a group of survivors as they navigate a post-apocalyptic world filled with danger and uncertainty.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
  },
  {
    id: 102,
    title: "Broken Silence",
    poster: "/img/covers/cover2.jpg",
    rating: 7.6,
    releaseDate: "2022-08-03",
    categoryIds: [2],
    runtime: 125,
    genres: ["Action", "porn"],
    description: "The story of a mute artist who finds his voice through a series of extraordinary events that challenge his perception of reality.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
  },
  {
    id: 103,
    title: "Laugh Riot",
    poster: "/img/covers/cover3.jpg",
    rating: 7.9,
    releaseDate: "2023-06-21",
    categoryIds: [3],
    runtime: 95,
    genres: ["Comedy"],
    description: "A group of misfit friends embark on a hilarious road trip that tests their friendship and leads to unexpected adventures.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
  },
  {
    id: 104,
    title: "Riot 2",
    poster: "/img/covers/cover4.jpg",
    rating: 7.9,
    releaseDate: "2023-06-21",
    categoryIds: [3],
    runtime: 100,
    genres: ["action", "comedy"],
    description: "Things go badly when the government tires to control the comedy industry.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30
  }
  },
  {
    id: 105,
    title: "Mystic Falls",
    poster: "/img/covers/cover4.jpg",
    rating: 8.1,
    releaseDate: "2023-06-21",
    categoryIds: [3],
    runtime: 110,
    genres: ["Drama", "Mystery"],
    description: "In a small town shrouded in secrets, a young detective uncovers dark truths that have been buried for decades.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30
  }
  },
  {
    id: 106,
    title: "Shadow Realm",
    poster: "/img/covers/cover7.jpg",
    rating: 7.9,
    releaseDate: "2023-06-21",
    categoryIds: [4],
    runtime: 130,
    genres: ["Thriller", "drama"],
    description: "Trapped between reality and a parallel dimension, a scientist must navigate a web of intrigue to save her loved ones.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 107,
    title: "Justice League",
    poster: "/img/covers/cover8.jpg",
    rating: 8.9,
    releaseDate: "2022-06-21",
    categoryIds: [1],
    runtime: 230,
    genres: ["Action", "drama"],
    description: "Trapped between reality and a parallel dimension, a scientist must navigate a web of intrigue to save her loved ones.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",
    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 108,
    title: "Black waters",
    poster: "/img/covers/cover9.jpg",
    rating: 9.0,
    releaseDate: "2021-03-31",
    categoryIds: [5],
    runtime: 80,
    genres: ["Horror", "drama"],
    description: "Trapped between reality and a parallel dimension, a scientist must navigate a web of intrigue to save her loved ones.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 109,
    title: "Gunmetal skies",
    poster: "/img/covers/cover10.jpg",
    rating: 7.0,
    releaseDate: "2021-03-31",
    categoryIds: [1],
    runtime: 180,
    genres: ["Action", "comedy"],
    description: "Trapped between reality and a parallel dimension, a scientist must navigate a web of intrigue to save her loved ones.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 110,
    title: "Throne of lies",
    poster: "/img/covers/cover11.jpg",
    rating: 8.0,
    releaseDate: "2022-03-31",
    categoryIds: [2],
    runtime: 110,
    genres: ["Drama", "comedy"],
    description: "The battle for the throne intensifies as alliances are forged and broken in a kingdom rife with deception and ambition.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 111,
    title: "battle for lies",
    poster: "/img/covers/cover11.jpg",
    rating: 9.0,
    releaseDate: "2021-03-31",
    categoryIds: [2],
    runtime: 110,
    genres: ["Drama", "comedy"],
    description: "The battle for the throne intensifies as alliances are forged and broken in a kingdom rife with deception and ambition.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 112,
    title: "Number Fight",
    poster: "/img/covers/cover12.jpg",
    rating: 6.0,
    releaseDate: "2024-03-31",
    categoryIds: [1],
    runtime: 110,
    genres: ["Action", "Thriller"],
    description: "In a dystopian future where numbers dictate social status, a rebellious mathematician challenges the system to ignite a revolution.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",
    downloadUrl: "/downloads/inception.mp4",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 113,
    title: "Number Fight 2",
    poster: "/img/covers/cover13.jpg",
    rating: 7.0,
    releaseDate: "2024-03-31",
    categoryIds: [1],
    runtime: 120,
    genres: ["Action", "Thriller"],
    description: "A very funny movie about numbers in action.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",
    downloadUrl: "/downloads/inception.mp4",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 114,
    title: "Dead Silent",
    poster: "/img/covers/cover14.jpg",
    rating: 9.0,
    releaseDate: "2023-03-31",
    categoryIds: [2],
    runtime: 160,
    genres: ["Action", "horror"],
    description: "In a world where silence is survival, a deaf protagonist must navigate a city overrun by sound-sensitive creatures to find safety.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",
    downloadUrl: "/downloads/inception.mp4",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 115,
    title: "Killer Bean",
    poster: "/img/covers/cover15.jpg",
    rating: 7.0,
    releaseDate: "2025-03-31",
    categoryIds: [2],
    runtime: 180,
    genres: ["Thriller", "Comedy"],
    description: "An elite assassin who happens to be a coffee bean takes on a mission that could change the fate of the coffee world.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",
    downloadUrl: "/downloads/inception.mp4",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  {
    id: 116,
    title: "Man Eater",
    poster: "/img/covers/cover17.jpg",
    rating: 10.0,
    releaseDate: "2025-03-31",
    categoryIds: [3],
    runtime: 110,
    genres: ["Action", "Horror"],
    description: "A thrilling tale of survival as a group of friends face off against a man-eating creature in the wilderness.",
    trailer: "https://www.youtube.com/watch?v=neoncitytrailer",
    downloadUrl: "/downloads/inception.mp4",

    video: {
    src: "/videos/dawn-mini.mp4",
    poster: "/images/dawn-video-poster.jpg",
    duration: 30}
    
  },
  
];
