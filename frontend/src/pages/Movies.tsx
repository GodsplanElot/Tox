import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard/MovieCard";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdResponsiveBanner from "../components/ads/AdResponsiveBanner";
import AdSlot from "../components/ads/AdSlot";
import AdLayout from "../components/ads/AdLayout";
import PageHeader from "../components/ui/PageHeader";
import { buttonClass } from "../components/ui/buttonClass";
import { api } from "../services/api";
import type { Movie, PaginatedResponse } from "../services/api";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
    <div className="animate-fade-in">
      <PageHeader
        kicker="Movie library"
        title="All movies"
        description={`${moviePage.count} published titles, ${PAGE_SIZE} per page.`}
      />

      <div className="page-x">
        <AdResponsiveBanner />

        <AdLayout>
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 lg:grid-cols-6">
            {moviePage.results.map((movie, index) => (
              <Fragment key={movie.id}>
                {index === 18 && (
                  <div className="col-span-full my-2">
                    <AdSlot unit="300x250" />
                  </div>
                )}
                <MovieCard movie={movie} />
              </Fragment>
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Movie pages" className="mt-12 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={!moviePage.previous}
                onClick={() => goToPage(currentPage - 1)}
                className={buttonClass("secondary")}
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="min-w-20 text-center text-[13px] font-semibold text-fg-muted tabular-nums">
                {currentPage} <span className="text-fg-subtle">of {totalPages}</span>
              </span>
              <button
                type="button"
                disabled={!moviePage.next}
                onClick={() => goToPage(currentPage + 1)}
                className={buttonClass("secondary")}
              >
                Next <FiChevronRight />
              </button>
            </nav>
          )}
        </AdLayout>
      </div>
    </div>
  );
};

export default Movies;
