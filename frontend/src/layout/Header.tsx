import React from "react";
import { Link } from "react-router-dom";
import navbarIcon from '../assets/icons/nav_logo.png';


const Header: React.FC = () => {
  return (
    <header className="header">
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
                <li className="header__nav-item dropdown">
                  <button
                    className="header__nav-link"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories <i className="ti ti-chevron-down"></i>
                  </button>

                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/catalog1">Catalog style 1</Link></li>
                    <li><Link to="/catalog2">Catalog style 2</Link></li>
                    <li><Link to="/details">Details Movie</Link></li>
                    <li><Link to="/details-tv">Details TV Series</Link></li>
                  </ul>
                </li>

                {/* About */}
                <li className="header__nav-item dropdown">
                  <button
                    className="header__nav-link"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    About☣ <i className="ti ti-chevron-down"></i>
                  </button>

                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contacts</Link></li>
                    <li><Link to="/faq">Help Center</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                  </ul>
                </li>

                {/* More */}
                <li className="header__nav-item dropdown">
                  <button
                    className="header__nav-link header__nav-link--more"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
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

              {/* Auth / Search / Profile */}
              <div className="header__auth">

                {/* Search Bar */}
                <form className="header__search">
                  <input
                    className="header__search-input"
                    type="text"
                    placeholder="Search..."
                  />
                  <button className="header__search-button" type="button">
                    <i className="ti ti-search"></i>
                  </button>
                  <button className="header__search-close" type="button">
                    <i className="ti ti-x"></i>
                  </button>
                </form>

                <button className="header__search-btn" type="button">
                  <i className="ti ti-search"></i>
                </button>

                {/* Profile Dropdown */}
                <div className="header__profile dropdown">
                  <button
                    className="header__sign-in header__sign-in--user"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="ti ti-user"></i>
                    <span>Nickname</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                    <li>
                      <Link to="/profile">
                        <i className="ti ti-ghost"></i> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/subscription">
                        <i className="ti ti-stereo-glasses"></i> Subscription
                      </Link>
                    </li>
                    <li>
                      <Link to="/favorites">
                        <i className="ti ti-bookmark"></i> Favorites
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings">
                        <i className="ti ti-settings"></i> Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/logout">
                        <i className="ti ti-logout"></i> Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mobile Hamburger */}
              <button className="header__btn" type="button">
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
