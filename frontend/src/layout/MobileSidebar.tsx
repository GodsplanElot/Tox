import { Offcanvas, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

type Props = {
  show: boolean
  onToggle: () => void
}

const MobileSidebar = ({ show, onToggle }: Props) => {
  return (
    <>
      {/* ICON RAIL (ALWAYS VISIBLE) */}
      <div
        className="mobile-rail d-lg-none"
        onClick={onToggle}
      >
        <i className="bi bi-list"></i>
        <i className="bi bi-house"></i>
        <i className="bi bi-grid"></i>
        <i className="bi bi-search"></i>
        <i className="bi bi-person"></i>
      </div>

      {/* OFFCANVAS MENU */}
      <Offcanvas
        show={show}
        onHide={onToggle}
        placement="start"
        backdrop={false}
        className="mobile-offcanvas"
      >
        <Offcanvas.Header>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column gap-3">
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house me-2" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/categories">
              <i className="bi bi-grid me-2" /> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/search">
              <i className="bi bi-search me-2" /> Search
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              <i className="bi bi-person me-2" /> Profile
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default MobileSidebar
