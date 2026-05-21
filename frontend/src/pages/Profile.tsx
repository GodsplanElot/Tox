import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookmark, FaCompass, FaDoorOpen, FaEnvelope, FaUser } from "react-icons/fa";
import { api } from "../services/api";
import { useAuth } from "../context/useAuth";
import type { WatchlistItem } from "../types/watchlist";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "./Profile.css";

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
      <section className="profile-page profile-page--center">
        <div className="profile-empty">
          <FaUser />
          <h1>Profile is private</h1>
          <p>Sign in to view your account details and saved titles.</p>
          <button type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  return (
    <section className="profile-page">
      <header className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="profile-identity">
          <span>Viewer Profile</span>
          <h1>{displayName}</h1>
          <p>{user.email || user.username}</p>
        </div>
      </header>

      <div className="profile-grid">
        <article className="profile-panel profile-panel--account">
          <div className="profile-panel__head">
            <span>Account</span>
            <FaUser />
          </div>
          <dl className="profile-fields">
            <div>
              <dt>Username</dt>
              <dd>{user.username || "Not set"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email || "Not set"}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{[user.first_name, user.last_name].filter(Boolean).join(" ") || "Not set"}</dd>
            </div>
          </dl>
        </article>

        <article className="profile-panel profile-panel--stats">
          <div className="profile-panel__head">
            <span>Library</span>
            <FaBookmark />
          </div>
          <div className="profile-stats">
            <span>
              <strong>{stats.total}</strong>
              Saved
            </span>
            <span>
              <strong>{stats.movies}</strong>
              Movies
            </span>
            <span>
              <strong>{stats.series}</strong>
              Series
            </span>
          </div>
        </article>
      </div>

      <nav className="profile-actions" aria-label="Profile quick actions">
        <Link to="/watchlist">
          <FaBookmark />
          Watchlist
        </Link>
        <Link to="/">
          <FaCompass />
          Browse
        </Link>
        <a href={`mailto:${user.email}`}>
          <FaEnvelope />
          Email
        </a>
        <button type="button" onClick={logout}>
          <FaDoorOpen />
          Logout
        </button>
      </nav>
    </section>
  );
};

export default Profile;
