import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiTv } from "react-icons/fi";
import SeriesCard from "../../components/SeriesCard/SeriesCard";
import { api } from "../../services/api";
import type { Category, Series } from "../../services/api";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OfflineState from "../../components/common/OfflineState";
import RatingBadge from "../../components/common/RatingBadge";
import AdResponsiveBanner from "../../components/ads/AdResponsiveBanner";
import AdSlot from "../../components/ads/AdSlot";
import AdLayout from "../../components/ads/AdLayout";
import AmbientBackdrop from "../../components/ui/AmbientBackdrop";
import { buttonClass } from "../../components/ui/buttonClass";
import { cn } from "../../components/ui/cn";
import { chipClass } from "../../components/ui/chipClass";

type SortKey = "top" | "new" | "az";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "top", label: "Top rated" },
  { key: "new", label: "Newest" },
  { key: "az", label: "A–Z" },
];

const sorters: Record<SortKey, (a: Series, b: Series) => number> = {
  top: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  new: (a, b) => (b.first_air_date ?? "").localeCompare(a.first_air_date ?? ""),
  az: (a, b) => a.title.localeCompare(b.title),
};

/** Fanned trio of posters that drifts slowly; the featured title sits in front. */
const PosterConstellation = ({ items, active }: { items: Series[]; active: number }) => {
  const order = [active, (active + 1) % items.length, (active + 2) % items.length].filter(
    (value, index, all) => all.indexOf(value) === index,
  );
  const placements = [
    "z-30 translate-x-0 rotate-0 scale-100",
    "z-20 translate-x-[42%] translate-y-[6%] rotate-[7deg] scale-[0.86] opacity-70 brightness-75",
    "z-10 -translate-x-[42%] translate-y-[8%] -rotate-[7deg] scale-[0.8] opacity-50 brightness-50",
  ];

  return (
    <div className="relative mx-auto aspect-[2/3] w-[min(52vw,250px)] animate-float lg:w-[270px]" aria-hidden="true">
      {items.map((series, index) => {
        const slot = order.indexOf(index);
        return (
          <img
            key={series.id}
            src={api.getMediaUrl(series.poster)}
            alt=""
            className={cn(
              "absolute inset-0 size-full rounded-2xl object-cover shadow-[0_40px_80px_-30px_rgb(0_0_0/0.95)] ring-1 ring-white/10 transition-all duration-700 ease-[var(--ease-out-expo)]",
              slot === -1 ? "scale-75 opacity-0" : placements[slot],
            )}
          />
        );
      })}
    </div>
  );
};

const SeriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [params, setParams] = useSearchParams();

  const genre = params.get("genre") ?? "";
  const sort = (params.get("sort") as SortKey) || "top";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, seriesData] = await Promise.all([api.getCategories(), api.getSeries()]);
        setCategories(catData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching series list data:", error);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featured = useMemo(
    () =>
      [...series]
        .sort((a, b) => Number(Boolean(b.hero_image)) - Number(Boolean(a.hero_image)) || sorters.top(a, b))
        .slice(0, 5),
    [series],
  );

  const genres = useMemo(
    () =>
      categories
        .map((cat) => ({ cat, count: series.filter((s) => s.categories.some((c) => c.id === cat.id)).length }))
        .filter(({ count }) => count > 0),
    [categories, series],
  );

  const visible = useMemo(() => {
    const filtered = genre ? series.filter((s) => s.categories.some((c) => c.slug === genre)) : series;
    return [...filtered].sort(sorters[sort] ?? sorters.top);
  }, [series, genre, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  if (loading) return <LoadingSpinner />;
  if (loadFailed) return <OfflineState />;
  if (series.length === 0) {
    return (
      <EmptyState
        icon={<FiTv className="size-6" />}
        title="No series yet"
        message="We couldn't find any TV series at the moment. Please check back later!"
      />
    );
  }

  const spotlight = featured[featuredIndex] ?? featured[0];
  const spotlightYear = spotlight.first_air_date?.slice(0, 4);
  const spotlightSeasons = spotlight.season_count ?? 0;
  const activeGenre = genres.find(({ cat }) => cat.slug === genre)?.cat;

  return (
    <div className="animate-fade-in">
      {/* Spotlight */}
      <section className="relative isolate overflow-hidden">
        <AmbientBackdrop
          key={spotlight.id}
          glow={api.getMediaUrl(spotlight.poster)}
          image={spotlight.hero_image ? api.getMediaUrl(spotlight.hero_image) : null}
          className="animate-fade-in"
        />
        <div className="page-x grid items-center gap-10 pt-10 pb-12 lg:min-h-[560px] lg:grid-cols-[1fr_auto] lg:gap-16 lg:pt-16 lg:pb-16">
          <div key={spotlight.id} className="order-2 max-w-xl animate-fade-up text-center lg:order-1 lg:text-left">
            <p className="flex items-center justify-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase lg:justify-start">
              <span className="h-px w-6 bg-accent" /> Series spotlight
            </p>
            <h1 className="mt-3 font-display text-3xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-5xl">
              {spotlight.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-medium text-white/65 lg:justify-start">
              {spotlight.rating ? <RatingBadge rating={spotlight.rating} size="small" /> : null}
              {[spotlightYear, spotlightSeasons ? `${spotlightSeasons} ${spotlightSeasons === 1 ? "Season" : "Seasons"}` : null, spotlight.categories[0]?.name]
                .filter(Boolean)
                .map((fact, i) => (
                  <span key={fact} className="flex items-center gap-3">
                    {(i > 0 || spotlight.rating) && <span className="size-1 rounded-full bg-white/25" aria-hidden="true" />}
                    {fact}
                  </span>
                ))}
            </div>
            <p className="mx-auto mt-4 line-clamp-3 text-sm leading-relaxed text-white/65 sm:text-[15px] lg:mx-0">
              {spotlight.description}
            </p>
            <div className="mt-7 flex justify-center lg:justify-start">
              <Link to={`/series/${spotlight.slug}`} className={buttonClass("primary", "lg")}>
                Explore series <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:pr-12">
            <PosterConstellation items={featured} active={featuredIndex} />
          </div>
        </div>

        {featured.length > 1 && (
          <div className="page-x relative -mt-4 flex justify-center pb-8 lg:absolute lg:right-0 lg:bottom-6 lg:mt-0 lg:pb-0">
            <div className="flex gap-2 rounded-2xl bg-black/25 p-1.5 ring-1 ring-white/[0.08] backdrop-blur-xl">
              {featured.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Spotlight ${item.title}`}
                  aria-pressed={i === featuredIndex}
                  onClick={() => setFeaturedIndex(i)}
                  className={cn(
                    "relative h-14 w-10 overflow-hidden rounded-lg transition duration-300",
                    i === featuredIndex
                      ? "opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-ink-950"
                      : "opacity-45 grayscale hover:opacity-80 hover:grayscale-0",
                  )}
                >
                  <img src={api.getMediaUrl(item.poster)} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Genre + sort controls stay pinned under the header while browsing. */}
      <div className="sticky top-14 z-30 border-y border-white/[0.05] bg-ink-950/85 backdrop-blur-xl lg:top-16">
        <div className="page-x flex items-center gap-3 py-3">
          <div className="bleed-x flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-none lg:mx-0 lg:px-0">
            <button type="button" className={chipClass(!genre)} onClick={() => updateParam("genre", "")}>
              All
              <span className={cn("text-[11px] tabular-nums", !genre ? "text-ink-950/60" : "text-fg-subtle")}>
                {series.length}
              </span>
            </button>
            {genres.map(({ cat, count }) => (
              <button
                key={cat.id}
                type="button"
                className={chipClass(genre === cat.slug)}
                onClick={() => updateParam("genre", cat.slug)}
              >
                {cat.name}
                <span className={cn("text-[11px] tabular-nums", genre === cat.slug ? "text-ink-950/60" : "text-fg-subtle")}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <label className="sr-only" htmlFor="series-sort">
            Sort series
          </label>
          <select
            id="series-sort"
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value === "top" ? "" : e.target.value)}
            className="h-8 shrink-0 cursor-pointer rounded-full bg-white/[0.04] pr-3 pl-3.5 text-[13px] font-semibold text-fg-muted ring-1 ring-white/[0.07] ring-inset hover:text-white focus:outline-none focus-visible:ring-accent/50"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key} className="bg-ink-850">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-x">
        <AdResponsiveBanner />

        <AdLayout>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {activeGenre ? activeGenre.name : "All series"}
            </h2>
            <span className="text-xs font-medium text-fg-subtle tabular-nums">
              {visible.length} {visible.length === 1 ? "title" : "titles"}
            </span>
          </div>

          {visible.length > 0 ? (
            <div key={`${genre}-${sort}`} className="grid animate-fade-up grid-cols-2 gap-x-4 gap-y-7 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {visible.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          ) : (
            <EmptyState title="Nothing here yet" message="No series match this genre right now." />
          )}

          <AdSlot unit="native" className="mt-12" label="Sponsored shows" />
        </AdLayout>
      </div>
    </div>
  );
};

export default SeriesList;
