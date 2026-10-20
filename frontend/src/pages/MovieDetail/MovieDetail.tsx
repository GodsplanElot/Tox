import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiFilm, FiPlus, FiShare2 } from "react-icons/fi";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import { api } from "../../services/api";
import type { Movie } from "../../types/movie";
import RatingBadge from "../../components/common/RatingBadge";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import DownloadRedirectModal from "../../components/DownloadRedirectModal";
import DownloadActions, { type DownloadSource } from "../../components/DownloadActions";
import AuthToast from "../../components/common/AuthToast";
import AdResponsiveBanner from "../../components/ads/AdResponsiveBanner";
import AdSlot from "../../components/ads/AdSlot";
import { triggerAdsterraPopunder } from "../../components/ads/adsterraActions";
import AmbientBackdrop from "../../components/ui/AmbientBackdrop";
import Section from "../../components/ui/Section";
import { buttonClass } from "../../components/ui/buttonClass";
import { cn } from "../../components/ui/cn";

const VideoPlayer = lazy(() => import("../../components/VideoPlayer/VideoPlayer"));

const MovieDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistItemId, setWatchlistItemId] = useState<number | null>(null);
  const [downloadTarget, setDownloadTarget] = useState<{ title: string; source: DownloadSource } | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!slug) return;
      try {
        const [movieData, allMovies] = await Promise.all([
          api.getMovie(slug).catch(() => null),
          api.getMovies().catch(() => []),
        ]);

        setMovie(movieData);

        // Related: same categories, excluding the current title.
        if (movieData) {
          const related = allMovies
            .filter(
              (m) =>
                m.id !== movieData.id &&
                m.categories?.some((cat) => movieData.categories?.some((c) => c.id === cat.id)),
            )
            .slice(0, 12);
          setRelatedMovies(related);
        }
      } catch (error) {
        console.error("Error fetching movie detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [slug]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!movie) return;
      try {
        const items = await api.checkWatchlistStatus("movie", movie.id);
        if (items.length > 0) {
          setIsInWatchlist(true);
          setWatchlistItemId(items[0].id);
        } else {
          setIsInWatchlist(false);
          setWatchlistItemId(null);
        }
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      }
    };
    checkStatus();
  }, [movie]);

  const toggleWatchlist = async () => {
    if (!movie) return;
    try {
      if (isInWatchlist && watchlistItemId) {
        await api.removeFromWatchlist(watchlistItemId);
        setIsInWatchlist(false);
        setWatchlistItemId(null);
      } else {
        const newItem = await api.addToWatchlist("movie", movie.id);
        setIsInWatchlist(true);
        setWatchlistItemId(newItem.id);
      }
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Failed to update watchlist. Please sign in.");
    }
  };

  const shareMovie = async () => {
    if (!movie) return;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: movie.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing movie:", error);
    }
  };

  const openDownloadModal = (source: DownloadSource) => {
    if (!movie) return;
    triggerAdsterraPopunder();
    setDownloadTarget({ title: movie.title, source });
  };

  const prepareDownloadLink = async () => {
    if (!movie || !downloadTarget) return "";
    const source = downloadTarget.source === "local" ? undefined : downloadTarget.source;
    const download = await api.getMovieDownloadLink(movie.slug, source);
    return download.url;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return <EmptyState title="Movie not found" message="This movie may have been removed or is not published yet." />;
  }

  const poster = api.getMediaUrl(movie.poster);
  const still = api.getMediaUrl(movie.hero_image || movie.poster);
  const year = movie.release_date?.slice(0, 4);
  const longDescription = (movie.description?.length ?? 0) > 260;
  const facts = [year, movie.runtime ? `${movie.runtime} min` : null].filter(Boolean);

  return (
    <div className="animate-fade-in">
      <section className="relative isolate">
        <AmbientBackdrop glow={poster} className="h-[80svh]" />

        <div className="page-x pt-4 sm:pt-6">
          <div className="mb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-black/30 text-white ring-1 ring-white/10 backdrop-blur-md transition hover:bg-black/50"
            >
              <FiArrowLeft className="size-4" />
            </button>
            <Breadcrumbs
              items={[
                { label: "Movies", path: "/movies" },
                { label: movie.title, path: `/movies/${movie.slug}` },
              ]}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-12">
            <div className="min-w-0">
              {movie.bunny_ready ? (
                <Suspense
                  fallback={
                    <div className="grid aspect-video w-full place-items-center rounded-2xl bg-black ring-1 ring-white/10">
                      <span className="size-10 animate-spin rounded-full border-[3px] border-white/15 border-t-white" />
                    </div>
                  }
                >
                  <VideoPlayer key={movie.slug} contentType="movie" slug={movie.slug} poster={still} title={movie.title} subtitle="Movie" />
                </Suspense>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-800 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
                  <img src={still} alt="" className="size-full object-cover" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 sm:p-6">
                    <p className="flex items-center gap-2 text-xs font-medium text-white/70">
                      <FiFilm className="size-3.5" /> Streaming isn't available for this title yet. Download options are listed alongside.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">
                <span className="h-px w-6 bg-accent" /> Movie
              </p>
              <h1 className="mt-3 font-display text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-white sm:text-4xl">
                {movie.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-medium text-white/65">
                {movie.rating ? <RatingBadge rating={movie.rating} size="small" /> : null}
                {facts.map((fact, i) => (
                  <span key={fact} className="flex items-center gap-3">
                    {(i > 0 || movie.rating) && <span className="size-1 rounded-full bg-white/25" aria-hidden="true" />}
                    {fact}
                  </span>
                ))}
              </div>

              {movie.categories?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {movie.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/75 ring-1 ring-white/10 transition ring-inset hover:bg-white/[0.12] hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {movie.description && (
                <div className="mt-5">
                  <p className={cn("text-sm leading-relaxed text-white/70", !expanded && longDescription && "line-clamp-4")}>
                    {movie.description}
                  </p>
                  {longDescription && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="mt-1.5 text-xs font-semibold text-white/80 transition hover:text-accent"
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2.5">
                <DownloadActions
                  bunnyReady={movie.bunny_ready}
                  hasExternalUrl={movie.has_external_url}
                  downloadAvailable={movie.download_available}
                  onDownload={openDownloadModal}
                />
              </div>

              <div className="mt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={toggleWatchlist}
                  aria-pressed={isInWatchlist}
                  className={buttonClass(
                    "ghost",
                    "md",
                    cn("ring-1 ring-white/10 ring-inset", isInWatchlist && "bg-accent/12 text-accent ring-accent/30 hover:text-accent"),
                  )}
                >
                  {isInWatchlist ? <FiCheck /> : <FiPlus />}
                  {isInWatchlist ? "In watchlist" : "Watchlist"}
                </button>
                <button
                  type="button"
                  onClick={shareMovie}
                  className={buttonClass("ghost", "md", "ring-1 ring-white/10 ring-inset")}
                >
                  {shared ? <FiCheck className="text-accent" /> : <FiShare2 />}
                  {shared ? "Link copied" : "Share"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DownloadRedirectModal
        show={Boolean(downloadTarget)}
        title={downloadTarget?.title ?? ""}
        sourceType={downloadTarget?.source}
        contentSlug={movie.slug}
        contentType="movie"
        onPrepareDownload={prepareDownloadLink}
        onHide={() => setDownloadTarget(null)}
      />

      <AuthToast show={Boolean(toastMessage)} message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="page-x">
        <AdResponsiveBanner className="mt-12" />
        <AdSlot unit="native" className="my-8" label="Sponsored titles" />
      </div>

      {relatedMovies.length > 0 && (
        <Section title="More like this">
          <MovieGrid movies={relatedMovies} />
        </Section>
      )}
    </div>
  );
};

export default MovieDetail;
