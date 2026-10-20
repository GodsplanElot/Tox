import { Link } from "react-router-dom";
import logo from "../../assets/icons/nav_logo.png";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { to: "/", label: "Home" },
      { to: "/movies", label: "Movies" },
      { to: "/series", label: "TV Series" },
      { to: "/categories", label: "Categories" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { to: "/search", label: "Search" },
      { to: "/categories", label: "Genres" },
      { to: "/watchlist", label: "Watchlist" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { to: "/legal/privacy-policy", label: "Privacy Policy" },
      { to: "/legal/terms-of-use", label: "Terms of Use" },
      { to: "/legal/dmca", label: "DMCA / Copyright" },
      { to: "/legal/contact", label: "Contact" },
      { to: "/legal/about", label: "About" },
      { to: "/legal/content-rights", label: "Content Rights" },
    ],
  },
];

const Footer = () => {
  return (
    // Extra bottom padding on mobile keeps the last row clear of the floating dock.
    <footer className="mt-16 border-t border-white/[0.06] bg-ink-950 pb-[calc(112px+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="page-x mx-auto grid max-w-[1600px] gap-10 pt-12 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <img src={logo} alt="ToxicReels" className="h-7 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-fg-subtle">
            Discover, explore, and stream the latest movies and series in one place.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="text-[11px] font-bold tracking-[0.16em] text-fg-muted uppercase">{column.heading}</h4>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.label}`}>
                  <Link to={link.to} className="text-sm text-fg-subtle transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="page-x mx-auto max-w-[1600px] border-t border-white/[0.05] py-6 text-xs text-fg-subtle">
        &copy; {new Date().getFullYear()} ToxicReels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
