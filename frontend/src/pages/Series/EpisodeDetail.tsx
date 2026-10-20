import { Link, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiFilm } from "react-icons/fi";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { api } from "../../services/api";
import type { Episode, Season, Series } from "../../types/series";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import DownloadRedirectModal from "../../components/DownloadRedirectModal";
import DownloadActions, { type DownloadSource } from "../../components/DownloadActions";
import EpisodeList from "../../components/EpisodeList/EpisodeList";
import AdResponsiveBanner from "../../components/ads/AdResponsiveBanner";
import AdSlot from "../../components/ads/AdSlot";
import { triggerAdsterraPopunder } from "../../components/ads/adsterraActions";
import AmbientBackdrop from "../../components/ui/AmbientBackdrop";
import { cn } from "../../components/ui/cn";
import { hideBrokenImage } from "../../components/ui/hideBrokenImage";

const VideoPlayer = lazy(() => import("../../components/VideoPlayer/VideoPlayer"));

type Located = { season: Season; episode: Episode };

/** Flatten seasons into watch order so prev/next can cross season boundaries. */
const watchOrder = (series: Series | null): Located[] =>
  (series?.seasons ?? []).flatMap((season) => season.episodes.map((episode) => ({ season, episode })));

const PlayerFallback = () => (
  <div className="grid aspect-video w-full place-items-center rounded-2xl bg-black ring-1 ring-white/10">
    <span className="size-10 animate-spin rounded-full border-[3px] border-white/15 border-t-white" />
  </div>
);

