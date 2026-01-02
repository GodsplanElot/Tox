import { Navbar, Container, Nav } from 'react-bootstrap'
import SearchForm from '../components/SearchForm'

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">TOX</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/movies">Movies</Nav.Link>
          </Nav>

          {/* DESKTOP SEARCH */}
          <div className="d-none d-lg-block">
            <SearchForm />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
