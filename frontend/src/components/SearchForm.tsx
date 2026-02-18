import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import SearchSuggestions from "./SearchSuggestions";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsSuggestionsVisible(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={onSubmit} className="search-form">
      <div className="search-wrapper" ref={wrapperRef}>
        <i className="bi bi-search search-icon"></i>
        <input
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSuggestionsVisible(true);
          }}
          onFocus={() => setIsSuggestionsVisible(true)}
          className="navbar-search-input"
        />
        <SearchSuggestions
          query={query}
          isVisible={isSuggestionsVisible}
          onClear={() => setIsSuggestionsVisible(false)}
        />
      </div>
    </form>
  );
};

export default SearchForm;
