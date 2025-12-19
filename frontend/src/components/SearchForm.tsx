import React, { useState } from 'react'

type Props = {
  onClose?: () => void
  onSearch?: (query: string) => void
  className?: string
  placeholder?: string
}

const SearchForm: React.FC<Props> = ({ onClose, onSearch, className = '', placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
    else console.log('Search:', query)
  }

  const handleButtonClick = () => {
    if (onSearch) onSearch(query)
    else if (onClose) onClose()
  }

  return (
    <form className={`header__search ${className}`} onSubmit={handleSubmit}>
      <input
        className="header__search-input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="header__search-button" type="button" onClick={handleButtonClick} aria-label="Search">
        <i className="ti ti-search"></i>
      </button>
      {onClose && (
        <button className="header__search-close" type="button" onClick={onClose} aria-label="Close search">
          <i className="ti ti-x"></i>
        </button>
      )}
    </form>
  )
}

export default SearchForm
