import React, { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import { api } from "../../services/api";
import type { Movie } from "../../types/movie";
import RatingBadge from "../../components/common/RatingBadge";
import { FaDownload, FaPlay, FaPlus, FaCheck, FaShareAlt } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DownloadRedirectModal from "../../components/DownloadRedirectModal";
import AuthToast from "../../components/common/AuthToast";
import AdResponsiveBanner from "../../components/ads/AdResponsiveBanner";
import AdSlot from "../../components/ads/AdSlot";
import { triggerAdsterraPopunder } from "../../components/ads/adsterraActions";
import "./MovieDetail.css";

const VideoPlayer = lazy(() => import("../../components/VideoPlayer/VideoPlayer"));

const MovieDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistItemId, setWatchlistItemId] = useState<number | null>(null);
  const [downloadTarget, setDownloadTarget] = useState<{
    title: string;
    source: "bunny" | "external" | "local";
  } | null>(null);
  const [watching, setWatching] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!slug) return;
      try {
        const [movieData, allMovies] = await Promise.all([
          api.getMovie(slug).catch(() => null),
          api.getMovies().catch(() => []),
        ]);

        setMovie(movieData);

        // Simple related movies logic (same categories, exclude current)
        if (movieData) {
          const related = allMovies
            .filter(
              (m) =>
                m.id !== movieData.id &&
                m.categories?.some((cat) =>
                  movieData.categories?.some((c) => c.id === cat.id),
                ),
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
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to update watchlist. Please sign in.",
      );
    }
  };

  const openDownloadModal = (source: "bunny" | "external" | "local") => {
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
    return (
      <div className="movie-detail__not-found">
        <h2>Movie not found</h2>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      {/* HERO SECTION */}
      <section
        className="movie-detail__hero"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.4),
            rgba(0,0,0,0.95)
          ), url(${api.getMediaUrl(movie.poster)})`,
        }}
      >
        <div className="movie-detail__hero-content">
          <div className="movie-detail__poster">
            {watching ? (
              <Suspense fallback={<div className="vp-state vp-loading"><span className="vp-spinner" /></div>}>
                <VideoPlayer contentType="movie" slug={movie.slug} />
              </Suspense>
            ) : (
              <>
                <img src={api.getMediaUrl(movie.poster)} alt={movie.title} />
                {movie.rating && (
                  <div className="movie-detail__rating">
                    <RatingBadge rating={movie.rating} size="medium" />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="movie-detail__info">
            <h1 className="movie-detail__title">{movie.title}</h1>

            <div className="movie-detail__meta">
              {movie.release_date && (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.runtime && <span>{movie.runtime} min</span>}
            </div>

            {movie.categories && (
              <div className="movie-detail__genres">
                {movie.categories.map((cat) => (
                  <span key={cat.id}>{cat.name}</span>
                ))}
              </div>
            )}

            <p className="movie-detail__description">{movie.description}</p>

            <div className="movie-detail__actions">
              {movie.bunny_ready && (
                <button
                  type="button"
                  className="download-btn download-btn--watch"
                  onClick={() => setWatching((v) => !v)}
                >
                  <FaPlay />
                  <span className="action-btn-label">
                    {watching ? "Close Player" : "Watch Online"}
                  </span>
                </button>
              )}
              <div className="download-group">
                {movie.bunny_ready && (
                  <button
                    type="button"
                    className="download-btn download-btn--hd"
                    onClick={() => openDownloadModal("bunny")}
                  >
                    <FaDownload />{" "}
                    <span className="action-btn-label">HD Download</span>
                    <span className="download-btn__badge">1080p</span>
                  </button>
                )}
                {movie.has_external_url && (
                  <button
                    type="button"
                    className="download-btn download-btn--external"
                    onClick={() => openDownloadModal("external")}
                  >
                    <FaDownload />{" "}
                    <span className="action-btn-label">External Server</span>
                  </button>
                )}
                {!movie.bunny_ready && !movie.has_external_url && movie.download_available && (
                  <button
                    type="button"
                    className="download-btn download-btn--1080p"
                    onClick={() => openDownloadModal("local")}
                  >
                    <FaDownload />{" "}
                    <span className="action-btn-label">Download</span>
                  </button>
                )}
                {!movie.download_available && (
                  <button className="download-btn download-btn--1080p disabled" disabled>
                    <FaDownload />{" "}
                    <span className="action-btn-label">No Link</span>
                  </button>
                )}
              </div>

              <div className="secondary-actions">
                <button
                  className={`action-btn action-btn--watchlist ${isInWatchlist ? "active" : ""}`}
                  title={
                    isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
                  }
                  onClick={toggleWatchlist}
                >
                  {isInWatchlist ? <FaCheck /> : <FaPlus />}{" "}
                  <span className="action-btn-label">
                    {isInWatchlist ? "In Watchlist" : "Watchlist"}
                  </span>
                </button>
                <button className="action-btn action-btn--share" title="Share">
                  <FaShareAlt /> <span className="action-btn-label">Share</span>
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

      <AuthToast
        show={Boolean(toastMessage)}
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      <AdResponsiveBanner />
      <AdSlot unit="native" className="ad-inline" label="Sponsored titles" />

      {/* RECOMMENDATIONS */}
      {relatedMovies.length > 0 && (
        <section className="movie-detail__related">
          <MovieGrid title="More Like This" movies={relatedMovies} />
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
