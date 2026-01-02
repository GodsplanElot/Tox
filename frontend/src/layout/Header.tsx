import { useState } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import SearchForm from '../components/SearchForm'
import MobileSidebar from './MobileSidebar'


const Header = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">TOX</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* LEFT NAV */}
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/movies">Movies</Nav.Link>
          </Nav>

          {/* DESKTOP SEARCH */}
          <div className="d-none d-lg-block">
            <SearchForm />
          </div>

          {/* MOBILE SEARCH */}
          <div className="d-lg-none mt-3">
            <SearchForm />
          </div>
        </Navbar.Collapse>
      </Container>

      <MobileSidebar
        show={mobileSidebarOpen}
        onToggle={() => setMobileSidebarOpen(prev => !prev)}
      />
    </Navbar>
    
  )
}

export default Header
