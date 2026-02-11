import { useMemo } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";

const Home = () => {
  // Trending: Newest movies first
  const trendingMovies = useMemo(() => {
    return [...moviesFromDb].sort((a, b) => {
      const dateA = new Date(a.release_date ?? "").getTime();
      const dateB = new Date(b.release_date ?? "").getTime();
      return dateB - dateA;
    });
  }, []);

  // Popular: Highest rating first
  const popularMovies = useMemo(() => {
    return [...moviesFromDb].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, []);

  // Trending Series: Highest rating first
  const trendingSeries = useMemo(() => {
    return [...seriesFromDb].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, []);

  return (
    <>
      <HeroCarousel />

      <MovieRail title="Trending Now" movies={trendingMovies} />
      <SeriesRail title="Trending Series" series={trendingSeries} />
      <MovieRail title="Popular Movies" movies={popularMovies} />

      <MovieGrid title="All Movies" movies={moviesFromDb} />
    </>
  );
};

export default Home;
