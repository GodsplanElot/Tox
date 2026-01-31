import { Offcanvas, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

type Props = {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const MobileSidebar = ({ show, onOpen, onClose }: Props) => {
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

        <NavLink to="/profile" className="rail-icon">
          <i className="bi bi-person"></i>
        </NavLink>
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

            <NavLink to="/profile" className="offcanvas-link" onClick={onClose}>
              Profile
            </NavLink>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MobileSidebar;
