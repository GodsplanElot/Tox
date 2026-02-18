import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} className="search-form">
      <div className="search-wrapper">
        <i className="bi bi-search search-icon"></i>
        <input
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="navbar-search-input"
        />
      </div>
    </form>
  );
};

export default SearchForm;
