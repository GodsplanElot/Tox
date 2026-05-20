import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/icons/nav_logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="TOX Logo" className="footer-logo" />
          <p className="footer-description">
            Discover, explore, and stream the latest movies and series in one
            place.
          </p>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/series">Series</Link>
        </div>

        <div className="footer-links">
          <h4>Discover</h4>
          <Link to="/search">Search</Link>
          <Link to="/categories">Genres</Link>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TOX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
