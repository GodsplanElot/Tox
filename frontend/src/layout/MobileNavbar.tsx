import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'

type Props = {
  open: boolean
  onClose: () => void
}

const MobileNavbar: React.FC<Props> = ({ open, onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null)

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
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="mobile-navbar">
      <div className="mobile-navbar__backdrop" onClick={onClose} />
      <div className="mobile-navbar__panel" ref={panelRef} role="dialog" aria-modal="true">
        <button className="mobile-navbar__close" onClick={onClose} aria-label="Close menu">×</button>
        <SearchForm onClose={onClose} />
        <ul className="mobile-navbar__links">
          <li><Link to="/movies" onClick={onClose}>Movies</Link></li>
          <li><Link to="/tv-series" onClick={onClose}>TV Series</Link></li>
          <li><Link to="/animations" onClick={onClose}>Animations</Link></li>
          <li><Link to="/anime-series" onClick={onClose}>Anime Series</Link></li>
          <li><Link to="/about" onClick={onClose}>About</Link></li>
          <li><Link to="/contact" onClick={onClose}>Contact</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default MobileNavbar
