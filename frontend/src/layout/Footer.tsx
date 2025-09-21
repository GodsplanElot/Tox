// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <div className="container text-center">
        <p className="mb-0">© {new Date().getFullYear()} MyMovieApp. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
