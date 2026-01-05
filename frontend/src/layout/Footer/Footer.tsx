import { Link } from "react-router-dom";
import "./Footer.css";
import logo from '../../assets/icons/nav_logo.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <img
            src={logo}
            alt="MyApp Logo"
            className="footer-logo"
          />
          <p className="footer-description">
            Discover, explore, and stream the latest movies and series in one
            place.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/trending">Trending</Link>
        </div>

        {/* Support / Info */}
        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
