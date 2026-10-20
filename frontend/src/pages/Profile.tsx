import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookmark, FiCompass, FiLogOut, FiUser } from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/useAuth";
import type { WatchlistItem } from "../types/watchlist";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { buttonClass } from "../components/ui/buttonClass";

const getDisplayName = (user: NonNullable<ReturnType<typeof useAuth>["user"]>) => {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return fullName || user.username || user.email || "Viewer";
};

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLoadingStats(false);
      return;
    }

    const loadStats = async () => {
      try {
        const watchlist = await api.getWatchlist();
        setItems(watchlist);
      } catch (error) {
        console.error("Unable to load profile watchlist stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [isAuthenticated, isLoading]);

  const stats = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.content_object_detail?.type === "movie") acc.movies += 1;
        if (item.content_object_detail?.type === "series") acc.series += 1;
        return acc;
      },
      { total: 0, movies: 0, series: 0 },
    );
  }, [items]);

  if (isLoading || loadingStats) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return (
      <EmptyState
        icon={<FiUser className="size-6" />}
        title="Profile is private"
        message="Sign in to view your account details and saved titles."
        actionText="Back to home"
        onAction={() => navigate("/")}
      />
    );
  }

  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);
  const fields = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Name", value: [user.first_name, user.last_name].filter(Boolean).join(" ") },
  ];
  const statItems = [
    { label: "Saved", value: stats.total },
    { label: "Movies", value: stats.movies },
    { label: "Series", value: stats.series },
  ];
  const panelClass = "rounded-2xl bg-white/[0.025] p-5 ring-1 ring-white/[0.07] ring-inset sm:p-6";

  return (
    <div className="page-x relative isolate animate-fade-in pt-10 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-[5%] -z-10 size-[480px] rounded-full bg-accent/[0.08] blur-[110px]"
      />

      <header className="flex items-center gap-4 sm:gap-6">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-ember font-display text-xl font-bold text-ink-950 shadow-[0_12px_40px_-12px] shadow-accent/60 sm:size-20 sm:text-2xl"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.2em] text-accent uppercase">Viewer profile</p>
          <h1 className="mt-1 truncate font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            {displayName}
          </h1>
          <p className="truncate text-sm text-fg-muted">{user.email || user.username}</p>
        </div>
      </header>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className={panelClass} aria-labelledby="profile-account">
          <h2 id="profile-account" className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-fg-subtle uppercase">
            <FiUser className="size-3.5" /> Account
          </h2>
          <dl className="mt-4 divide-y divide-white/[0.06]">
            {fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between gap-6 py-3">
                <dt className="text-[13px] text-fg-muted">{field.label}</dt>
                <dd className="min-w-0 truncate text-sm font-semibold text-white">{field.value || "Not set"}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={panelClass} aria-labelledby="profile-library">
          <h2 id="profile-library" className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-fg-subtle uppercase">
            <FiBookmark className="size-3.5" /> Library
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {statItems.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/[0.03] px-3 py-4 text-center">
                <p className="font-display text-2xl font-semibold text-white tabular-nums">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-fg-subtle">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav aria-label="Profile quick actions" className="mt-6 flex flex-wrap gap-2.5">
        <Link to="/watchlist" className={buttonClass("secondary")}>
          <FiBookmark /> Watchlist
        </Link>
        <Link to="/" className={buttonClass("secondary")}>
          <FiCompass /> Browse
        </Link>
        <button type="button" onClick={logout} className={buttonClass("ghost", "md", "hover:text-red-300")}>
          <FiLogOut /> Sign out
        </button>
      </nav>
    </div>
  );
};

export default Profile;
