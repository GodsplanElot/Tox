import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard/MovieCard";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdResponsiveBanner from "../components/ads/AdResponsiveBanner";
import AdSlot from "../components/ads/AdSlot";
import { api } from "../services/api";
import type { Movie, PaginatedResponse } from "../services/api";
import "./Movies.css";

const PAGE_SIZE = 50;

const emptyPage: PaginatedResponse<Movie> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || "1");
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const [moviePage, setMoviePage] = useState<PaginatedResponse<Movie>>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.getMoviesPage(currentPage, PAGE_SIZE);
        if (!cancelled) setMoviePage(response);
      } catch (loadError) {
        if (!cancelled) {
          setMoviePage(emptyPage);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load movies right now.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [currentPage, retryKey]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(moviePage.count / PAGE_SIZE));
  }, [moviePage.count]);

  const goToPage = (page: number) => {
    setSearchParams(page <= 1 ? {} : { page: String(page) });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Movies could not load"
        message={error}
        actionText="Try again"
        onAction={() => setRetryKey((value) => value + 1)}
      />
    );
  }

  if (moviePage.results.length === 0) {
    return (
      <EmptyState
        title="No movies available"
        message="Published movies will appear here once they are approved."
      />
    );
  }

  return (
    <section className="movies-page">
      <header className="movies-page__hero">
        <span>Movie Library</span>
        <h1>All Movies</h1>
        <p>Browse every published movie in a stable grid, 50 titles per page.</p>
      </header>

      <AdResponsiveBanner />

      <div className="ad-supported-layout">
        <div className="ad-supported-layout__main">
          <div className="movies-page__summary">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <strong>{moviePage.count} published movies</strong>
          </div>

          <div className="movies-page__grid">
            {moviePage.results.map((movie, index) => (
              <Fragment key={movie.id}>
                {index === 16 && (
                  <div className="ad-grid-wide">
                    <AdSlot unit="300x250" />
                  </div>
                )}
                <MovieCard movie={movie} />
              </Fragment>
            ))}
          </div>

          <nav className="movies-pagination" aria-label="Movie pages">
            <button
              type="button"
              disabled={!moviePage.previous}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={!moviePage.next}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </nav>
        </div>

        <aside className="ad-side-rail" aria-label="Sponsored">
          <AdSlot unit="160x600" />
          <AdSlot unit="160x300" />
        </aside>
      </div>
    </section>
  );
};

export default Movies;