const EpisodeDetail = () => {
  const { seriesSlug, episodeSlug } = useParams<{ seriesSlug: string; episodeSlug: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadTarget, setDownloadTarget] = useState<{ title: string; source: DownloadSource } | null>(null);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!seriesSlug) return;
      try {
        setSeries(await api.getSeriesDetail(seriesSlug));
      } catch (error) {
        console.error("Error fetching episode data:", error);
        setSeries(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodeData();
  }, [seriesSlug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const order = watchOrder(series);
  const position = order.findIndex(({ episode }) => episode.slug === episodeSlug);
  const current = order[position];

  if (!series || !current || !seriesSlug || !episodeSlug) {
    return <EmptyState title="Episode not found" message="This episode may have been removed or is not published yet." />;
  }

  const { season, episode } = current;
  const previous = order[position - 1];
  const next = order[position + 1];
  const episodeHref = (item: Located) => `/series/${seriesSlug}/episode/${item.episode.slug}`;
  const code = `S${season.season_number} · E${episode.episode_number}`;
  const still = api.getMediaUrl(episode.thumbnail || series.hero_image || series.poster);

  const openDownloadModal = (source: DownloadSource) => {
    triggerAdsterraPopunder();
    setDownloadTarget({ title: `${series.title} ${code}: ${episode.title}`, source });
  };

  const prepareDownloadLink = async () => {
    if (!downloadTarget) return "";
    const source = downloadTarget.source === "local" ? undefined : downloadTarget.source;
    const download = await api.getEpisodeDownloadLink(seriesSlug, episodeSlug, source);
    return download.url;
  };

  return (
    <div className="relative isolate animate-fade-in">
      <AmbientBackdrop glow={api.getMediaUrl(series.poster)} className="h-[70svh]" />

      <div className="page-x pt-4 sm:pt-6">
        <div className="mb-5 flex items-center gap-3">
          <Link
            to={`/series/${seriesSlug}`}
            aria-label={`Back to ${series.title}`}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-black/30 text-white ring-1 ring-white/10 backdrop-blur-md transition hover:bg-black/50"
          >
            <FiChevronLeft className="size-4" />
          </Link>
          <Breadcrumbs
            items={[
              { label: "Series", path: "/series" },
              { label: series.title, path: `/series/${seriesSlug}` },
              { label: `E${episode.episode_number} · ${episode.title}`, path: episodeHref(current) },
            ]}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            {episode.bunny_ready ? (
              <Suspense fallback={<PlayerFallback />}>
                <VideoPlayer
                  key={episodeSlug}
                  contentType="episode"
                  slug={episodeSlug}
                  seriesSlug={seriesSlug}
                  poster={still}
                  title={episode.title}
                  subtitle={`${series.title} · ${code}`}
                  nextUp={next ? { label: "Up next", title: `E${next.episode.episode_number} · ${next.episode.title}`, href: episodeHref(next) } : undefined}
                />
              </Suspense>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/10">
                {still && <img onError={hideBrokenImage} src={still} alt="" className="size-full object-cover opacity-60" />}
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/80 to-black/20 p-6 text-center">
                  <div>
                    <FiFilm className="mx-auto size-6 text-white/60" />
                    <p className="mt-3 text-sm font-semibold text-white">Streaming isn't available for this episode yet</p>
                    <p className="mt-1 text-xs text-white/55">Use a download option below instead.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">{code}</p>
              <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
                {episode.title}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-muted">
                <Link to={`/series/${seriesSlug}`} className="font-semibold text-white/85 transition hover:text-accent">
                  {series.title}
                </Link>
                {episode.runtime ? (
                  <>
                    <span className="size-1 rounded-full bg-white/25" aria-hidden="true" />
                    {episode.runtime} min
                  </>
                ) : null}
                {episode.release_date ? (
                  <>
                    <span className="size-1 rounded-full bg-white/25" aria-hidden="true" />
                    {new Date(episode.release_date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </>
                ) : null}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <DownloadActions
                  bunnyReady={episode.bunny_ready}
                  hasExternalUrl={episode.has_external_url}
                  downloadAvailable={episode.download_available}
                  onDownload={openDownloadModal}
                />
              </div>

              {(episode.plot || series.description) && (
                <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  {episode.plot || series.description}
                </p>
              )}

              <nav aria-label="Episode navigation" className="mt-8 grid grid-cols-2 gap-3">
                {[previous, next].map((item, i) =>
                  item ? (
                    <Link
                      key={item.episode.id}
                      to={episodeHref(item)}
                      className={cn(
                        "group flex min-w-0 items-center gap-3 rounded-2xl bg-white/[0.03] p-3.5 ring-1 ring-white/[0.07] transition ring-inset hover:bg-white/[0.06] sm:p-4",
                        i === 1 && "col-start-2 flex-row-reverse text-right",
                      )}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white transition group-hover:bg-white group-hover:text-ink-950">
                        {i === 0 ? <FiChevronLeft className="size-4" /> : <FiChevronRight className="size-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold tracking-[0.14em] text-fg-subtle uppercase">
                          {i === 0 ? "Previous" : "Next"} · S{item.season.season_number} E{item.episode.episode_number}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] font-semibold text-white">{item.episode.title}</span>
                      </span>
                    </Link>
                  ) : (
                    <span key={i === 0 ? "no-prev" : "no-next"} />
                  ),
                )}
              </nav>
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:scrollbar-none">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-base font-semibold text-white">
                {season.title || `Season ${season.season_number}`}
              </h2>
              <Link to={`/series/${seriesSlug}`} className="shrink-0 text-xs font-semibold text-fg-muted transition hover:text-white">
                All seasons
              </Link>
            </div>
            <EpisodeList episodes={season.episodes} seriesSlug={seriesSlug} activeSlug={episodeSlug} compact />
          </aside>
        </div>

        <AdResponsiveBanner className="mt-12" />
        <AdSlot unit="native" className="my-8" label="Sponsored titles" />
      </div>

      <DownloadRedirectModal
        show={Boolean(downloadTarget)}
        title={downloadTarget?.title ?? ""}
        sourceType={downloadTarget?.source}
        contentSlug={episodeSlug}
        contentType="episode"
        seriesSlug={seriesSlug}
        onPrepareDownload={prepareDownloadLink}
        onHide={() => setDownloadTarget(null)}
      />
    </div>
  );
};

export default EpisodeDetail;
