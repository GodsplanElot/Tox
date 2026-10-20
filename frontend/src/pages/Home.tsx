import { useMemo, useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MovieRail from "../components/MovieRail/MovieRail";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import { api } from "../services/api";
import type { Movie } from "../types/movie";
import type { Series } from "../types/series";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import OfflineState from "../components/common/OfflineState";
import AdResponsiveBanner from "../components/ads/AdResponsiveBanner";
import AdSlot from "../components/ads/AdSlot";

const getDateTime = (value?: string) => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

// LCG-based seeded shuffle — stable per session, different every page load
const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const result = [...arr];
  let s = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    s = Math.imul(s, 1664525) + 1013904223;
    const j = (s >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  // New seed each page load; stable within a session so memos don't thrash
  const [rotationSeed] = useState(() => Math.floor(Math.random() * 0xffffffff));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadFailed(false);
        const [moviesData, seriesData] = await Promise.all([
          api.getMovies(),
          api.getSeries(),
        ]);
        setMovies(moviesData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendingMovies = useMemo(() => {
    // Sort by rating+recency to build the candidate pool, then shuffle for variety
    const pool = [...movies]
      .sort((a, b) => {
        const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingDelta !== 0) return ratingDelta;
        return getDateTime(b.release_date) - getDateTime(a.release_date);
      })
      .slice(0, 30);
    return seededShuffle(pool, rotationSeed);
  }, [movies, rotationSeed]);

  const popularMovies = useMemo(() => {
    // Top-rated pool shuffled so "Popular" shows different picks than "Trending"
    const pool = [...movies]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 30);
    return seededShuffle(pool, rotationSeed ^ 0xdeadbeef);
  }, [movies, rotationSeed]);

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
    const pool = [...series]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 15);
    return seededShuffle(pool, rotationSeed ^ 0xc0ffee);
  }, [series, rotationSeed]);

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

  if (loadFailed) {
    return <OfflineState />;
  }

  if (!hasContent) {
    return (
      <EmptyState
        title="No Movies or Series Found"
        message="Our library is currently empty. Check back later for the latest movies and series!"
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <HeroCarousel items={carouselItems} />

      <div className="relative z-10 -mt-6 lg:-mt-10">
        <SeriesRail kicker="Binge-worthy" title="Trending series" series={trendingSeries} />
        {trendingMovies.length > 0 && (
          <MovieRail kicker="Right now" title="Trending movies" href="/movies" movies={trendingMovies.slice(0, 18)} />
        )}
      </div>

      <div className="page-x">
        <AdResponsiveBanner className="mt-12" />
      </div>

      {popularMovies.length > 0 && <MovieRail title="Popular movies" href="/movies" movies={popularMovies.slice(0, 18)} />}

      <div className="page-x">
        <AdSlot unit="native" className="mt-12" label="Sponsored recommendations" />
      </div>

      {newReleases.length > 0 && <MovieRail title="New releases" href="/movies" movies={newReleases.slice(0, 18)} />}
      {topRatedMovies.length > 0 && (
        <MovieRail kicker="Most toxic" title="Top rated" href="/movies" movies={topRatedMovies.slice(0, 18)} />
      )}

      <div className="page-x">
        <AdSlot unit="468x60" className="mt-12" />
      </div>
    </div>
  );
};

export default Home;
