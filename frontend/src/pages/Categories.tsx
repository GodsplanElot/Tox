import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import "../styles/Categories.css";

const Categories = () => {
  return (
    <section className="categories-page">
      <header className="categories-hero">
        <h1>Browse Categories</h1>
        <p>Discover movies by genre</p>
      </header>

      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="category-card"
            style={{
              backgroundImage: `url(${cat.poster})`,
            }}
          >
            <div className="category-overlay" />
            <div className="category-content">
              <h2>{cat.name}</h2>
              {cat.description && <p>{cat.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
