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
    <form onSubmit={onSubmit}>
      <input
        type="search"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control"
      />
    </form>
  );
};

export default SearchForm;
