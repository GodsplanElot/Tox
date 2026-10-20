import { useCallback, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiBookmark, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import SearchForm from "../components/SearchForm";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/useAuth";
import MobileNavBar from "./MobileNavBar";
import logo from "../assets/icons/nav_logo.png";
import { cn } from "../components/ui/cn";
import { buttonClass } from "../components/ui/buttonClass";
import { useDismiss } from "../components/ui/useDismiss";

type AuthTab = "login" | "signup";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/movies", label: "Movies" },
  { to: "/series", label: "TV Series" },
  { to: "/categories", label: "Categories" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-200",
    isActive
      ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
      : "text-fg-muted hover:text-white",
  );

const menuItemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-fg-muted transition hover:bg-white/[0.06] hover:text-white";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDismiss(menuRef, menuOpen, closeMenu);

  const openAuth = (tab: AuthTab) => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  const displayName = user?.first_name || user?.username || user?.email || "Account";
  const accountLabel = user?.email || user?.username || "Signed in";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const avatar = (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-ember font-display text-[11px] font-bold text-ink-950"
    >
      {initials}
    </span>
  );

  return (
    <>
      <header className="sticky top-0 z-[1040] border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 lg:h-16 lg:px-8">
          <Link to="/" className="shrink-0" aria-label="ToxicReels home">
            <img src={logo} alt="ToxicReels" className="h-7 w-auto lg:h-8" />
          </Link>

          <nav
            aria-label="Primary"
            className="ml-4 hidden items-center gap-0.5 rounded-full bg-white/[0.03] p-1 ring-1 ring-white/[0.06] lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink to="/watchlist" className={navLinkClass}>
                Watchlist
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden lg:block">
              <SearchForm />
            </div>

            {isAuthenticated ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                  className={cn(
                    "flex items-center gap-2 rounded-full p-0.5 transition lg:py-1 lg:pr-3 lg:pl-1",
                    "ring-1 ring-white/10 ring-inset hover:bg-white/[0.06]",
                    menuOpen && "bg-white/[0.06] ring-white/20",
                  )}
                >
                  {avatar}
                  <span className="hidden max-w-32 truncate text-[13px] font-semibold text-white lg:block">
                    {displayName}
                  </span>
                  <FiChevronDown
                    aria-hidden="true"
                    className={cn("hidden size-3.5 text-fg-muted transition lg:block", menuOpen && "rotate-180")}
                  />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute top-[calc(100%+10px)] right-0 w-60 origin-top-right animate-scale-in rounded-2xl p-1.5 shadow-2xl shadow-black/60 glass"
                  >
                    <div className="flex items-center gap-3 px-2.5 pt-2 pb-3">
                      {avatar}
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-white">{displayName}</p>
                        <p className="truncate text-xs text-fg-subtle">{accountLabel}</p>
                      </div>
                    </div>
                    <div className="mb-1 h-px bg-white/[0.06]" />
                    <Link to="/profile" role="menuitem" className={menuItemClass} onClick={closeMenu}>
                      <FiUser className="size-4" /> Profile
                    </Link>
                    <Link to="/watchlist" role="menuitem" className={menuItemClass} onClick={closeMenu}>
                      <FiBookmark className="size-4" /> Watchlist
                    </Link>
                    <div className="my-1 h-px bg-white/[0.06]" />
                    <button
                      type="button"
                      role="menuitem"
                      className={menuItemClass}
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                    >
                      <FiLogOut className="size-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className={buttonClass("ghost", "sm", "hidden sm:inline-flex")}
                  onClick={() => openAuth("login")}
                >
                  Sign in
                </button>
                <button type="button" className={buttonClass("primary", "sm")} onClick={() => openAuth("signup")}>
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileNavBar
        isAuthenticated={isAuthenticated}
        onLoginClick={() => openAuth("login")}
        onLogout={logout}
      />

      <AuthModal show={showAuth} onHide={() => setShowAuth(false)} defaultTab={authTab} />
    </>
  );
};

export default Header;
