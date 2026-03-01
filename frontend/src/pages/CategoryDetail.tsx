import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import { categories as mockCategories } from "../data/categories";
import { moviesFromDb } from "../data/movies";
import { seriesFromDb } from "../data/series";
import { api } from "../services/api";
import type { Movie, Series, Category } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";

import "../styles/CategoryDetail.css";

type SortOption = "az" | "newest" | "oldest" | "rating";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState<SortOption>("az");
  const [category, setCategory] = useState<Category | null>(null);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, allMovies, allSeries] = await Promise.all([
          api.getCategories().catch(() => []),
          api.getMovies().catch(() => []),
          api.getSeries().catch(() => []),
        ]);

        const currentCat =
          catData.find((c) => c.slug === slug) ||
          mockCategories.find((c) => c.slug === slug) ||
          null;

        setCategory(currentCat);

        if (allMovies.length === 0) {
          setMoviesList(moviesFromDb);
        } else {
          setMoviesList(allMovies);
        }

        if (allSeries.length === 0) {
          setSeriesList(seriesFromDb);
        } else {
          setSeriesList(allSeries);
        }
      } catch (error) {
        console.error("Error fetching category detail data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  /**
   * MOVIES
   */
  const movies = useMemo(() => {
    if (!category) return [];

    const filtered = moviesList.filter((movie) =>
      movie.categories.some((c) => c.id === category.id),
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);

        case "newest":
          return (
            new Date(b.release_date ?? "").getTime() -
            new Date(a.release_date ?? "").getTime()
          );

        case "oldest":
          return (
            new Date(a.release_date ?? "").getTime() -
            new Date(b.release_date ?? "").getTime()
          );

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return 0;
      }
    });
  }, [category, sortBy, moviesList]);

  /**
   * SERIES
   */
  const series = useMemo(() => {
    if (!category) return [];

    const filtered = seriesList.filter((show) =>
      show.categories.some((c) => c.id === category.id),
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);

        case "newest":
          return (
            new Date(b.first_air_date ?? "").getTime() -
            new Date(a.first_air_date ?? "").getTime()
          );

        case "oldest":
          return (
            new Date(a.first_air_date ?? "").getTime() -
            new Date(b.first_air_date ?? "").getTime()
          );

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return 0;
      }
    });
  }, [category, sortBy, seriesList]);

  if (loading) {
    return <LoadingSpinner />;
  }

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
      {series.length > 0 && <SeriesRail title="TV Series" series={series} />}

      {/* EMPTY STATE */}
      {movies.length === 0 && series.length === 0 && (
        <p>No movies or TV series found in this category.</p>
      )}
    </section>
  );
};

export default CategoryDetail;
