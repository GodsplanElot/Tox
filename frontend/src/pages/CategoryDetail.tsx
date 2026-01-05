import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { categories } from "../data/categories";
import { moviesFromDb } from "../data/movies";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import type { Movie } from "../types/movie";

type SortOption = "az" | "newest" | "oldest" | "rating";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState<SortOption>("az");

  const category = categories.find((c) => c.slug === slug);

  const movies = useMemo(() => {
    if (!category) return [];

    let filtered = moviesFromDb.filter((movie) =>
      movie.categoryIds.includes(category.id)
    );

    switch (sortBy) {
      case "az":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));

      case "newest":
        return filtered.sort(
          (a, b) =>
            new Date(b.releaseDate ?? "").getTime() -
            new Date(a.releaseDate ?? "").getTime()
        );

      case "oldest":
        return filtered.sort(
          (a, b) =>
            new Date(a.releaseDate ?? "").getTime() -
            new Date(b.releaseDate ?? "").getTime()
        );

      case "rating":
        return filtered.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );

      default:
        return filtered;
    }
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

      <MovieGrid movies={movies} />
    </section>
  );
};

export default CategoryDetail;
