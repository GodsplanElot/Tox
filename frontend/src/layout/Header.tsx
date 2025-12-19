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
            <li className={`header__nav-item ${openDropdown === 'home' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'home' ? null : 'home') }}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'home'}>
                Moviez <i className="bi bi-chevron-down"></i>
              </button>
              {openDropdown === 'home' && (
                <ul className="dropdown-menu header__dropdown-menu">
                  <li><Link to="/">HollyWood</Link></li>
                  <li><Link to="/home2">Home style 2</Link></li>
                  <li><Link to="/home3">Home style 3</Link></li>
                </ul>
              )}
            </li>

            <li className={`header__nav-item ${openDropdown === 'catalog' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'catalog' ? null : 'catalog') }}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'catalog'}>
                Catalog <i className="ti ti-chevron-down"></i>
              </button>
              {openDropdown === 'catalog' && (
                <ul className="dropdown-menu header__dropdown-menu">
                  <li><Link to="/catalog">Catalog style 1</Link></li>
                  <li><Link to="/catalog2">Catalog style 2</Link></li>
                  <li><Link to="/details">Details Movie</Link></li>
                  <li><Link to="/details2">Details TV Series</Link></li>
                </ul>
              )}
            </li>

            <li className="header__nav-item">
              <Link to="/pricing" className="header__nav-link">Pricing plan</Link>
            </li>

            <li className={`header__nav-item ${openDropdown === 'pages' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'pages' ? null : 'pages') }}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'pages'}>
                Pages <i className="ti ti-chevron-down"></i>
              </button>
              {openDropdown === 'pages' && (
                <ul className="dropdown-menu header__dropdown-menu">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/actor">Actor</Link></li>
                  <li><Link to="/contacts">Contacts</Link></li>
                  <li><Link to="/faq">Help center</Link></li>
                  <li><Link to="/privacy">Privacy policy</Link></li>
                </ul>
              )}
            </li>

            <li className={`header__nav-item ${openDropdown === 'more' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'more' ? null : 'more') }}>
              <button type="button" className="header__nav-link header__nav-link--more" aria-expanded={openDropdown === 'more'}>
                <i className="ti ti-dots"></i>
              </button>
              {openDropdown === 'more' && (
                <ul className="dropdown-menu header__dropdown-menu">
                  <li><Link to="/signin">Sign in</Link></li>
                  <li><Link to="/signup">Sign up</Link></li>
                  <li><Link to="/forgot">Forgot password</Link></li>
                  <li><Link to="/404">404 Page</Link></li>
                </ul>
              )}
            </li>
          </ul>

          {/* auth / search / profile */}
          <div className="header__auth">
            <SearchForm />

            <div className={`header__lang ${openDropdown === 'lang' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'lang' ? null : 'lang') }}>
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

            <div className={`header__profile ${openDropdown === 'profile' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'profile' ? null : 'profile') }}>
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


