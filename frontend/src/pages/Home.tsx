import HeroCarousel from "../components/HeroCarousel"
import MovieRail from "../components/MovieRail"

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

const Home = () => {
  return (
    <>
      <HeroCarousel />

      <MovieRail title="Trending Now" movies={mockMovies} />
      <MovieRail title="Popular Movies" movies={mockMovies} />
    </>
  )
}

export default Home
