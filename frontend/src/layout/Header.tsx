import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import navbarIcon from '../assets/icons/nav_logo.png';
import MobileNavbar from './MobileNavbar'
import SearchForm from '../components/SearchForm'


const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className={`header ${mobileOpen ? 'header--open' : ''}`} ref={headerRef}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">

              {/* Logo */}
              <Link to="/" className="header__logo">
                <img src={navbarIcon} alt="Navbar Icon" className="navbar-icon" />
              </Link>

              {/* Navigation */}
              <ul className="header__nav">

                {/* Categories */}
                <li className={`header__nav-item dropdown ${openDropdown === 'categories' ? 'show' : ''}`}>
                  <button
                    className="header__nav-link"
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'categories' ? null : 'categories'); }}
                    aria-expanded={openDropdown === 'categories'}
                  >
                        <i className="ti ti-layout-grid mr-2" aria-hidden="true"></i>
                        <span>Categories</span>
                  </button>

                  <ul className={`dropdown-menu header__dropdown-menu ${openDropdown === 'categories' ? 'show' : ''}`}>
                    <li><Link to="/movies"><i className="ti ti-video"></i> Movies</Link></li>
                    <li><Link to="/tv-series"><i className="ti ti-tv"></i> Tv Series</Link></li>
                    <li><Link to="/animations"><i className="ti ti-paint-bucket"></i> Animations</Link></li>
                    <li><Link to="/anime-series"><i className="ti ti-star"></i> Anime Series</Link></li>
                  </ul>
                </li>

                {/* About */}
                <li className={`header__nav-item dropdown ${openDropdown === 'about' ? 'show' : ''}`}>
                  <button
                    className="header__nav-link"
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'about' ? null : 'about'); }}
                    aria-expanded={openDropdown === 'about'}
                  >
                    About☣ <i className="ti ti-chevron-down"></i>
                  </button>

                  <ul className={`dropdown-menu header__dropdown-menu ${openDropdown === 'about' ? 'show' : ''}`}>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contacts</Link></li>
                    <li><Link to="/faq">Help Center</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                  </ul>
                </li>

                {/* More */}
                <li className={`header__nav-item dropdown ${openDropdown === 'more' ? 'show' : ''}`}>
                  <button
                    className="header__nav-link header__nav-link--more"
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'more' ? null : 'more'); }}
                    aria-expanded={openDropdown === 'more'}
                  >
                    <i className="ti ti-dots"></i>
                  </button>

                  <ul className={`dropdown-menu header__dropdown-menu ${openDropdown === 'more' ? 'show' : ''}`}>
                    <li><Link to="/radioactive">Radioactive</Link></li>
                    <li><Link to="/hazardtv">HazardTV</Link></li>
                    <li><Link to="/wastecoin">Waste☣Coin</Link></li>
                    <li><Link to="/movie-request">MovieRequest</Link></li>
                  </ul>
                </li>

              </ul>

              {/* Auth / Search / Profile */}
              <div className="header__auth">

                {/* Search Bar */}
                <SearchForm />

                <button className="header__search-btn" type="button">
                  <i className="ti ti-search"></i>
                </button>

                {/* Profile Dropdown (React-controlled) */}
                <div className="header__profile">
                  <button
                    type="button"
                    className="header__sign-in header__sign-in--user"
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'profile' ? null : 'profile'); }}
                    aria-expanded={openDropdown === 'profile'}
                    aria-haspopup="true"
                  >
                    <svg className="header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z" />
                    </svg>
                    <span>SIGN IN</span>
                  </button>

                  <ul className={`dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user ${openDropdown === 'profile' ? 'show' : ''}`}>
                    <li>
                      <Link to="/profile" onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}>
                        <i className="ti ti-ghost"></i> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/subscription" onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}>
                        <i className="ti ti-stereo-glasses"></i> Subscription
                      </Link>
                    </li>
                    <li>
                      <Link to="/favorites" onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}>
                        <i className="ti ti-bookmark"></i> Favorites
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}>
                        <i className="ti ti-settings"></i> Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/logout" onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}>
                        <i className="ti ti-logout"></i> Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mobile Hamburger */}
              <button
                className={`header__btn ${mobileOpen ? 'is-active' : ''}`}
                type="button"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={(e) => { e.stopPropagation(); setMobileOpen(!mobileOpen); }}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              {/* Mobile nav overlay (React) */}
              <MobileNavbar open={mobileOpen} onClose={() => { setMobileOpen(false); setOpenDropdown(null); }} />

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
