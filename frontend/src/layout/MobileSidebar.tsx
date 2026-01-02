import { Offcanvas, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

type Props = {
  show: boolean
  onClose: () => void
}

const MobileSidebar = ({ show, onClose }: Props) => {
  return (
    <>
      {/* ICON RAIL (MOBILE ONLY) */}
      <div className="mobile-rail d-lg-none">
        <i className="bi bi-list"></i>

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

      {/* OFFCANVAS */}
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
              <i className="bi bi-house me-2" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/categories" onClick={onClose}>
              <i className="bi bi-grid me-2" /> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/search" onClick={onClose}>
              <i className="bi bi-search me-2" /> Search
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" onClick={onClose}>
              <i className="bi bi-person me-2" /> Profile
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default MobileSidebar
