import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'

type Props = {
  open: boolean
  onClose: () => void
  /** If true, allow body to keep scrolling while offcanvas is open (Bootstrap's data-bs-scroll) */
  allowBodyScroll?: boolean
  /** If true, render a backdrop that closes on click (Bootstrap's backdrop) */
  showBackdrop?: boolean
}

const MobileNavbar: React.FC<Props> = ({ open, onClose, allowBodyScroll = true, showBackdrop = false }) => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    if (open && !allowBodyScroll) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open, allowBodyScroll])

  if (!open) return null

  return (
    <div className={`offcanvas offcanvas-start ${open ? 'show' : ''}`} tabIndex={-1} aria-labelledby="offcanvasLabel" aria-hidden={!open}>
      {showBackdrop && <div className="offcanvas-backdrop" onClick={onClose} />}

      <div className="offcanvas-panel" ref={panelRef} role="dialog" aria-modal={!allowBodyScroll} onClick={(e) => e.stopPropagation()}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLabel">Offcanvas</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="offcanvas-body">
          <p>Try scrolling the rest of the page to see this option in action.</p>
          <SearchForm onClose={onClose} />

          <ul className="header__nav mb-3">
            <li className={`header__nav-item ${openDropdown === 'home' ? 'show' : ''}`}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'home'} onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'home' ? null : 'home') }}>
                Categories <i className="bi bi-chevron-down"></i>
              </button>
              <ul className={`dropdown-menu header__dropdown-menu ${openDropdown === 'home' ? 'show' : ''}`}>
                <li><Link to="/" onClick={onClose}>HollyWood</Link></li>
                <li><Link to="/home2" onClick={onClose}>Bollywood</Link></li>
                <li><Link to="/home3" onClick={onClose}>Nollywood</Link></li>
              </ul>
            </li>
          </ul>

          <div className="header__auth mb-3">
            <div className={`header__lang ${openDropdown === 'lang' ? 'show' : ''}`} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpenDropdown(openDropdown === 'lang' ? null : 'lang') }}>
              <button type="button" className="header__nav-link" aria-expanded={openDropdown === 'lang'}>
                EN <i className="bi bi-chevron-down"></i>
              </button>
              {openDropdown === 'lang' && (
                <ul className="dropdown-menu header__dropdown-menu">
                  <li><button type="button" onClick={() => setOpenDropdown(null)}>English</button></li>
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
                  <li><Link to="/profile" onClick={onClose}><i className="ti ti-ghost"></i>Profile</Link></li>
                  <li><Link to="/subscription" onClick={onClose}><i className="ti ti-stereo-glasses"></i>Subscription</Link></li>
                  <li><Link to="/favorites" onClick={onClose}><i className="ti ti-bookmark"></i>Favorites</Link></li>
                  <li><Link to="/settings" onClick={onClose}><i className="ti ti-settings"></i>Settings</Link></li>
                  <li><button type="button" onClick={() => { setOpenDropdown(null); onClose() }}><i className="ti ti-logout"></i>Logout</button></li>
                </ul>
              )}
            </div>
          </div>

          <ul className="mobile-navbar__links list-unstyled">
            <li><Link to="/movies" onClick={onClose}>Movies</Link></li>
            <li><Link to="/tv-series" onClick={onClose}>TV Series</Link></li>
            <li><Link to="/animations" onClick={onClose}>Animations</Link></li>
            <li><Link to="/anime-series" onClick={onClose}>Anime Series</Link></li>
            <li><Link to="/about" onClick={onClose}>About</Link></li>
            <li><Link to="/contact" onClick={onClose}>Contact</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar
