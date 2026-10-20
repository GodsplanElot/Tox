import { useNavigate } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import SearchSuggestions from "./SearchSuggestions";
import { useDismiss } from "./ui/useDismiss";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hideSuggestions = useCallback(() => setIsSuggestionsVisible(false), []);
  useDismiss(wrapperRef, isSuggestionsVisible, hideSuggestions);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsSuggestionsVisible(false);
  };

  return (
    <form onSubmit={onSubmit} role="search">
      <div ref={wrapperRef} className="group relative">
        <FiSearch
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-subtle transition group-focus-within:text-accent"
        />
        <input
          type="search"
          placeholder="Search titles…"
          aria-label="Search movies and series"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSuggestionsVisible(true);
          }}
          onFocus={() => setIsSuggestionsVisible(true)}
          className="h-9 w-56 rounded-full bg-white/[0.05] pr-4 pl-10 text-[13px] text-white ring-1 ring-white/[0.08] transition-all duration-300 ring-inset placeholder:text-fg-subtle focus:w-72 focus:bg-white/[0.08] focus:ring-accent/40 focus:outline-none xl:w-64 xl:focus:w-80"
        />
        <SearchSuggestions query={query} isVisible={isSuggestionsVisible} onClear={hideSuggestions} />
      </div>
    </form>
  );
};

export default SearchForm;
