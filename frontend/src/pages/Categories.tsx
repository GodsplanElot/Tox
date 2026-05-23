import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Category, Movie } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MovieRail from "../components/MovieRail/MovieRail";
import "../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, moviesData] = await Promise.all([
          api.getCategories(),
          api.getMovies().catch(() => []), // Fallback to empty array if movies fail
        ]);
        setCategories(catsData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const genreSections = useMemo(() => {
    return categories
      .map((category) => {
        const categoryMovies = movies
          .filter((movie) => movie.categories?.some((c) => c.id === category.id))
          .sort((a, b) => {
            const dateA = new Date(a.created_at || a.release_date || 0).getTime();
            const dateB = new Date(b.created_at || b.release_date || 0).getTime();
            return dateB - dateA;
          });

        return {
          category,
          movies: categoryMovies,
          poster: category.poster || categoryMovies[0]?.poster || null,
          featuredCount: categoryMovies.length,
        };
      })
      .filter((section) => section.featuredCount > 0 || section.category.is_active !== false);
  }, [categories, movies]);

  const movieSections = genreSections.filter((section) => section.movies.length > 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No Categories Available"
        message="We couldn't find any genres at the moment. Please check back later!"
      />
    );
  }

  return (
    <div className="categories-page">
      <header className="categories-hero">
        <span>Genre Atlas</span>
        <h1>Choose the mood, then press play.</h1>
        <p>
          Drift through curated worlds of action, drama, suspense, comedy, and
          everything in between.
        </p>
      </header>

      <section className="categories-grid" aria-label="Movie genres">
        {genreSections.map(({ category: cat, poster, featuredCount }, index) => {
          return (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="category-card-premium"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <div
                className="card-bg"
                style={
                  poster
                    ? { backgroundImage: `url(${api.getMediaUrl(poster)})` }
                    : undefined
                }
              />
              <div className="card-overlay" />
              <div className="card-content">
                <span className="card-count">
                  {featuredCount > 0 ? `${featuredCount} titles` : "Coming soon"}
                </span>
                <h2>{cat.name}</h2>
                {cat.description && (
                  <p>{cat.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </section>

      {movieSections.length > 0 && (
        <section className="genre-movie-showcase" aria-label="Movies by genre">
          <div className="genre-showcase-header">
            <span>Curated shelves</span>
            <h2>Movies by genre</h2>
            <p>
              Each row is pulled from your live catalog, sorted with the newest
              uploads first.
            </p>
          </div>

          <div className="genre-rails">
            {movieSections.map(({ category, movies: categoryMovies }, index) => (
              <div
                key={category.id}
                className="genre-rail-section"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="genre-rail-heading">
                  <div>
                    <span>{categoryMovies.length} movies</span>
                    <h3>{category.name}</h3>
                  </div>
                  <Link to={`/categories/${category.slug}`}>View all</Link>
                </div>
                <MovieRail title="" movies={categoryMovies.slice(0, 18)} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Categories;
