// src/layout/Footer.tsx
import React from "react";
import navbarIcon from '../assets/icons/nav_logo.png'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer__content">
              <a href="/" className="footer__logo">
                <img src={navbarIcon} alt="ToxicwasteIcon" />
              </a>

              <span className="footer__copyright">
                © toxicwaste, 2019—{currentYear} <br />
                Create by <a href="https://themeforest.net/user/dmitryvolkov/portfolio" target="_blank" rel="noopener noreferrer">God's-Technologies</a>
              </span>

              <nav className="footer__nav">
                <a href="/about">About Us</a>
                <a href="/contacts">Contacts</a>
                <a href="/privacy">Privacy policy</a>
              </nav>

              <button className="footer__back" type="button" onClick={handleBackToTop} aria-label="Back to top">
                <i className="bi bi-arrow-up" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
