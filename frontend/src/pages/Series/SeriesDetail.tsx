import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiFilm, FiPlay, FiPlus, FiShare2 } from "react-icons/fi";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import EpisodeList from "../../components/EpisodeList/EpisodeList";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import RatingBadge from "../../components/common/RatingBadge";
import { api } from "../../services/api";
import type { Series } from "../../types/series";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import AuthToast from "../../components/common/AuthToast";
import AdResponsiveBanner from "../../components/ads/AdResponsiveBanner";
import AdSlot from "../../components/ads/AdSlot";
import AmbientBackdrop from "../../components/ui/AmbientBackdrop";
import PosterStack from "../../components/SeriesCard/PosterStack";
import Section from "../../components/ui/Section";
import { buttonClass } from "../../components/ui/buttonClass";
import { cn } from "../../components/ui/cn";

const SeriesDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistItemId, setWatchlistItemId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!slug) return;
      try {
        const data = await api.getSeriesDetail(slug);
        setSeries(data);
        setActiveSeason(0);
      } catch (error) {
        console.error("Error fetching series detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [slug]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!series) return;
      try {
        const items = await api.checkWatchlistStatus("series", series.id);
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
  }, [series]);

  const toggleWatchlist = async () => {
    if (!series) return;
    try {
      if (isInWatchlist && watchlistItemId) {
        await api.removeFromWatchlist(watchlistItemId);
        setIsInWatchlist(false);
        setWatchlistItemId(null);
      } else {
        const newItem = await api.addToWatchlist("series", series.id);
        setIsInWatchlist(true);
        setWatchlistItemId(newItem.id);
      }
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Failed to update watchlist. Please sign in.");
    }
  };

  const shareSeries = async () => {
    if (!series) return;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: series.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing series:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!series) {
    return <EmptyState title="Series not found" message="This series may have been removed or is not published yet." />;
  }

  const seasons = series.seasons ?? [];
  const activeSeasonData = seasons[activeSeason];
  const episodeCount = seasons.reduce((total, season) => total + season.episodes.length, 0);
  const year = series.first_air_date?.slice(0, 4);
  const firstEpisode = seasons.find((s) => s.episodes.length > 0)?.episodes[0];
  const poster = api.getMediaUrl(series.poster);
  const heroImage = series.hero_image ? api.getMediaUrl(series.hero_image) : null;
  const longDescription = (series.description?.length ?? 0) > 220;

  const facts = [
    year,
    seasons.length ? `${seasons.length} ${seasons.length === 1 ? "Season" : "Seasons"}` : null,
    episodeCount ? `${episodeCount} Episodes` : null,
  ].filter(Boolean);

  return (
    <div className="animate-fade-in">
      <section className="relative isolate overflow-hidden">
        <AmbientBackdrop glow={poster} image={heroImage} />

        <div className="page-x relative pt-4 pb-10 sm:pt-6 lg:pt-8 lg:pb-16">
          <div className="flex items-center gap-3">
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
                { label: "Series", path: "/series" },
                { label: series.title, path: `/series/${series.slug}` },
              ]}
            />
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-[200px_1fr] sm:items-end lg:mt-14 lg:grid-cols-[260px_1fr] lg:gap-12">
            <div className="group mx-auto w-[min(56vw,220px)] sm:mx-0 sm:w-full">
              <PosterStack src={poster} alt={series.title} sleeves={seasons.length - 1} size="lg" eager />
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <p className="flex items-center justify-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase sm:justify-start">
                <span className="h-px w-6 bg-accent" /> TV Series
              </p>
              <h1 className="mt-3 font-display text-3xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-6xl">
                {series.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-medium text-white/65 sm:justify-start">
                {series.rating ? <RatingBadge rating={series.rating} size="small" /> : null}
                {facts.map((fact, i) => (
                  <span key={fact} className="flex items-center gap-3">
                    {(i > 0 || series.rating) && <span className="size-1 rounded-full bg-white/25" aria-hidden="true" />}
                    {fact}
                  </span>
                ))}
              </div>

              {series.categories?.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  {series.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/75 ring-1 ring-white/10 backdrop-blur-md transition ring-inset hover:bg-white/[0.12] hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {series.description && (
                <div className="mx-auto mt-5 max-w-2xl sm:mx-0">
                  <p
                    className={cn(
                      "text-sm leading-relaxed text-white/70 sm:text-[15px]",
                      !expanded && longDescription && "line-clamp-3",
                    )}
                  >
                    {series.description}
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

              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                {firstEpisode && (
                  <Link to={`/series/${series.slug}/episode/${firstEpisode.slug}`} className={buttonClass("primary", "lg")}>
                    <FiPlay className="fill-current" /> Start watching
                  </Link>
                )}
                {series.trailer_url && (
                  <a
                    href={series.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("secondary", "lg", "backdrop-blur-md")}
                  >
                    <FiFilm /> Trailer
                  </a>
                )}
                <button
                  type="button"
                  onClick={toggleWatchlist}
                  aria-pressed={isInWatchlist}
                  title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  className={buttonClass(
                    "secondary",
                    "lg",
                    cn("backdrop-blur-md", isInWatchlist && "bg-accent/15 text-accent ring-accent/30 hover:bg-accent/20"),
                  )}
                >
                  {isInWatchlist ? <FiCheck /> : <FiPlus />}
                  <span className="hidden sm:inline">{isInWatchlist ? "In watchlist" : "Watchlist"}</span>
                </button>
                <button
                  type="button"
                  onClick={shareSeries}
                  aria-label="Share"
                  title={shared ? "Link copied" : "Share"}
                  className={buttonClass("secondary", "icon", "size-12 backdrop-blur-md")}
                >
                  {shared ? <FiCheck className="text-accent" /> : <FiShare2 />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthToast show={Boolean(toastMessage)} message={toastMessage} onClose={() => setToastMessage("")} />

      <Section className="mt-2 sm:mt-4">
        {seasons.length > 0 ? (
          <>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-accent/90 uppercase">Episode guide</p>
                <h2 className="truncate font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {activeSeasonData?.title || `Season ${activeSeasonData?.season_number}`}
                </h2>
              </div>
              {seasons.length > 1 && (
                <SeasonSelector seasons={seasons} activeSeason={activeSeason} onSelect={setActiveSeason} />
              )}
            </div>

            {activeSeasonData?.description && (
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-fg-muted">{activeSeasonData.description}</p>
            )}

            <div key={activeSeason} className="animate-fade-up">
              <EpisodeList episodes={activeSeasonData?.episodes ?? []} seriesSlug={series.slug} />
            </div>
          </>
        ) : (
          <EmptyState
            title="No seasons yet"
            message="Episodes will appear here once this series is published with season data."
          />
        )}
      </Section>

      <div className="page-x">
        <AdResponsiveBanner className="mt-12" />
        <AdSlot unit="native" className="my-8" label="Sponsored episodes" />
      </div>
    </div>
  );
};

export default SeriesDetail;
