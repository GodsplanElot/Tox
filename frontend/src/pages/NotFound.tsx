import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import "./NotFound.css";

const NotFound = () => {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-signal" aria-hidden="true">
        <span>404</span>
      </div>

      <div className="not-found-copy">
        <span className="not-found-kicker">Signal lost</span>
        <h1 id="not-found-title">This page leaked out of the vault.</h1>
        <p>
          The link is broken, moved, or never made it into the catalog. Return
          to the feed or search for something worth watching.
        </p>
      </div>

      <nav className="not-found-actions" aria-label="404 actions">
        <Link to="/" className="not-found-action not-found-action--primary">
          <FaArrowLeft />
          Home
        </Link>
        <Link to="/search" className="not-found-action">
          <FaSearch />
          Search
        </Link>
      </nav>
    </section>
  );
};

export default NotFound;
