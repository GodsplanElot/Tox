import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFilm,
  FaLayerGroup,
  FaSearch,
  FaEllipsisH,
  FaTv,
  FaBookmark,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

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
      <div className="mobile-bottom-nav__surface" aria-hidden="true" />

      <NavLink end to="/" className="mobile-bottom-nav__item">
        <span className="mnav-icon-bg"><FaHome aria-hidden="true" /></span>
        <span>Home</span>
      </NavLink>

      <NavLink to="/movies" className="mobile-bottom-nav__item">
        <span className="mnav-icon-bg"><FaFilm aria-hidden="true" /></span>
        <span>Movies</span>
      </NavLink>

      <span className="mobile-bottom-nav__spacer" aria-hidden="true" />

      <NavLink
        to="/categories"
        className="mobile-bottom-nav__center"
        aria-label="Browse categories"
      >
        <FaLayerGroup aria-hidden="true" />
      </NavLink>

      <NavLink to="/search" className="mobile-bottom-nav__item">
        <span className="mnav-icon-bg"><FaSearch aria-hidden="true" /></span>
        <span>Search</span>
      </NavLink>

      <div className="mobile-bottom-nav__more" ref={moreRef}>
        <button
          type="button"
          className={`mobile-bottom-nav__item${showMore ? " active" : ""}`}
          aria-expanded={showMore}
          aria-haspopup="menu"
          onClick={() => setShowMore((v) => !v)}
        >
          <span className="mnav-icon-bg"><FaEllipsisH aria-hidden="true" /></span>
          <span>More</span>
        </button>

        {showMore && (
          <div className="mobile-more-popover" role="menu">
            <NavLink to="/series" role="menuitem" onClick={closeMore}>
              <span className="mpop-icon"><FaTv /></span>
              <span>Series</span>
            </NavLink>
            <NavLink to="/watchlist" role="menuitem" onClick={closeMore}>
              <span className="mpop-icon"><FaBookmark /></span>
              <span>Watchlist</span>
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" role="menuitem" onClick={closeMore}>
                  <span className="mpop-icon"><FaUser /></span>
                  <span>Profile</span>
                </NavLink>
                <button type="button" role="menuitem" onClick={logout}>
                  <span className="mpop-icon"><FaSignOutAlt /></span>
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <button type="button" role="menuitem" onClick={openLogin}>
                <span className="mpop-icon"><FaSignInAlt /></span>
                <span>Sign in</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileNavBar;
