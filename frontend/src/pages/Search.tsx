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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <section className="search-page">
      <div className="search-hero">
        <div className="search-hero__copy">
          <span>Search the vault</span>
          <h1>Find your next watch</h1>
        </div>

        <form className="search-hero__form" onSubmit={onSearch}>
          <div className="search-page-input" ref={searchWrapperRef}>
            <i className="bi bi-search search-page-input__icon" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search movies or TV series..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSuggestionsVisible(true);
              }}
              onFocus={() => setIsSuggestionsVisible(true)}
              aria-label="Search movies or TV series"
            />
            <button type="submit" aria-label="Search">
              <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
            <SearchSuggestions
              query={query}
              isVisible={isSuggestionsVisible}
              onClear={() => setIsSuggestionsVisible(false)}
            />
          </div>
        </form>
      </div>

      {recommended.length > 0 && (
        <MovieRail title="Recommended Movies" movies={recommended} />
      )}

      {initialQuery && (
        <div className="search-results">
          <h2 className="search-title">Results for "{initialQuery}"</h2>

          {movieResults.length > 0 && <MovieGrid movies={movieResults} />}

          {seriesResults.length > 0 && (
            <SeriesRail title="TV Series" series={seriesResults} />
          )}

          {movieResults.length === 0 && seriesResults.length === 0 && (
            <EmptyState
              title="No Results Found"
              message={`We couldn't find any matches for "${initialQuery}". Try searching for something else!`}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default Search;
