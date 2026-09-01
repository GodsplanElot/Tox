import { NavLink } from "react-router-dom";

type Props = {
  isAuthenticated: boolean;
  onLoginClick: () => void;
};

const MobileNavBar = ({ isAuthenticated, onLoginClick }: Props) => {
  return (
    <nav className="mobile-bottom-nav d-lg-none" aria-label="Primary mobile navigation">
      <div className="mobile-bottom-nav__surface" aria-hidden="true"></div>

      <NavLink to="/" className="mobile-bottom-nav__item mobile-bottom-nav__item--home">
        <i className="bi bi-house-door" aria-hidden="true"></i>
        <span>Home</span>
      </NavLink>

      <NavLink to="/series" className="mobile-bottom-nav__item mobile-bottom-nav__item--series">
        <i className="bi bi-collection-play" aria-hidden="true"></i>
        <span>Series</span>
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

      <NavLink to="/watchlist" className="mobile-bottom-nav__item mobile-bottom-nav__item--watchlist">
        <i className="bi bi-bookmark-check" aria-hidden="true"></i>
        <span>List</span>
      </NavLink>

      {isAuthenticated ? (
        <NavLink to="/profile" className="mobile-bottom-nav__item mobile-bottom-nav__item--account">
          <i className="bi bi-person-circle" aria-hidden="true"></i>
          <span>Profile</span>
        </NavLink>
      ) : (
        <button
          type="button"
          className="mobile-bottom-nav__item mobile-bottom-nav__item--account"
          onClick={onLoginClick}
        >
          <i className="bi bi-person-circle" aria-hidden="true"></i>
          <span>Account</span>
        </button>
      )}
    </nav>
  );
};

export default MobileNavBar;
