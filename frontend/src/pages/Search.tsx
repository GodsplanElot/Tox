import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useRef, useEffect } from "react";

import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import SearchSuggestions from "../components/SearchSuggestions";
import { api } from "../services/api";
import type { Movie, Series } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

import "../styles/Search.css";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const mobileWrapperRef = useRef<HTMLDivElement>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileWrapperRef.current &&
        !mobileWrapperRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * MOVIE RESULTS
   */
  const movieResults = useMemo(() => {
    if (!initialQuery) return [];

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(initialQuery.toLowerCase()),
    );
  }, [initialQuery, movies]);

  /**
   * SERIES RESULTS
   */
  const seriesResults = useMemo(() => {
    if (!initialQuery) return [];

    return series.filter((s) =>
      s.title.toLowerCase().includes(initialQuery.toLowerCase()),
    );
  }, [initialQuery, series]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: query });
    setIsSuggestionsVisible(false);
  };

  const recommended = useMemo(() => movies.slice(0, 12), [movies]);
  const latest = useMemo(() => movies.slice(-12), [movies]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="search-page">
      {/* MOBILE SEARCH INPUT */}
      <form className="search-mobile" onSubmit={onSearch}>
        <div className="search-wrapper" ref={mobileWrapperRef}>
          <i className="bi bi-search search-icon"></i>
          <input
            type="search"
            placeholder="Search movies or TV series..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSuggestionsVisible(true);
            }}
            onFocus={() => setIsSuggestionsVisible(true)}
          />
          <SearchSuggestions
            query={query}
            isVisible={isSuggestionsVisible}
            onClear={() => setIsSuggestionsVisible(false)}
          />
        </div>
      </form>

      {/* SEARCH RESULTS */}
      {initialQuery && (
        <>
          <h2 className="search-title">Results for “{initialQuery}”</h2>

          {/* MOVIES */}
          {movieResults.length > 0 && <MovieGrid movies={movieResults} />}

          {/* SERIES */}
          {seriesResults.length > 0 && (
            <SeriesRail title="TV Series" series={seriesResults} />
          )}

          {/* EMPTY STATE */}
          {movieResults.length === 0 && seriesResults.length === 0 && (
            <EmptyState
              title="No Results Found"
              message={`We couldn't find any matches for "${initialQuery}". Try searching for something else!`}
            />
          )}
        </>
      )}

      {/* RAILS (ALWAYS SHOWN) */}
      {!initialQuery && (
        <>
          <MovieRail title="Recommended" movies={recommended} />
          <MovieRail title="Latest" movies={latest} />
        </>
      )}
    </section>
  );
};

export default Search;
