import { useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import AuthModal from "../components/AuthModal";
import MobileSidebar from "./MobileSidebar";
import logo from "../assets/icons/nav_logo.png";

type AuthTab = "login" | "signup";

const Header = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");

  const openSidebar = () => setMobileSidebarOpen(true);
  const closeSidebar = () => setMobileSidebarOpen(false);

  const openAuth = (tab: AuthTab) => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" sticky="top" className="navbar">
        <Container fluid>
          {/* LOGO */}
          <Navbar.Brand as={NavLink} to="/">
            <img src={logo} alt="TOX" height={32} />
          </Navbar.Brand>

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            aria-label="Open menu"
            onClick={openSidebar}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* DESKTOP NAV */}
          <Nav className="me-auto d-none d-lg-flex gap-3">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/categories">
              Categories
            </Nav.Link>

            <Nav.Link as={NavLink} to="/series">
              Tv Series
            </Nav.Link>
          </Nav>

          {/* DESKTOP SEARCH AND AUTH */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <SearchForm />
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
          </div>
        </Container>
      </Navbar>

      {/* MOBILE SIDEBAR */}
      <MobileSidebar
        show={mobileSidebarOpen}
        onOpen={openSidebar}
        onClose={closeSidebar}
        onLoginClick={() => {
          closeSidebar();
          openAuth("login");
        }}
        onSignUpClick={() => {
          closeSidebar();
          openAuth("signup");
        }}
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
