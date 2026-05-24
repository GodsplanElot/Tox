import { useState } from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { GoogleSignInButton } from "../components/AuthModal";

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
  const [oauthError, setOauthError] = useState("");
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
      <div className="mobile-rail d-lg-none">
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
          <i className="bi bi-person"></i>
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
            <span>TOX</span>
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

          {!isAuthenticated && (
            <div className="mobile-auth-panel">
              <div className="mobile-auth-panel__copy">
                <span>Unlock your shelf</span>
                <h2>Keep a private watchlist across movies and series.</h2>
              </div>

              <div className="mobile-auth-google">
                <GoogleSignInButton
                  onSuccess={() => {
                    setOauthError("");
                    onClose();
                  }}
                  onError={setOauthError}
                />
              </div>
              {oauthError && <div className="mobile-auth-error">{oauthError}</div>}

              <div className="mobile-auth-divider">
                <span>or use email</span>
              </div>

              <div className="mobile-auth-actions">
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
              </div>
            </div>
          )}

          <Nav className="flex-column gap-2">
            <NavLink to="/" className="offcanvas-link" onClick={onClose}>
              Home
            </NavLink>

            <NavLink
              to="/categories"
              className="offcanvas-link"
              onClick={onClose}
            >
              Categories
            </NavLink>

            <NavLink to="/series" className="offcanvas-link" onClick={onClose}>
              Series
            </NavLink>

            <NavLink to="/search" className="offcanvas-link" onClick={onClose}>
              Search
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/profile"
                className="offcanvas-link"
                onClick={onClose}
              >
                Profile
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/watchlist"
                className="offcanvas-link"
                onClick={onClose}
              >
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
            ) : null}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MobileSidebar;
