import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
};

const MobileNavBar = ({ isAuthenticated, onLoginClick, onLogout }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showMore) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) {
        setShowMore(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMore(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMore]);

  const closeMore = () => setShowMore(false);

  const openLogin = () => {
    closeMore();
    onLoginClick();
  };

  const logout = () => {
    closeMore();
    onLogout();
  };

  return (
    <nav className="mobile-bottom-nav d-lg-none" aria-label="Primary mobile navigation">
      <div className="mobile-bottom-nav__surface" aria-hidden="true"></div>

      <NavLink to="/" className="mobile-bottom-nav__item mobile-bottom-nav__item--home">
        <i className="bi bi-house-door" aria-hidden="true"></i>
        <span>Home</span>
      </NavLink>

      <NavLink to="/movies" className="mobile-bottom-nav__item mobile-bottom-nav__item--movies">
        <i className="bi bi-play-btn" aria-hidden="true"></i>
        <span>Movies</span>
      </NavLink>

      <span className="mobile-bottom-nav__spacer" aria-hidden="true"></span>

      <NavLink
        to="/categories"
        className="mobile-bottom-nav__center"
        aria-label="Browse categories"
      >
        <i className="bi bi-grid-3x3-gap-fill" aria-hidden="true"></i>
      </NavLink>

      <NavLink to="/search" className="mobile-bottom-nav__item mobile-bottom-nav__item--search">
        <i className="bi bi-search" aria-hidden="true"></i>
        <span>Search</span>
      </NavLink>

      <div className="mobile-bottom-nav__more" ref={moreRef}>
        <button
          type="button"
          className={`mobile-bottom-nav__item mobile-bottom-nav__item--more ${showMore ? "active" : ""}`}
          aria-expanded={showMore}
          aria-haspopup="menu"
          onClick={() => setShowMore((current) => !current)}
        >
          <i className="bi bi-three-dots" aria-hidden="true"></i>
          <span>More</span>
        </button>

        {showMore && (
          <div className="mobile-more-popover" role="menu">
            <NavLink to="/series" role="menuitem" onClick={closeMore}>
              <i className="bi bi-collection-play" aria-hidden="true"></i>
              <span>Series</span>
            </NavLink>
            <NavLink to="/watchlist" role="menuitem" onClick={closeMore}>
              <i className="bi bi-bookmark-check" aria-hidden="true"></i>
              <span>Watchlist</span>
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" role="menuitem" onClick={closeMore}>
                  <i className="bi bi-person-circle" aria-hidden="true"></i>
                  <span>Profile</span>
                </NavLink>
                <button type="button" role="menuitem" onClick={logout}>
                  <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button type="button" role="menuitem" onClick={openLogin}>
                <i className="bi bi-person-circle" aria-hidden="true"></i>
                <span>Login</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileNavBar;
