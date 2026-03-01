import { useMemo, useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import { api } from "../services/api";
import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, seriesData] = await Promise.all([
          api.getMovies(),
          api.getSeries(),
        ]);
        setMovies(moviesData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trending: Newest movies first
  const trendingMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      const dateA = new Date(a.release_date ?? "").getTime();
      const dateB = new Date(b.release_date ?? "").getTime();
      return dateB - dateA;
    });
  }, [movies]);

  // Popular: Highest rating first
  const popularMovies = useMemo(() => {
    return [...movies].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [movies]);

  // Trending Series: Highest rating first
  const trendingSeries = useMemo(() => {
    return [...series].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [series]);

  // Combining top movies and series for the Hero Carousel
  const carouselItems = useMemo(() => {
    const movieItems = trendingMovies.slice(0, 3).map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      poster: movie.poster,
      link: `/movies/${movie.slug}`,
      rating: movie.rating,
      categories: movie.categories,
    }));

    const seriesItems = trendingSeries.slice(0, 2).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      poster: item.poster,
      link: `/series/${item.slug}`,
      rating: item.rating,
      categories: item.categories,
    }));

    return [...movieItems, ...seriesItems].sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    );
  }, [trendingMovies, trendingSeries]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasContent = movies.length > 0 || series.length > 0;

  if (!hasContent) {
    return (
      <EmptyState
        title="No Movies or Series Found"
        message="Our library is currently empty. Check back later for the latest movies and series!"
      />
    );
  }

  return (
    <>
      <HeroCarousel items={carouselItems} />

      {trendingMovies.length > 0 && (
        <MovieRail title="Trending Now" movies={trendingMovies} />
      )}
      {trendingSeries.length > 0 && (
        <SeriesRail title="Trending Series" series={trendingSeries} />
      )}
      {popularMovies.length > 0 && (
        <MovieRail title="Popular Movies" movies={popularMovies} />
      )}

      {movies.length > 0 && <MovieGrid title="All Movies" movies={movies} />}
    </>
  );
};

export default Home;
