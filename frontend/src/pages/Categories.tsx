import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Category, Movie } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
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

  const getLatestMoviePoster = (categoryId: number) => {
    // Find all movies that belong to this category
    const categoryMovies = movies.filter((movie) =>
      movie.categories?.some((c) => c.id === categoryId),
    );

    if (categoryMovies.length === 0) return null;

    // Sort by created_at (descending) or release_date if created_at isn't reliable
    categoryMovies.sort((a, b) => {
      const dateA = new Date(a.created_at || a.release_date || 0).getTime();
      const dateB = new Date(b.created_at || b.release_date || 0).getTime();
      return dateB - dateA; // Latest first
    });

    return categoryMovies[0].poster;
  };

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
    <div className="container-fluid categories-page py-5">
      <header className="categories-hero mb-5 text-center">
        <h1 className="display-4 fw-bold text-white mb-2">Explore Genres</h1>
        <div className="d-flex justify-content-center">
          <div className="category-header-line mb-3" />
        </div>
        <p className="lead text-muted">
          Discover your next favorite story by category
        </p>
      </header>

      <div className="categories-grid grid">
        {categories.map((cat) => {
          const poster = getLatestMoviePoster(cat.id);

          return (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="category-card-premium animate-in"
            >
              <div
                className="card-bg"
                style={{ backgroundImage: `url(${api.getMediaUrl(poster)})` }}
              />
              <div className="card-overlay" />
              <div className="card-content">
                <span className="card-accent" />
                <h2 className="h4 fw-bold mb-1">{cat.name}</h2>
                {cat.description && (
                  <p className="small mb-0 opacity-100">{cat.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
