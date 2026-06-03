import { useMemo, useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MovieRail from "../components/MovieRail/MovieRail";
import { api } from "../services/api";
import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

const getDateTime = (value?: string) => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

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

  const trendingMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDelta !== 0) return ratingDelta;
      return getDateTime(b.release_date) - getDateTime(a.release_date);
    });
  }, [movies]);

  const popularMovies = useMemo(() => {
    return [...movies].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [movies]);

  const newReleases = useMemo(() => {
    return [...movies].sort((a, b) => {
      return getDateTime(b.release_date) - getDateTime(a.release_date);
    });
  }, [movies]);

  const topRatedMovies = useMemo(() => {
    return [...movies]
      .filter((movie) => movie.rating !== undefined && movie.rating !== null)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [movies]);

  const trendingSeries = useMemo(() => {
    return [...series].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [series]);

  const carouselItems = useMemo(() => {
    const movieItems = trendingMovies.slice(0, 3).map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      poster: movie.hero_image || movie.poster,
      link: `/movies/${movie.slug}`,
      rating: movie.rating,
      categories: movie.categories,
    }));

    const seriesItems = trendingSeries.slice(0, 2).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      poster: item.hero_image || item.poster,
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
        <MovieRail title="Trending Now" movies={trendingMovies.slice(0, 18)} />
      )}
      {popularMovies.length > 0 && (
        <MovieRail title="Popular Movies" movies={popularMovies.slice(0, 18)} />
      )}
      {newReleases.length > 0 && (
        <MovieRail title="New Releases" movies={newReleases.slice(0, 18)} />
      )}
      {topRatedMovies.length > 0 && (
        <MovieRail title="Top Rated" movies={topRatedMovies.slice(0, 18)} />
      )}
    </>
  );
};

export default Home;
