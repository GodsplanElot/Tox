import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'

type Props = {
  open: boolean
  onClose: () => void
}

const MobileNavbar: React.FC<Props> = ({ open, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current) return
      if (!navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        onClose()
      }
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!open) return null

  return (
    <nav className="header__nav header__nav--active" ref={navRef} aria-hidden={!open}>
      <ul>
        <li className="header__nav-item">
          <button className="header__nav-link" onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')} aria-expanded={openDropdown === 'categories'}>
            <i className="ti ti-layout-grid"></i>
            <span>Categories</span>
          </button>
          {openDropdown === 'categories' && (
            <ul className="header__dropdown-menu">
              <li><Link to="/movies" onClick={() => { onClose(); setOpenDropdown(null) }}><i className="ti ti-video"></i> Movies</Link></li>
              <li><Link to="/tv-series" onClick={() => { onClose(); setOpenDropdown(null) }}><i className="ti ti-tv"></i> Tv Series</Link></li>
              <li><Link to="/animations" onClick={() => { onClose(); setOpenDropdown(null) }}><i className="ti ti-paint-bucket"></i> Animations</Link></li>
              <li><Link to="/anime-series" onClick={() => { onClose(); setOpenDropdown(null) }}><i className="ti ti-star"></i> Anime Series</Link></li>
            </ul>
          )}
        </li>


        <li className="header__nav-item">
          <SearchForm onClose={onClose} />
        </li>

        <li className="header__nav-item">
          <div className="header__dropdown-menu header__dropdown-menu--user">
            <Link to="/profile" onClick={onClose}><i className="ti ti-ghost"></i> Profile</Link>
            <Link to="/subscription" onClick={onClose}><i className="ti ti-stereo-glasses"></i> Subscription</Link>
            <Link to="/favorites" onClick={onClose}><i className="ti ti-bookmark"></i> Favorites</Link>
            <Link to="/settings" onClick={onClose}><i className="ti ti-settings"></i> Settings</Link>
            <Link to="/logout" onClick={onClose}><i className="ti ti-logout"></i> Logout</Link>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default MobileNavbar
