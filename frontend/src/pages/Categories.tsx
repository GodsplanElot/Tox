import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Category } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import { Spinner, Container } from "react-bootstrap";
import "../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
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
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="category-card-premium animate-in"
          >
            <div
              className="card-bg"
              style={{ backgroundImage: `url(${api.getMediaUrl(null)})` }} // Note: Categories in backend don't have posters yet, could add if models updated
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
        ))}
      </div>
    </div>
  );
};

export default Categories;
