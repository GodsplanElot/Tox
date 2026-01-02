import { useState } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import SearchForm from '../components/SearchForm'
import MobileSidebar from './MobileSidebar'
import logo from '../assets/icons/nav_logo.png'

const Header = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const openSidebar = () => setMobileSidebarOpen(true)
  const closeSidebar = () => setMobileSidebarOpen(false)

  return (
    <>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container fluid>
          {/* LOGO */}
          <Navbar.Brand href="/">
            <img src={logo} alt="TOX" height={32} />
          </Navbar.Brand>

          {/* MOBILE TOGGLE (TOP NAV) */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            aria-label="Open menu"
            onClick={openSidebar}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* DESKTOP NAV */}
          <Nav className="me-auto d-none d-lg-flex">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/movies">Movies</Nav.Link>
          </Nav>

          {/* DESKTOP SEARCH */}
          <div className="d-none d-lg-block">
            <SearchForm />
          </div>
        </Container>
      </Navbar>

      {/* MOBILE SIDEBAR */}
      <MobileSidebar
        show={mobileSidebarOpen}
        onOpen={openSidebar}
        onClose={closeSidebar}
      />
    </>
  )
}

export default Header
