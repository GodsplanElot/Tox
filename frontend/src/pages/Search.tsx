import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { FiArrowRight, FiSearch } from "react-icons/fi";

import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import SearchSuggestions from "../components/SearchSuggestions";
import { api } from "../services/api";
import type { Movie, Series } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdResponsiveBanner from "../components/ads/AdResponsiveBanner";
import AdSlot from "../components/ads/AdSlot";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { useDismiss } from "../components/ui/useDismiss";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

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
        console.error("Error fetching search data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hideSuggestions = useCallback(() => setIsSuggestionsVisible(false), []);
  useDismiss(searchWrapperRef, isSuggestionsVisible, hideSuggestions);

  const movieResults = useMemo(() => {
    if (!initialQuery) return [];

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(initialQuery.toLowerCase()),
    );
  }, [initialQuery, movies]);

  const seriesResults = useMemo(() => {
    if (!initialQuery) return [];

    return series.filter((s) =>
      s.title.toLowerCase().includes(initialQuery.toLowerCase()),
    );
  }, [initialQuery, series]);

  const recommended = useMemo(() => movies.slice(0, 14), [movies]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const nextQuery = query.trim();
    if (nextQuery) {
      setParams({ q: nextQuery });
    } else {
      setParams({});
    }
    setIsSuggestionsVisible(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasResults = movieResults.length > 0 || seriesResults.length > 0;

  return (
    <div className="animate-fade-in">
      <PageHeader kicker="Search the vault" title="Find your next watch">
        <form onSubmit={onSearch} role="search" className="max-w-2xl">
          <div ref={searchWrapperRef} className="group relative">
            <FiSearch
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-fg-subtle transition group-focus-within:text-accent"
            />
            <input
              type="search"
              placeholder="Search movies or TV series…"
              value={query}
              autoFocus={!initialQuery}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSuggestionsVisible(true);
              }}
              onFocus={() => setIsSuggestionsVisible(true)}
              aria-label="Search movies or TV series"
              className="h-14 w-full rounded-2xl bg-white/[0.05] pr-16 pl-13 text-base text-white ring-1 ring-white/10 transition ring-inset placeholder:text-fg-subtle focus:bg-white/[0.07] focus:ring-accent/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-xl bg-accent text-ink-950 transition hover:bg-accent-strong active:scale-95"
            >
              <FiArrowRight className="size-5" />
            </button>
            <SearchSuggestions query={query} isVisible={isSuggestionsVisible} onClear={hideSuggestions} />
          </div>
        </form>
      </PageHeader>

      {initialQuery ? (
        hasResults ? (
          <>
            {seriesResults.length > 0 && (
              <SeriesRail kicker={`${seriesResults.length} found`} title="TV series" series={seriesResults} />
            )}
            {movieResults.length > 0 && (
              <Section kicker={`${movieResults.length} found`} title={`Movies matching “${initialQuery}”`}>
                <MovieGrid movies={movieResults} />
              </Section>
            )}
          </>
        ) : (
          <EmptyState
            title="No results found"
            message={`We couldn't find any matches for "${initialQuery}". Try searching for something else!`}
          />
        )
      ) : null}

      <div className="page-x">
        <AdResponsiveBanner className="mt-12" />
      </div>

      {recommended.length > 0 && <MovieRail kicker="Start here" title="Recommended movies" href="/movies" movies={recommended} />}

      <div className="page-x">
        <AdSlot unit="native" className="mt-12" label="Sponsored results" />
      </div>
    </div>
  );
};

export default Search;
