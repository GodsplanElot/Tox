import { Offcanvas, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

type Props = {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  isAuthenticated: boolean;
  username?: string;
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
  onLogout,
}: Props) => {
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
          <Offcanvas.Title className="text-white fw-semibold">
            TOX
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
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

            <button
              type="button"
              className="offcanvas-link"
              onClick={isAuthenticated ? undefined : onLoginClick}
            >
              {isAuthenticated ? username ?? "Account" : "Account"}
            </button>
          </Nav>

          <div className="mt-4 pt-4 border-top border-secondary d-flex flex-column gap-3">
            {isAuthenticated ? (
              <button
                className="btn btn-outline-light w-100 rounded-pill py-2"
                style={{ fontWeight: 500, letterSpacing: "0.5px" }}
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-light w-100 rounded-pill py-2"
                  style={{ fontWeight: 500, letterSpacing: "0.5px" }}
                  onClick={onLoginClick}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary w-100 rounded-pill py-2"
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    backgroundColor: "var(--accent-primary)",
                    borderColor: "var(--accent-primary)",
                    boxShadow: "0 4px 15px rgba(249, 171, 0, 0.2)",
                  }}
                  onClick={onSignUpClick}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MobileSidebar;
