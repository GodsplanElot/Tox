import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import "../styles/Categories.css";

const Categories = () => {
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
              style={{ backgroundImage: `url(${cat.poster})` }}
            />
            <div className="card-overlay" />
            <div className="card-content">
              <span className="card-accent" />
              <h2 className="h4 fw-bold mb-1">{cat.name}</h2>
              {cat.description && (
                <p className="small mb-0 opacity-0">{cat.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
