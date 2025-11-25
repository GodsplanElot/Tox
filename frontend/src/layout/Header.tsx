import React, { useState } from "react";
import { Link } from "react-router-dom";


const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={`header ${mobileOpen ? "header--active" : ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">

              {/* Logo */}
              <Link to="/" className="header__logo">
                <img src="#" alt="Logo" />
              </Link>

              {/* Navbar */}
              <ul className="header__nav">

                {/* Categories */}
                <li className="header__nav-item dropdown">
                  <button
                    className="header__nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Categories <i className="ti ti-chevron-down"></i>
                  </button>

                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/catalog">Catalog style 1</Link></li>
                    <li><Link to="/catalog2">Catalog style 2</Link></li>
                    <li><Link to="/details">Details Movie</Link></li>
                    <li><Link to="/details2">Details TV Series</Link></li>
                  </ul>
                </li>

                {/* About */}
                <li className="header__nav-item dropdown">
                  <button
                    className="header__nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    About☣ <i className="ti ti-chevron-down"></i>
                  </button>

                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contacts</Link></li>
                    <li><Link to="/faq">Help center</Link></li>
                    <li><Link to="/privacy">Privacy policy</Link></li>
                  </ul>
                </li>

                {/* More */}
                <li className="header__nav-item dropdown">
                  <button
                    className="header__nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-dots"></i>
                  </button>

                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/radioactive">Radioactive</Link></li>
                    <li><Link to="/hazardtv">HazardTV</Link></li>
                    <li><Link to="/wastecoin">Waste☣Coin</Link></li>
                    <li><Link to="/movie-request">MovieRequest</Link></li>
                  </ul>
                </li>
              </ul>

              {/* Auth Section */}
              <div className="header__auth">

                {/* Search */}
                <form className={`header__search ${searchOpen ? "header__search--active" : ""}`}>
                  <input
                    className="header__search-input"
                    type="text"
                    placeholder="Search..."
                  />

                  <button
                    className="header__search-button"
                    type="button"
                  >
                    <i className="ti ti-search"></i>
                  </button>

                  <button
                    className="header__search-close"
                    type="button"
                    onClick={() => setSearchOpen(false)}
                  >
                    <i className="ti ti-x"></i>
                  </button>
                </form>

                <button
                  className="header__search-btn"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                >
                  <i className="ti ti-search"></i>
                </button>

                {/* Profile Dropdown */}
                <div className="header__profile dropdown">
                  <button
                    className="header__sign-in header__sign-in--user dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-user"></i>
                    <span>Nickname</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                    <li><Link to="/profile"><i className="ti ti-ghost"></i> Profile</Link></li>
                    <li><Link to="/subscription"><i className="ti ti-stereo-glasses"></i> Subscription</Link></li>
                    <li><Link to="/favorites"><i className="ti ti-bookmark"></i> Favorites</Link></li>
                    <li><Link to="/settings"><i className="ti ti-settings"></i> Settings</Link></li>
                    <li><Link to="/logout"><i className="ti ti-logout"></i> Logout</Link></li>
                  </ul>
                </div>
              </div>

              {/* Hamburger */}
              <button
                className={`header__btn ${mobileOpen ? "header__btn--active" : ""}`}
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
