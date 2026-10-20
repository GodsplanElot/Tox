import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { buttonClass } from "../components/ui/buttonClass";

const NotFound = () => {
  return (
    <section
      aria-labelledby="not-found-title"
      className="page-x relative isolate grid min-h-[75svh] animate-fade-in place-items-center overflow-hidden py-16 text-center"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(9rem,38vw,22rem)] leading-none font-bold tracking-tighter text-white/[0.035]"
      >
        404
      </span>
      <div className="flex max-w-md flex-col items-center">
        <span className="text-[11px] font-bold tracking-[0.2em] text-accent uppercase">Signal lost</span>
        <h1 id="not-found-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          This page leaked out of the vault.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          The link is broken, moved, or never made it into the catalog. Return to the feed or search for something worth
          watching.
        </p>
        <nav aria-label="404 actions" className="mt-8 flex gap-2.5">
          <Link to="/" className={buttonClass("primary")}>
            <FiArrowLeft /> Home
          </Link>
          <Link to="/search" className={buttonClass("secondary")}>
            <FiSearch /> Search
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default NotFound;
