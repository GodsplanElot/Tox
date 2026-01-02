import { Form, Button, InputGroup } from 'react-bootstrap'
import { useState } from 'react'

const SearchForm = () => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', query)
  }

  return (
    <Form onSubmit={handleSubmit} className="d-flex">
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="warning" type="submit">
          <i className="bi bi-search" />
        </Button>
      </InputGroup>
    </Form>
  )
}

export default SearchForm
