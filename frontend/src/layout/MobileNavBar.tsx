import { useCallback, useRef, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBookmark,
  FiFilm,
  FiGrid,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMoreHorizontal,
  FiSearch,
  FiTv,
  FiUser,
} from "react-icons/fi";
import { cn } from "../components/ui/cn";
import { useDismiss } from "../components/ui/useDismiss";

type Props = {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
};

const TABS = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/movies", label: "Movies", icon: FiFilm },
  { to: "/series", label: "Series", icon: FiTv },
  { to: "/search", label: "Search", icon: FiSearch },
];

const tabClass = (active: boolean) =>
  cn(
    "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[10.5px] font-semibold transition-colors duration-200",
    active ? "text-white" : "text-fg-subtle hover:text-fg-muted",
  );

const TabIcon = ({ active, children }: { active: boolean; children: ReactNode }) => (
  <span
    className={cn(
      "grid h-7 w-12 place-items-center rounded-full transition-all duration-300 ease-[var(--ease-spring)] [&_svg]:size-[19px]",
      active ? "bg-accent/15 text-accent" : "group-active:scale-90",
    )}
  >
    {children}
  </span>
);

const popoverItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition",
    isActive ? "bg-white/[0.07] text-white" : "text-fg-muted hover:bg-white/[0.05] hover:text-white",
  );

const MobileNavBar = ({ isAuthenticated, onLoginClick, onLogout }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const closeMore = useCallback(() => setShowMore(false), []);
  useDismiss(moreRef, showMore, closeMore);

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[1040] lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch gap-0.5 rounded-[26px] border border-white/[0.08] bg-ink-900/85 p-1.5 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8)] backdrop-blur-2xl backdrop-saturate-150">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => tabClass(isActive)}>
            {({ isActive }) => (
              <>
                <TabIcon active={isActive}>
                  <Icon aria-hidden="true" />
                </TabIcon>
                <span className="max-w-full truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div ref={moreRef} className="relative flex min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={showMore}
            aria-haspopup="menu"
            onClick={() => setShowMore((v) => !v)}
            className={tabClass(showMore)}
          >
            <TabIcon active={showMore}>
              <FiMoreHorizontal aria-hidden="true" />
            </TabIcon>
            <span>More</span>
          </button>

          {showMore && (
            <div
              role="menu"
              className="absolute right-0 bottom-[calc(100%+12px)] w-52 origin-bottom-right animate-scale-in rounded-2xl p-1.5 shadow-2xl shadow-black/60 glass"
            >
              <NavLink to="/categories" role="menuitem" className={popoverItemClass} onClick={closeMore}>
                <FiGrid className="size-4" /> Categories
              </NavLink>
              <NavLink to="/watchlist" role="menuitem" className={popoverItemClass} onClick={closeMore}>
                <FiBookmark className="size-4" /> Watchlist
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" role="menuitem" className={popoverItemClass} onClick={closeMore}>
                    <FiUser className="size-4" /> Profile
                  </NavLink>
                  <div className="my-1 h-px bg-white/[0.06]" />
                  <button
                    type="button"
                    role="menuitem"
                    className={popoverItemClass({ isActive: false })}
                    onClick={() => {
                      closeMore();
                      onLogout();
                    }}
                  >
                    <FiLogOut className="size-4" /> Sign out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className={popoverItemClass({ isActive: false })}
                  onClick={() => {
                    closeMore();
                    onLoginClick();
                  }}
                >
                  <FiLogIn className="size-4" /> Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavBar;
