import HeroCarousel from "../components/HeroCarousel";
import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";

const Home = () => {
  return (
    <>
      <HeroCarousel />

      <MovieRail title="Trending Now" movies={moviesFromDb} />
      <SeriesRail title="Trending Series" series={seriesFromDb} />
      <MovieRail title="Popular Movies" movies={moviesFromDb} />

      <MovieGrid title="All Movies" movies={moviesFromDb} />
    </>
  );
};

export default Home;
