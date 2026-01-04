import HeroCarousel from "../components/HeroCarousel";
import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import { moviesFromDb } from "../data/movies";
import { mockMovies } from "../data/movies";
import type { Movie } from "../types/movie";




const Home = () => {
  return (
    <>
      <HeroCarousel />

      <MovieRail title="Trending Now" movies={mockMovies} />
      <MovieRail title="Popular Movies" movies={mockMovies} />

      <MovieGrid title="All Movies" movies={moviesFromDb} />
    </>
  );
};

export default Home;
