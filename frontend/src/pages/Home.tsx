import HeroCarousel from "../components/HeroCarousel"
import MovieRail from "../components/MovieRail"
import MovieGrid from "../components/MovieGrid/MovieGrid"
import type { Movie } from "../components/MovieCard/MovieCard"
const mockMovies = [
  {
    id: "1",
    title: "Endless Horizon",
    poster: "/img/covers/cover1.jpg",
    rating: 8.2,
  },
  {
    id: "2",
    title: "Dark Waters",
    poster: "/img/covers/cover2.jpg",
    rating: 7.9,
  },
  {
    id: "3",
    title: "Lost Signal",
    poster: "/img/covers/cover3.jpg",
    rating: 8.5,
  },
  {
    id: "4",
    title: "Neon City",
    poster: "/img/covers/cover4.jpg",
    rating: 7.4,
  },
]

const moviesFromDb: Movie[] = [
  {
    id: 101,
    title: "Mystic Falls",
    poster: "/img/covers/cover5.jpg",
    rating: 8.1,
  },
  {
    id: 101,
    title: "Mystic Falls",
    poster: "/img/covers/cover1.jpg",
    rating: 8.1,
  },
  {
    id: 102,
    title: "Mystic Falls",
    poster: "/img/covers/cover2.jpg",
    rating: 8.1,
  },
  {
    id: 103,
    title: "Mystic Falls",
    poster: "/img/covers/cover3.jpg",
    rating: 8.1,
  },
  {
    id: 104,
    title: "Mystic Falls",
    poster: "/img/covers/cover4.jpg",
    rating: 8.1,
  },
  {
    id: 105,
    title: "Mystic Falls",
    poster: "/img/covers/cover5.jpg",
    rating: 8.1,
  },
  {
    id: 106,
    title: "Mystic Falls",
    poster: "/img/covers/cover6.jpg",
    rating: 8.1,
  },
  {
    id: 107,
    title: "Mystic Falls",
    poster: "/img/covers/cover8.jpg",
    rating: 8.1,
  },
] 

const Home = () => {
  return (
    <>
      <HeroCarousel />

      <MovieRail title="Trending Now" movies={mockMovies} />
      <MovieRail title="Popular Movies" movies={mockMovies} />
      {/* <MovieGrid title="All Movies" movies={moviesFromDb} /> */}

    </>
  )
}

export default Home
