import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookmark, FiFilm, FiLock, FiX } from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/useAuth";
import type { WatchlistItem } from "../types/watchlist";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { chipClass } from "../components/ui/chipClass";
import { buttonClass } from "../components/ui/buttonClass";
import { hideBrokenImage } from "../components/ui/hideBrokenImage";

type Filter = "all" | "movie" | "series";

const Watchlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

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
      <EmptyState
        icon={<FiLock className="size-6" />}
        title="Your watchlist is private"
        message="Sign in to save movies and series for later."
        actionText="Back to home"
        onAction={() => navigate("/")}
      />
    );
  }

  const visible = items.filter(
    (item) => item.content_object_detail && (filter === "all" || item.content_object_detail.type === filter),
  );
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "movie", label: "Movies", count: stats.movies },
    { key: "series", label: "Series", count: stats.series },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader kicker="Personal library" title="Watchlist" description="Saved films and series, collected in one place.">
        {items.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter watchlist">
            {filters.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={filter === option.key}
                onClick={() => setFilter(option.key)}
                className={chipClass(filter === option.key)}
              >
                {option.label}
                <span className="text-[11px] tabular-nums opacity-60">{option.count}</span>
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="page-x mt-8">
        {error && (
          <div role="alert" className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-400/25 ring-inset">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/[0.04] text-fg-muted ring-1 ring-white/[0.08]">
              <FiBookmark className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-lg font-semibold text-white">No saved titles yet</h2>
            <p className="mt-2 max-w-sm text-sm text-fg-muted">
              Add movies or series from their detail pages and they will appear here.
            </p>
            <Link to="/" className={buttonClass("secondary", "md", "mt-6")}>
              Browse titles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8">
            {visible.map((item) => {
              const detail = item.content_object_detail;
              if (!detail) return null;
              const href = detail.type === "series" ? `/series/${detail.slug}` : `/movies/${detail.slug}`;

              return (
                <article key={item.id} className="group relative min-w-0 animate-fade-up">
                  <Link to={href} className="block outline-none">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/[0.08] transition group-hover:ring-white/20">
                      {detail.poster ? (
                        <img
                          onError={hideBrokenImage}
                          src={api.getMediaUrl(detail.poster)}
                          alt={detail.title}
                          loading="lazy"
                          className="size-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-fg-subtle">
                          <FiFilm className="size-6" />
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white/90 uppercase backdrop-blur-md">
                        {detail.type}
                      </span>
                    </div>
                    <h3 className="mt-2.5 truncate px-0.5 text-[13.5px] font-semibold text-white/90 group-hover:text-white">
                      {detail.title}
                    </h3>
                    <time dateTime={item.added_at} className="block px-0.5 text-xs text-fg-subtle">
                      Saved {new Date(item.added_at).toLocaleDateString()}
                    </time>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${detail.title} from watchlist`}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/55 text-white/85 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-red-500/80 hover:text-white [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"
                  >
                    <FiX className="size-4" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
