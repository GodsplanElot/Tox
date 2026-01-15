import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import { categories } from "../data/categories";
import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";

import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";

import "../styles/CategoryDetail.css";

type SortOption = "az" | "newest" | "oldest" | "rating";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState<SortOption>("az");

  const category = categories.find((c) => c.slug === slug);

  /**
   * MOVIES
   */
  const movies = useMemo(() => {
    if (!category) return [];

    const filtered = moviesFromDb.filter((movie) =>
      movie.categoryIds.includes(category.id)
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);

        case "newest":
          return (
            new Date(b.releaseDate ?? "").getTime() -
            new Date(a.releaseDate ?? "").getTime()
          );

        case "oldest":
          return (
            new Date(a.releaseDate ?? "").getTime() -
            new Date(b.releaseDate ?? "").getTime()
          );

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return 0;
      }
    });
  }, [category, sortBy]);

  /**
   * SERIES
   */
  const series = useMemo(() => {
    if (!category) return [];

    const filtered = seriesFromDb.filter((show) =>
      show.categoryIds.includes(category.id)
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);

        case "newest":
          return (
            new Date(b.firstAirDate ?? "").getTime() -
            new Date(a.firstAirDate ?? "").getTime()
          );

        case "oldest":
          return (
            new Date(a.firstAirDate ?? "").getTime() -
            new Date(b.firstAirDate ?? "").getTime()
          );

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return 0;
      }
    });
  }, [category, sortBy]);

  if (!category) {
    return <p>Category not found</p>;
  }

  return (
    <section className="content-section">
      <header className="category-header">
        <h1>{category.name}</h1>
        {category.description && <p>{category.description}</p>}

        {/* SORT CONTROLS */}
        <div className="category-sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="az">A–Z</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </header>

      {/* MOVIES */}
      {movies.length > 0 && <MovieGrid movies={movies} />}

      {/* SERIES */}
      {series.length > 0 && (
        <SeriesRail title="TV Series" series={series} />
      )}

      {/* EMPTY STATE */}
      {movies.length === 0 && series.length === 0 && (
        <p>No movies or TV series found in this category.</p>
      )}
    </section>
  );
};

export default CategoryDetail;
