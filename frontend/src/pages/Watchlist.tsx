import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookmark, FaFilm, FaTrash } from "react-icons/fa";
import { api } from "../services/api";
import { useAuth } from "../context/useAuth";
import type { WatchlistItem } from "../types/watchlist";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "./Watchlist.css";

const Watchlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadWatchlist = async () => {
      try {
        setError("");
        const watchlist = await api.getWatchlist();
        setItems(watchlist);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your watchlist.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
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

  const removeItem = async (itemId: number) => {
    const previousItems = items;
    setItems((current) => current.filter((item) => item.id !== itemId));

    try {
      await api.removeFromWatchlist(itemId);
    } catch (removeError) {
      setItems(previousItems);
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove this item.",
      );
    }
  };

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <section className="watchlist-page watchlist-page--center">
        <div className="watchlist-empty">
          <FaBookmark />
          <h1>Your watchlist is private</h1>
          <p>Sign in to save movies and series for later.</p>
          <button type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="watchlist-page">
      <header className="watchlist-hero">
        <div>
          <span className="watchlist-kicker">Personal Library</span>
          <h1>Watchlist</h1>
          <p>Saved films and series, collected in one place.</p>
        </div>

        <div className="watchlist-stats" aria-label="Watchlist summary">
          <span>
            <strong>{stats.total}</strong>
            Total
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
      </header>

      {error && <div className="watchlist-error">{error}</div>}

      {items.length === 0 ? (
        <div className="watchlist-empty">
          <FaFilm />
          <h2>No saved titles yet</h2>
          <p>Add movies or series from their detail pages and they will appear here.</p>
          <Link to="/">Browse titles</Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {items.map((item) => {
            const detail = item.content_object_detail;
            if (!detail) return null;

            const href =
              detail.type === "series"
                ? `/series/${detail.slug}`
                : `/movies/${detail.slug}`;

            return (
              <article key={item.id} className="watchlist-card">
                <Link to={href} className="watchlist-card__poster">
                  {detail.poster ? (
                    <img src={api.getMediaUrl(detail.poster)} alt={detail.title} />
                  ) : (
                    <div className="watchlist-card__fallback">
                      <FaFilm />
                    </div>
                  )}
                  <span>{detail.type}</span>
                </Link>

                <div className="watchlist-card__body">
                  <Link to={href}>{detail.title}</Link>
                  <time dateTime={item.added_at}>
                    Saved {new Date(item.added_at).toLocaleDateString()}
                  </time>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Watchlist;
