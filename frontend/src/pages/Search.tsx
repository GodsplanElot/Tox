import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import MovieRail from "../components/MovieRail/MovieRail";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import { moviesFromDb } from "../data/movies";
import "../styles/Search.css";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!initialQuery) return [];

    return moviesFromDb.filter((movie) =>
      movie.title.toLowerCase().includes(initialQuery.toLowerCase())
    );
  }, [initialQuery]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: query });
  };

  const recommended = moviesFromDb.slice(0, 12);
  const latest = moviesFromDb.slice(-12);

  return (
    <section className="search-page">
      {/* MOBILE SEARCH INPUT */}
      <form className="search-mobile" onSubmit={onSearch}>
        <input
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {/* RESULTS */}
      {initialQuery && (
        <>
          <h2 className="search-title">
            Results for “{initialQuery}”
          </h2>

          <MovieGrid movies={results} />
        </>
      )}

      {/* RAILS (ALWAYS SHOWN) */}
      <MovieRail title="Recommended" movies={recommended} />
      <MovieRail title="Latest" movies={latest} />
    </section>
  );
};

export default Search;
