import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import navbarIcon from '../assets/icons/nav_logo.png'
import SearchForm from '../components/SearchForm'
import MobileNavbar from './MobileNavbar'

type DropdownKey = 'categories' | 'lang' | 'profile' | null

const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)
  const location = useLocation()

  /* ESC KEY HANDLER */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setMobileOpen(false)
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown(prev => (prev === key ? null : key))
  }

  const categories = [
    { label: 'Hollywood', path: '/' },
    { label: 'Bollywood', path: '/home2' },
    { label: 'Nollywood', path: '/home3' }
  ]

  return (
    <header className="header" ref={headerRef}>
      <div className="container">
        <div className="header__content">

          {/* LOGO */}
          <Link
            to="/"
            className="header__logo"
            onClick={() => setOpenDropdown(null)}
          >
            <img src={navbarIcon} alt="Logo" />
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <ul className="header__nav">
            <li className="header__nav-item">
              <button
                type="button"
                className={`header__nav-link ${
                  openDropdown === 'categories' ? 'active' : ''
                }`}
                aria-expanded={openDropdown === 'categories'}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDropdown('categories')
                }}
              >
                <i className="bi bi-grid-fill" />
                Categories
                <i className="bi bi-chevron-down" />
              </button>

              {openDropdown === 'categories' && (
                <ul className="header__dropdown-menu">
                  {categories.map(cat => (
                    <li key={cat.label}>
                      <Link
                        to={cat.path}
                        className={
                          location.pathname === cat.path ? 'active' : ''
                        }
                        onClick={() => setOpenDropdown(null)}
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* ================= ACTIONS ================= */}
          <div className="header__auth">

            {/* DESKTOP SEARCH (hidden on mobile via CSS) */}
            <div className="header__search header__search--desktop">
              <SearchForm />
            </div>


              <button
                className="header__mobile-search-icon header__search--mobile"
                aria-label="Search"
                onClick={(e) => {
                  e.stopPropagation()
                  setMobileSearchOpen(prev => !prev)
                  setOpenDropdown(null)
                }}
              >

              <i className={`bi ${mobileSearchOpen ? 'bi-x' : 'bi-search'}`} />
            </button>

            {/* LANGUAGE */}
            <div className="header__nav-item">
              <button
                type="button"
                className="header__nav-link"
                aria-expanded={openDropdown === 'lang'}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDropdown('lang')
                }}
              >
                EN <i className="bi bi-chevron-down" />
              </button>

              {openDropdown === 'lang' && (
                <ul className="header__dropdown-menu">
                  <li><button onClick={() => setOpenDropdown(null)}>English</button></li>
                  <li><button onClick={() => setOpenDropdown(null)}>Spanish</button></li>
                  <li><button onClick={() => setOpenDropdown(null)}>French</button></li>
                </ul>
              )}
            </div>

            {/* PROFILE */}
            <div className="header__nav-item">
              <button
                type="button"
                className="header__sign-in"
                aria-expanded={openDropdown === 'profile'}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDropdown('profile')
                }}
              >
                <i className="bi bi-person-circle" />
              </button>

              {openDropdown === 'profile' && (
                <ul className="header__dropdown-menu">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/subscription">Subscription</Link></li>
                  <li><Link to="/favorites">Favorites</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><button>Logout</button></li>
                </ul>
              )}
            </div>

            {/* ================= HAMBURGER ================= */}
            <button
              className={`header__btn ${
                mobileOpen ? 'header__btn--active' : ''
              }`}
              type="button"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={(e) => {
                e.stopPropagation()
                setMobileOpen(prev => !prev)
                setOpenDropdown(null)
                setMobileSearchOpen(false)
              }}
            >
              <span />
              <span />
              <span />
            </button>

          </div>
        </div>
      </div>

      {/* ================= MOBILE NAV ================= */}
      <MobileNavbar
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false)
          setOpenDropdown(null)
          setMobileSearchOpen(false)
        }}
      />

      {/* ================= MOBILE SEARCH POPUP ================= */}
      {mobileSearchOpen && (
        <div className="header__mobile-search-popup open">
          <SearchForm onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </header>
  )
}

export default Header
