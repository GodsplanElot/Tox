import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import type { Episode } from "../../types/series";
import { cn } from "../ui/cn";

interface Props {
  episodes: Episode[];
  seriesSlug: string;
  /** Slug of the episode currently open, highlighted as "Now playing". */
  activeSlug?: string;
  compact?: boolean;
}

/** Text-first episode guide: number, title, synopsis, and availability. */
const EpisodeList = ({ episodes, seriesSlug, activeSlug, compact }: Props) => {
  if (episodes.length === 0) {
    return (
      <div className="rounded-2xl px-5 py-10 text-center text-sm text-fg-subtle ring-1 ring-white/[0.06] ring-inset">
        No episodes have been added to this season yet.
      </div>
    );
  }

  return (
    <ol className="overflow-hidden rounded-2xl bg-white/[0.015] ring-1 ring-white/[0.06] ring-inset">
      {episodes.map((ep) => {
        const active = ep.slug === activeSlug;
        const available = ep.bunny_ready || ep.has_external_url || ep.download_available;

        return (
          <li key={ep.id} className="border-b border-white/[0.05] last:border-b-0">
            <Link
              to={`/series/${seriesSlug}/episode/${ep.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-start gap-4 px-4 transition-colors duration-200 sm:gap-5 sm:px-5",
                compact ? "py-3.5" : "py-4 sm:py-5",
                active ? "bg-accent/[0.06]" : "hover:bg-white/[0.03]",
              )}
            >
              {active && <span aria-hidden="true" className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-accent" />}

              <span
                className={cn(
                  "w-8 shrink-0 pt-0.5 font-display text-xl leading-none font-semibold tabular-nums transition-colors sm:w-10 sm:text-2xl",
                  active ? "text-accent" : "text-white/20 group-hover:text-white/50",
                )}
              >
                {String(ep.episode_number).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn("truncate text-sm font-semibold sm:text-[15px]", active ? "text-white" : "text-white/90")}>
                    {ep.title}
                  </h3>
                  {active && (
                    <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-bold tracking-wider text-accent uppercase">
                      Now playing
                    </span>
                  )}
                </div>
                {ep.plot && !compact && (
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-fg-muted">{ep.plot}</p>
                )}
                <div className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-fg-subtle">
                  {ep.runtime ? <span>{ep.runtime} min</span> : null}
                  {ep.runtime && available ? <span className="size-0.5 rounded-full bg-current" /> : null}
                  {ep.bunny_ready ? (
                    <span className="font-bold text-accent/90">HD · Stream</span>
                  ) : available ? (
                    <span>Download</span>
                  ) : (
                    <span>Coming soon</span>
                  )}
                </div>
              </div>

              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ring-1 transition duration-300 ring-inset",
                  active
                    ? "bg-accent text-ink-950 ring-accent"
                    : "text-fg-subtle ring-white/10 group-hover:bg-white group-hover:text-ink-950 group-hover:ring-white",
                )}
              >
                <FiPlay className="ml-0.5 size-3.5 fill-current" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default EpisodeList;
