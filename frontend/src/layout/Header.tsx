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
  const location = useLocation() // To handle active nav highlighting

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

          {/* Logo */}
          <Link to="/" className="header__logo" onClick={() => setOpenDropdown(null)}>
            <img src={navbarIcon} alt="Logo" />
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <ul className="header__nav d-none d-xl-flex align-items-center">
            <li className="header__nav-item">
              <button
                type="button"
                className={`header__nav-link d-flex align-items-center ${
                  openDropdown === 'categories' ? 'active' : ''
                }`}
                aria-expanded={openDropdown === 'categories'}
                onClick={(e) => { e.stopPropagation(); toggleDropdown('categories') }}
              >
                <i className="bi bi-grid-fill me-1"></i> {/* Icon for categories */}
                Categories <i className="bi bi-chevron-down ms-1" />
              </button>
              <ul className={`header__dropdown-menu ${openDropdown === 'categories' ? 'show' : ''}`}>
                {categories.map(cat => (
                  <li key={cat.label}>
                    <Link
                      to={cat.path}
                      onClick={() => setOpenDropdown(null)}
                      className={location.pathname === cat.path ? 'active' : ''}
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* ================= RIGHT SIDE ================= */}
          <div className="header__auth d-flex align-items-center">

            {/* Desktop Search */}
            <div className="d-none d-xl-block">
              <SearchForm />
            </div>

            {/* Mobile Search Icon */}
            <button
              className={`d-xl-none header__mobile-search-icon ${
                mobileSearchOpen ? 'active' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setMobileSearchOpen(prev => !prev)
              }}
              aria-label="Search"
            >
              <i className={`bi ${mobileSearchOpen ? 'bi-x' : 'bi-search'}`}></i>
            </button>




            {/* Language */}
            <div className="header__lang">
              <button
                type="button"
                className="header__nav-link"
                aria-expanded={openDropdown === 'lang'}
                onClick={(e) => { e.stopPropagation(); toggleDropdown('lang') }}
              >
                EN <i className="bi bi-chevron-down" />
              </button>
              <ul className={`header__dropdown-menu ${openDropdown === 'lang' ? 'show' : ''}`}>
                <li><button type="button" onClick={() => setOpenDropdown(null)}>English</button></li>
                <li><button type="button" onClick={() => setOpenDropdown(null)}>Spanish</button></li>
                <li><button type="button" onClick={() => setOpenDropdown(null)}>French</button></li>
              </ul>
            </div>

            {/* Profile */}
            <div className="header__profile">
              <button
                type="button"
                className="header__sign-in header__sign-in--user"
                aria-expanded={openDropdown === 'profile'}
                onClick={(e) => { e.stopPropagation(); toggleDropdown('profile') }}
              >
                <i className="bi bi-person-circle" />
                <span>NICKNAME</span>
              </button>
              <ul className={`header__dropdown-menu header__dropdown-menu--user ${openDropdown === 'profile' ? 'show' : ''}`}>
                <li><Link to="/profile" onClick={() => setOpenDropdown(null)}>Profile</Link></li>
                <li><Link to="/subscription" onClick={() => setOpenDropdown(null)}>Subscription</Link></li>
                <li><Link to="/favorites" onClick={() => setOpenDropdown(null)}>Favorites</Link></li>
                <li><Link to="/settings" onClick={() => setOpenDropdown(null)}>Settings</Link></li>
                <li><button type="button" onClick={() => setOpenDropdown(null)}>Logout</button></li>
              </ul>
            </div>

            {/* ================= MOBILE TOGGLE ================= */}
            <button
              className={`header__btn ${mobileOpen ? 'header__btn--active' : ''}`}
              type="button"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              style={{ color: 'var(--default-color)' }}
              onClick={(e) => { e.stopPropagation(); setMobileOpen(prev => !prev); setOpenDropdown(null); setMobileSearchOpen(false) }}
            >
              <span />
              <span />
              <span />
            </button>

          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVBAR ================= */}
      <MobileNavbar
        open={mobileOpen}
        onClose={() => { setMobileOpen(false); setOpenDropdown(null); setMobileSearchOpen(false) }}
      />

      {/* Mobile Search Popup with Animation */}
            <div
              className={`header__mobile-search-popup ${
                mobileSearchOpen ? 'open' : ''
              }`}
            >
              {mobileSearchOpen && <SearchForm onClose={() => setMobileSearchOpen(false)} />}
            </div>
    </header>
  )
}

export default Header
