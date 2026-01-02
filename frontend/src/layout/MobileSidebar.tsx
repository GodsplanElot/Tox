import { Offcanvas, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

type Props = {
  show: boolean
  onOpen: () => void
  onClose: () => void
}

const MobileSidebar = ({ show, onOpen, onClose }: Props) => {

  return (
    <>
      {/* MOBILE ICON RAIL */}
      <div className="mobile-rail d-lg-none">
        {/* HAMBURGER BUTTON */}
        <button
          type="button"
          className="rail-toggle"
          aria-label="Open menu"
          onClick={onOpen}
        >
          <i className="bi bi-list"></i>
        </button>

        <Link to="/">
          <i className="bi bi-house"></i>
        </Link>

        <Link to="/categories">
          <i className="bi bi-grid"></i>
        </Link>

        <Link to="/search">
          <i className="bi bi-search"></i>
        </Link>

        <Link to="/profile">
          <i className="bi bi-person"></i>
        </Link>
      </div>

      {/* OFFCANVAS MENU */}
      <Offcanvas
        show={show}
        onHide={onClose}
        placement="start"
        backdrop
        className="mobile-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column gap-3">
            <Nav.Link as={Link} to="/" onClick={onClose}>
              <i className="bi bi-house me-2" />
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/categories" onClick={onClose}>
              <i className="bi bi-grid me-2" />
              Categories
            </Nav.Link>

            <Nav.Link as={Link} to="/search" onClick={onClose}>
              <i className="bi bi-search me-2" />
              Search
            </Nav.Link>

            <Nav.Link as={Link} to="/profile" onClick={onClose}>
              <i className="bi bi-person me-2" />
              Profile
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default MobileSidebar
