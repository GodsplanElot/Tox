import { useState } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/useAuth";
import MobileNavBar from "./MobileNavBar";
import logo from "../assets/icons/nav_logo.png";

type AuthTab = "login" | "signup";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");

  const openAuth = (tab: AuthTab) => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  const displayName = user?.first_name || user?.username || user?.email || "Account";
  const accountLabel = user?.email || user?.username || "Signed in";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <>
      <Navbar bg="dark" variant="dark" sticky="top" className="navbar">
        <Container fluid>
          {/* LOGO */}
          <Navbar.Brand as={NavLink} to="/">
            <img src={logo} alt="TOXin" height={32} />
          </Navbar.Brand>

          {/* DESKTOP NAV */}
          <Nav className="me-auto d-none d-lg-flex gap-3">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/categories">
              Categories
            </Nav.Link>

            <Nav.Link as={NavLink} to="/movies">
              Movies
            </Nav.Link>

            <Nav.Link as={NavLink} to="/series">
              Tv Series
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/watchlist">
                Watchlist
              </Nav.Link>
            )}
          </Nav>

          {/* DESKTOP SEARCH AND AUTH */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <SearchForm />
            {isAuthenticated ? (
              <Dropdown align="end" className="account-menu">
                <Dropdown.Toggle className="account-toggle" id="account-menu-toggle">
                  <span className="account-avatar" aria-hidden="true">
                    {initials}
                  </span>
                  <span className="account-copy">
                    <span className="account-name">{displayName}</span>
                    <span className="account-meta">{accountLabel}</span>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="account-dropdown">
                  <Dropdown.Item as={NavLink} to="/profile">
                    <i className="bi bi-person-circle" aria-hidden="true"></i>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/watchlist">
                    <i className="bi bi-bookmark-check" aria-hidden="true"></i>
                    Watchlist
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={logout}>
                    <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3 ms-1">
                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                  style={{ fontWeight: 500, letterSpacing: "0.5px" }}
                  onClick={() => openAuth("login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3 py-1"
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    backgroundColor: "var(--accent-primary)",
                    borderColor: "var(--accent-primary)",
                  }}
                  onClick={() => openAuth("signup")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </Container>
      </Navbar>

      <MobileNavBar
        isAuthenticated={isAuthenticated}
        onLoginClick={() => openAuth("login")}
      />

      {/* AUTH MODAL */}
      <AuthModal
        show={showAuth}
        onHide={() => setShowAuth(false)}
        defaultTab={authTab}
      />
    </>
  );
};

export default Header;
