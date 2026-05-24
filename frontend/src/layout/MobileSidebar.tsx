import { Offcanvas, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { GoogleIcon } from "../components/AuthModal";

type Props = {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  onLogout: () => void;
};

const MobileSidebar = ({
  show,
  onOpen,
  onClose,
  onLoginClick,
  onSignUpClick,
  isAuthenticated,
  username,
  email,
  onLogout,
}: Props) => {
  const displayName = username || email || "Account";
  const accountLabel = email || "Signed in";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <>
      {/* MOBILE ICON RAIL */}
      <div className={`mobile-rail d-lg-none ${show ? "mobile-rail--menu-open" : ""}`}>
        <button
          type="button"
          className="rail-toggle"
          aria-label="Open menu"
          onClick={onOpen}
        >
          <i className="bi bi-list"></i>
        </button>

        <NavLink to="/" className="rail-icon">
          <i className="bi bi-house"></i>
        </NavLink>

        <NavLink to="/categories" className="rail-icon">
          <i className="bi bi-grid"></i>
        </NavLink>

        <NavLink to="/series" className="rail-icon">
          <i className="bi bi-play-circle"></i>
        </NavLink>

        <NavLink to="/search" className="rail-icon">
          <i className="bi bi-search"></i>
        </NavLink>

        {isAuthenticated && (
          <NavLink to="/watchlist" className="rail-icon">
            <i className="bi bi-bookmark"></i>
          </NavLink>
        )}

        <button
          type="button"
          className="rail-icon"
          aria-label={isAuthenticated ? "Account" : "Log in"}
          onClick={isAuthenticated ? onOpen : onLoginClick}
        >
          <i className={isAuthenticated ? "bi bi-person" : "bi bi-person-plus"}></i>
        </button>
      </div>

      {/* OFFCANVAS MENU */}
      <Offcanvas
        show={show}
        onHide={onClose}
        placement="start"
        backdrop="static"
        className="mobile-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="mobile-menu-title">
            <ToxicSkullMark />
            <small>Browse darker. Save smarter.</small>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {isAuthenticated && (
            <NavLink to="/profile" className="mobile-account-card" onClick={onClose}>
              <span className="account-avatar account-avatar--large" aria-hidden="true">
                {initials}
              </span>
              <div className="mobile-account-copy">
                <span>{displayName}</span>
                <small>{accountLabel}</small>
              </div>
            </NavLink>
          )}

          <Nav className="flex-column gap-2">
            <NavLink to="/" className="offcanvas-link" onClick={onClose}>
              <i className="bi bi-house" aria-hidden="true"></i>
              Home
            </NavLink>

            <NavLink
              to="/categories"
              className="offcanvas-link"
              onClick={onClose}
            >
              <i className="bi bi-grid" aria-hidden="true"></i>
              Categories
            </NavLink>

            <NavLink to="/series" className="offcanvas-link" onClick={onClose}>
              <i className="bi bi-play-circle" aria-hidden="true"></i>
              Series
            </NavLink>

            <NavLink to="/search" className="offcanvas-link" onClick={onClose}>
              <i className="bi bi-search" aria-hidden="true"></i>
              Search
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/profile"
                className="offcanvas-link"
                onClick={onClose}
              >
                <i className="bi bi-person-circle" aria-hidden="true"></i>
                Profile
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/watchlist"
                className="offcanvas-link"
                onClick={onClose}
              >
                <i className="bi bi-bookmark" aria-hidden="true"></i>
                Watchlist
              </NavLink>
            )}

          </Nav>

          <div className="mobile-menu-footer">
            {isAuthenticated ? (
              <button
                className="mobile-auth-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Logout
              </button>
            ) : (
              <div className="mobile-auth-strip">
                <div className="mobile-auth-strip__copy">
                  <span>Account</span>
                  <small>Save titles and sync your watchlist.</small>
                </div>
                <div className="mobile-auth-strip__actions">
                  <button
                    type="button"
                    className="mobile-auth-btn mobile-auth-btn--primary"
                    onClick={onLoginClick}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="mobile-auth-btn"
                    onClick={onSignUpClick}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    className="mobile-auth-google-icon"
                    aria-label="Continue with Google"
                    onClick={onLoginClick}
                  >
                    <GoogleIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const ToxicSkullMark = () => (
  <span className="toxic-skull-mark" aria-label="ToxicWaste">
    <svg viewBox="0 0 72 72" role="img" focusable="false">
      <path className="skull-shadow" d="M18 62h36v5H18z" />
      <path className="skull-head" d="M18 14h36v10h6v24h-8v10H20V48h-8V24h6z" />
      <path className="skull-top" d="M24 8h24v8H24z" />
      <path className="skull-jaw" d="M26 52h20v10H26z" />
      <path className="skull-eye" d="M23 28h13v10H23zM40 28h13v10H40z" />
      <path className="skull-nose" d="M34 40h6v8h-6z" />
      <path className="skull-teeth" d="M29 54h4v8h-4zM36 54h4v8h-4zM43 54h4v8h-4z" />
      <path className="skull-drip" d="M15 46h8v8h-8zM49 47h8v7h-8z" />
    </svg>
  </span>
);

export default MobileSidebar;
