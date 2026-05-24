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
                  <div className="mobile-auth-google-icon" aria-label="Continue with Google">
                    <GoogleSignInButton
                      variant="icon"
                      onSuccess={() => {
                        setOauthError("");
                        onClose();
                      }}
                      onError={setOauthError}
                    />
                  </div>
                </div>
                {oauthError && <div className="mobile-auth-error">{oauthError}</div>}
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MobileSidebar;
