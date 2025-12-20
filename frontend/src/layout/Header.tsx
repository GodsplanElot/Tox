import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import navbarIcon from '../assets/icons/nav_logo.png'
import SearchForm from '../components/SearchForm'
import MobileNavbar from './MobileNavbar'





const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!headerRef.current) return
      if (!headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <header className={`header ${mobileOpen ? 'header--open' : ''}`} ref={headerRef}>
      <div className="container">
        <div className="header__content">

          {/* logo */}
          <Link to="/" className="header__logo">
            <img src={navbarIcon} alt="Logo" />
          </Link>

          {/* desktop nav */}
          <ul className="header__nav">
            <li className={`header__nav-item ${openDropdown === 'home' ? 'show' : ''}`}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'home'} onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'home' ? null : 'home') }}>
                Categories <i className="bi bi-chevron-down"></i>
              </button>
              <ul className={`dropdown-menu header__dropdown-menu ${openDropdown === 'home' ? 'show' : ''}`}>
                <li><Link to="/">HollyWood</Link></li>
                <li><Link to="/home2">Bollywood</Link></li>
                <li><Link to="/home3">Nollywood</Link></li>
              </ul>
            </li>


     
          </ul>

          {/* auth / search / profile */}
          <div className="header__auth">
            <SearchForm />

            <div className={`header__lang ${openDropdown === 'lang' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'lang' ? null : 'lang') }}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'lang'}>
                EN <i className="bi bi-chevron-down"></i>
              </button>
              {openDropdown === 'lang' && (
                <ul className="dropdown-menu header__dropdown-menu">
                  <li><button type="button" onClick={() => setOpenDropdown(null)}>English</button></li>
                  <li><button type="button" onClick={() => setOpenDropdown(null)}>Spanish</button></li>
                  <li><button type="button" onClick={() => setOpenDropdown(null)}>French</button></li>
                </ul>
              )}
            </div>

            <div className={`header__profile ${openDropdown === 'profile' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'profile' ? null : 'profile') }}>
              <button type="button" className="header__sign-in header__sign-in--user" aria-expanded={openDropdown === 'profile'}>
                <i className="bi bi-person-circle"></i>
                <span>Nickname</span>
              </button>
              {openDropdown === 'profile' && (
                <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                  <li><Link to="/profile"><i className="ti ti-ghost"></i>Profile</Link></li>
                  <li><Link to="/subscription"><i className="ti ti-stereo-glasses"></i>Subscription</Link></li>
                  <li><Link to="/favorites"><i className="ti ti-bookmark"></i>Favorites</Link></li>
                  <li><Link to="/settings"><i className="ti ti-settings"></i>Settings</Link></li>
                  <li><button type="button" onClick={() => setOpenDropdown(null)}><i className="ti ti-logout"></i>Logout</button></li>
                </ul>
              )}
            </div>

            <button className={`header__btn ${mobileOpen ? 'is-active' : ''}`} type="button" onClick={(e) => { e.stopPropagation(); const willOpen = !mobileOpen; setMobileOpen(willOpen); if (willOpen) setOpenDropdown(null) }} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      <MobileNavbar open={mobileOpen} onClose={() => { setMobileOpen(false); setOpenDropdown(null) }} />
    </header>
  )
}

export default Header


