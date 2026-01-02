import { useState } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import SearchForm from '../components/SearchForm'
import MobileSidebar from './MobileSidebar'

const Header = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <>
      <Navbar bg="dark" variant="dark" sticky="top" className="px-2">
        <Container>
          <Navbar.Brand href="/">TOX</Navbar.Brand>

          {/* MOBILE TOGGLE → SIDEBAR */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* DESKTOP NAV ONLY */}
          <Nav className="me-auto d-none d-lg-flex">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/movies">Movies</Nav.Link>
          </Nav>

          {/* DESKTOP SEARCH ONLY */}
          <div className="d-none d-lg-block">
            <SearchForm />
          </div>
        </Container>
      </Navbar>

      {/* MOBILE SIDEBAR */}
      <MobileSidebar
        show={mobileSidebarOpen}
        onToggle={() => setMobileSidebarOpen(false)}
      />
    </>
  )
}

export default Header
