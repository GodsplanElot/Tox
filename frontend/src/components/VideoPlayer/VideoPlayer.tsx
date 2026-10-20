import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiMaximize,
  FiMinimize,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiRotateCcw,
  FiRotateCw,
  FiSkipForward,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { MdOutlinePictureInPictureAlt } from "react-icons/md";
import { api } from "../../services/api";
import type { StreamUrlResponse } from "../../services/api";
import { cn } from "../ui/cn";
import { formatTime, PLAYBACK_RATES } from "./format";
import { imaAvailable, runPreroll } from "./ima";
import SeekBar from "./SeekBar";
import SettingsMenu from "./SettingsMenu";
import { useHls, type StreamError } from "./useHls";
import { hideBrokenImage } from "../ui/hideBrokenImage";

interface Props {
  contentType: "movie" | "episode";
  slug: string;
  seriesSlug?: string;
  /** Still shown on the start screen and before the first frame. */
  poster?: string;
  title?: string;
  subtitle?: string;
  /** Offered when playback ends, e.g. the next episode. */
  nextUp?: { label: string; title: string; href: string };
}

type Phase = "idle" | "ad" | "content" | "error";

const VOLUME_KEY = "tox:player:volume";
/** Re-request the signed URL if the prefetched one is older than this. */
const SOURCE_TTL_MS = 20 * 60 * 1000;
const HIDE_CONTROLS_MS = 2800;
const DOUBLE_TAP_MS = 280;
const RESUME_MIN_SECONDS = 10;

const readNumber = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    const value = raw === null ? NaN : Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); resume/volume are conveniences.
  }
};

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white active:scale-90 [&_svg]:size-[18px] sm:[&_svg]:size-5";

const SkipIcon = ({ direction }: { direction: "back" | "forward" }) => (
  <span className="relative grid place-items-center">
    {direction === "back" ? <FiRotateCcw /> : <FiRotateCw />}
    <span className="absolute pt-px text-[7px] font-bold">10</span>
  </span>
);

const VideoPlayer = ({ contentType, slug, seriesSlug, poster, title, subtitle, nextUp }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<{ data: StreamUrlResponse; fetchedAt: number } | null>(null);
  const cancelAdRef = useRef<(() => void) | null>(null);
  const hideTimerRef = useRef<number | undefined>(undefined);
  const tapRef = useRef<{ at: number; timer?: number }>({ at: 0 });
  const lastSavedRef = useRef(0);
  const lastPointerTypeRef = useRef("mouse");
  const phaseRef = useRef<Phase>("idle");

  const [phase, setPhaseState] = useState<Phase>("idle");
  const [sourceReady, setSourceReady] = useState(false);
  const [adPlaying, setAdPlaying] = useState(false);
  const [error, setError] = useState<StreamError | null>(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(() => readNumber(VOLUME_KEY) ?? 1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [flash, setFlash] = useState<{ icon: "play" | "pause"; key: number } | null>(null);
  const [ripple, setRipple] = useState<{ side: "left" | "right"; key: number } | null>(null);
  const [resumedFrom, setResumedFrom] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);

  const resumeKey = `tox:resume:${contentType}:${seriesSlug ?? ""}:${slug}`;
  const pipSupported = typeof document !== "undefined" && Boolean(document.pictureInPictureEnabled);

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  /* ------------------------------ Stream source ----------------------------- */

  const fetchSource = useCallback(
    async (force = false) => {
      const cached = sourceRef.current;
      if (!force && cached && Date.now() - cached.fetchedAt < SOURCE_TTL_MS) return cached.data;
      const data =
        contentType === "movie"
          ? await api.getMovieStreamUrl(slug)
          : await api.getEpisodeStreamUrl(seriesSlug ?? "", slug);
      sourceRef.current = { data, fetchedAt: Date.now() };
      return data;
    },
    [contentType, slug, seriesSlug],
  );

  const refreshSource = useCallback(async () => (await fetchSource(true)).hls_url, [fetchSource]);

  const handleFatal = useCallback(
    (streamError: StreamError) => {
      setError(streamError);
      setPhase("error");
      setPlaying(false);
      setBuffering(false);
    },
    [setPhase],
  );

  const { attach, destroy, levels, selectedLevel, activeLevel, setLevel } = useHls(videoRef, {
    refreshSource,
    onFatalError: handleFatal,
  });

  // Prefetch the signed URL so playback can begin inside the play click.
  useEffect(() => {
    let cancelled = false;
    fetchSource()
      .then(() => {
        if (!cancelled) setSourceReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        handleFatal({
          message: err instanceof Error ? err.message : "This stream is unavailable.",
          detail: "stream-url-request",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [fetchSource, handleFatal]);

  useEffect(
    () => () => {
      cancelAdRef.current?.();
      window.clearTimeout(hideTimerRef.current);
      window.clearTimeout(tapRef.current.timer);
    },
    [],
  );

  /* -------------------------------- Playback -------------------------------- */

  const beginContent = useCallback(
    (url: string) => {
      const video = videoRef.current;
      if (!video) return;
      const saved = readNumber(resumeKey);
      const startAt = saved && saved > RESUME_MIN_SECONDS ? saved : 0;
      setResumedFrom(startAt || null);
      setPhase("content");
      setBuffering(true);
      attach(url, startAt);
      video.volume = volume;
      video.muted = muted;
      video.playbackRate = rate;
      void video.play().catch(() => {
        // Autoplay was blocked; the viewer can press play.
        setPlaying(false);
        setBuffering(false);
      });
    },
    [attach, muted, rate, resumeKey, setPhase, volume],
  );

  const start = () => {
    const video = videoRef.current;
    const data = sourceRef.current?.data;
    if (!video || !data) return;
    setEnded(false);

    const adContainer = adContainerRef.current;
    if (data.vast_tag && adContainer && imaAvailable()) {
      setPhase("ad");
      // Must run synchronously in the click so mobile browsers allow playback.
      cancelAdRef.current = runPreroll({
        tag: data.vast_tag,
        container: adContainer,
        video,
        onAdStart: () => setAdPlaying(true),
        onDone: () => {
          cancelAdRef.current = null;
          setAdPlaying(false);
          beginContent(data.hls_url);
        },
      });
      return;
    }
    beginContent(data.hls_url);
  };

  const retry = async () => {
    setError(null);
    destroy();
    setPhase("idle");
    try {
      await fetchSource(true);
      setSourceReady(true);
      const data = sourceRef.current?.data;
      if (data) beginContent(data.hls_url);
    } catch (err) {
      handleFatal({
        message: err instanceof Error ? err.message : "This stream is unavailable.",
        detail: "stream-url-request",
      });
    }
  };

  const showFlash = (icon: "play" | "pause") => setFlash({ icon, key: Date.now() });

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (phaseRef.current === "idle") {
      start();
      return;
    }
    if (phaseRef.current !== "content") return;
    if (video.paused || video.ended) {
      setEnded(false);
      void video.play().catch(() => undefined);
      showFlash("play");
    } else {
      video.pause();
      showFlash("pause");
    }
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(Math.max(time, 0), video.duration);
    setCurrentTime(video.currentTime);
  };

  const seekBy = (delta: number) => seek((videoRef.current?.currentTime ?? 0) + delta);

  const changeVolume = (next: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.min(Math.max(next, 0), 1);
    video.muted = video.volume === 0;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted && video.volume === 0) video.volume = 0.6;
    video.muted = !video.muted;
  };

  const changeRate = (next: number) => {
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    if (container?.requestFullscreen) {
      await container.requestFullscreen().catch(() => undefined);
      const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      await orientation.lock?.("landscape").catch(() => undefined);
    } else {
      // iOS Safari only allows the video element itself to go fullscreen.
      video?.webkitEnterFullscreen?.();
    }
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch {
      // Ignored: PiP can be refused by the browser.
    }
  };

  useEffect(() => {
    const handleFullscreen = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const enter = () => setPip(true);
    const leave = () => setPip(false);
    video.addEventListener("enterpictureinpicture", enter);
    video.addEventListener("leavepictureinpicture", leave);
    return () => {
      video.removeEventListener("enterpictureinpicture", enter);
      video.removeEventListener("leavepictureinpicture", leave);
    };
  }, []);

  useEffect(() => {
    if (resumedFrom === null) return;
    const timer = window.setTimeout(() => setResumedFrom(null), 6000);
    return () => window.clearTimeout(timer);
  }, [resumedFrom]);

  /* ---------------------------- Controls visibility --------------------------- */

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), HIDE_CONTROLS_MS);
  }, []);

  const chromeVisible =
    phase === "content" && (controlsVisible || !playing || menuOpen || scrubbing || ended);

  const handleSurfacePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    lastPointerTypeRef.current = event.pointerType;
    if (phase !== "content") return;
    if (event.pointerType === "mouse") {
      if (event.button === 0) togglePlay();
      return;
    }

    // Touch: single tap toggles the controls, double tap seeks 10s.
    const now = Date.now();
    const rect = event.currentTarget.getBoundingClientRect();
    const side = event.clientX - rect.left < rect.width / 2 ? "left" : "right";
    window.clearTimeout(tapRef.current.timer);

    if (now - tapRef.current.at < DOUBLE_TAP_MS) {
      tapRef.current.at = 0;
      seekBy(side === "left" ? -10 : 10);
      setRipple({ side, key: now });
      return;
    }

    tapRef.current.at = now;
    tapRef.current.timer = window.setTimeout(() => {
      if (chromeVisible && playing) setControlsVisible(false);
      else revealControls();
    }, DOUBLE_TAP_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    // Focused buttons already react to Space/Enter themselves.
    if (event.target !== event.currentTarget && (event.key === " " || event.key === "Enter")) return;
    const video = videoRef.current;
    if (!video) return;

    if (phase === "idle") {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        start();
      }
      return;
    }
    if (phase !== "content") return;

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const actions: Record<string, () => void> = {
      " ": togglePlay,
      k: togglePlay,
      j: () => seekBy(-10),
      l: () => seekBy(10),
      ArrowLeft: () => seekBy(-5),
      ArrowRight: () => seekBy(5),
      ArrowUp: () => changeVolume(video.volume + 0.1),
      ArrowDown: () => changeVolume(video.volume - 0.1),
      m: toggleMute,
      f: () => void toggleFullscreen(),
      "<": () => changeRate(PLAYBACK_RATES[Math.max(PLAYBACK_RATES.indexOf(rate) - 1, 0)]),
      ">": () => changeRate(PLAYBACK_RATES[Math.min(PLAYBACK_RATES.indexOf(rate) + 1, PLAYBACK_RATES.length - 1)]),
    };

    if (/^[0-9]$/.test(key) && duration > 0) {
      event.preventDefault();
      seek((Number(key) / 10) * duration);
      revealControls();
      return;
    }
    const action = actions[key];
    if (!action) return;
    event.preventDefault();
    action();
    revealControls();
  };

  /* ----------------------------- Media listeners ----------------------------- */

  // Ads can play through the same <video> on iOS; only track content playback.
  const isContent = () => phaseRef.current === "content";

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !isContent()) return;
    setCurrentTime(video.currentTime);

    const now = Date.now();
    if (now - lastSavedRef.current > 5000 && video.currentTime > RESUME_MIN_SECONDS) {
      lastSavedRef.current = now;
      const nearEnd = video.duration - video.currentTime < 30;
      writeStorage(resumeKey, nearEnd ? null : String(Math.floor(video.currentTime)));
    }
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !isContent()) return;
    const { buffered, currentTime: time } = video;
    for (let i = 0; i < buffered.length; i += 1) {
      if (buffered.start(i) <= time + 0.5 && buffered.end(i) >= time) {
        setBufferedEnd(buffered.end(i));
        return;
      }
    }
  };

  const stopBuffering = () => {
    if (isContent()) setBuffering(false);
  };

  const syncDuration = () => {
    if (isContent()) setDuration(videoRef.current?.duration ?? 0);
  };

  const VolumeIcon = muted || volume === 0 ? FiVolumeX : volume < 0.5 ? FiVolume1 : FiVolume2;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label={title ? `Video player: ${title}` : "Video player"}
      onKeyDown={handleKeyDown}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" && phase === "content") revealControls();
      }}
      onMouseLeave={() => {
        if (playing) setControlsVisible(false);
      }}
      className={cn(
        "group/player relative isolate aspect-video w-full overflow-hidden bg-black text-white outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-accent/70",
        fullscreen ? "aspect-auto h-full rounded-none" : "rounded-2xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10",
        phase === "content" && !chromeVisible && "cursor-none",
      )}
    >
      <video
        ref={videoRef}
        playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 size-full bg-black object-contain"
        onPlay={() => {
          if (!isContent()) return;
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => {
          if (isContent()) setPlaying(false);
        }}
        onWaiting={() => {
          if (isContent()) setBuffering(true);
        }}
        onPlaying={stopBuffering}
        onCanPlay={stopBuffering}
        onSeeked={stopBuffering}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onDurationChange={syncDuration}
        onLoadedMetadata={syncDuration}
        onVolumeChange={() => {
          const video = videoRef.current;
          if (!video) return;
          setVolume(video.volume);
          setMuted(video.muted);
          writeStorage(VOLUME_KEY, String(video.volume));
        }}
        onRateChange={() => setRate(videoRef.current?.playbackRate ?? 1)}
        onEnded={() => {
          if (!isContent()) return;
          setEnded(true);
          setPlaying(false);
          writeStorage(resumeKey, null);
        }}
      />

      {/* IMA renders the ad break here; kept laid out so it can measure itself. */}
      <div
        ref={adContainerRef}
        className={cn("absolute inset-0", phase === "ad" ? "z-30" : "pointer-events-none invisible")}
      />

      {/* Gesture surface: click to play/pause, double-tap to seek on touch. */}
      {phase === "content" && (
        <div
          className="absolute inset-0 z-10"
          onPointerUp={handleSurfacePointerUp}
          onDoubleClick={() => {
            if (lastPointerTypeRef.current === "mouse") void toggleFullscreen();
          }}
        />
      )}

      {/* Center feedback: buffering spinner, play/pause flash, double-tap ripple. */}
      <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
        {((phase === "content" && buffering && !ended) || (phase === "ad" && !adPlaying)) && (
          <span className="size-12 animate-spin rounded-full border-[3px] border-white/15 border-t-white" />
        )}
        {flash && !buffering && (
          <span
            key={flash.key}
            className="grid size-16 animate-[player-flash_550ms_ease-out_forwards] place-items-center rounded-full bg-black/45 backdrop-blur-sm [&_svg]:size-7"
          >
            {flash.icon === "play" ? <FiPlay className="ml-1 fill-current" /> : <FiPause className="fill-current" />}
          </span>
        )}
      </div>
      {ripple && (
        <div
          key={ripple.key}
          className={cn(
            "pointer-events-none absolute inset-y-0 z-20 grid w-1/2 animate-[player-flash_650ms_ease-out_forwards] place-items-center bg-white/[0.06]",
            ripple.side === "left" ? "left-0 rounded-r-[50%]" : "right-0 rounded-l-[50%]",
          )}
        >
          <span className="flex flex-col items-center gap-1 text-xs font-semibold">
            <SkipIcon direction={ripple.side === "left" ? "back" : "forward"} />
            {ripple.side === "left" ? "−10s" : "+10s"}
          </span>
        </div>
      )}

      {/* Start screen */}
      {phase === "idle" && (
        <button
          type="button"
          onClick={start}
          disabled={!sourceReady}
          aria-label={sourceReady ? `Play ${title ?? "video"}` : "Preparing stream"}
          className="group/start absolute inset-0 z-20 grid place-items-center"
        >
          {poster && <img onError={hideBrokenImage} src={poster} alt="" className="absolute inset-0 size-full object-cover" />}
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          <span className="relative grid size-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition duration-300 group-hover/start:scale-110 group-hover/start:bg-accent group-hover/start:text-ink-950 group-hover/start:ring-accent sm:size-20">
            {sourceReady ? (
              <FiPlay className="ml-1 size-7 fill-current sm:size-8" />
            ) : (
              <span className="size-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            )}
            {sourceReady && (
              <span className="absolute inset-0 animate-ping rounded-full ring-1 ring-white/40 [animation-duration:2.4s]" />
            )}
          </span>
          {(title || subtitle) && (
            <span className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-6">
              {subtitle && (
                <span className="block text-[11px] font-bold tracking-[0.16em] text-white/60 uppercase">{subtitle}</span>
              )}
              {title && (
                <span className="mt-1 block truncate font-display text-base font-semibold sm:text-xl">{title}</span>
              )}
            </span>
          )}
        </button>
      )}

      {/* Error screen */}
      {phase === "error" && error && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-ink-950/90 p-6 text-center backdrop-blur-sm">
          <div className="flex max-w-sm flex-col items-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-red-500/10 text-red-300 ring-1 ring-red-400/20">
              <FiAlertTriangle className="size-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">{error.message}</p>
            <p className="mt-1 font-mono text-[10px] text-white/35">{error.detail}</p>
            <button
              type="button"
              onClick={() => void retry()}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink-950 transition hover:bg-white/90 active:scale-95"
            >
              <FiRefreshCw className="size-3.5" /> Try again
            </button>
          </div>
        </div>
      )}

      {/* End screen */}
      {phase === "content" && ended && (
        <div className="absolute inset-0 z-30 grid animate-fade-in place-items-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            {nextUp && (
              <>
                <span className="text-[11px] font-bold tracking-[0.16em] text-white/55 uppercase">{nextUp.label}</span>
                <span className="max-w-xs truncate font-display text-lg font-semibold">{nextUp.title}</span>
              </>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  seek(0);
                  togglePlay();
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-semibold ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <FiRotateCcw className="size-4" /> Replay
              </button>
              {nextUp && (
                <Link
                  to={nextUp.href}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-[13px] font-semibold text-ink-950 transition hover:bg-accent-strong"
                >
                  Play next <FiSkipForward className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resume notice */}
      {phase === "content" && resumedFrom !== null && !ended && (
        <div className="absolute top-4 left-1/2 z-40 flex -translate-x-1/2 animate-scale-in items-center gap-3 rounded-full bg-black/70 py-1.5 pr-1.5 pl-4 text-xs font-medium whitespace-nowrap ring-1 ring-white/10 backdrop-blur-md">
          Resumed at {formatTime(resumedFrom)}
          <button
            type="button"
            onClick={() => {
              seek(0);
              setResumedFrom(null);
            }}
            className="rounded-full bg-white/15 px-3 py-1 font-semibold transition hover:bg-white/25"
          >
            Start over
          </button>
        </div>
      )}

      {/* Chrome */}
      {phase === "content" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-300",
            chromeVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="bg-gradient-to-b from-black/70 to-transparent px-4 pt-3 pb-10 sm:px-5 sm:pt-4">
            {subtitle && <p className="text-[10px] font-bold tracking-[0.16em] text-white/55 uppercase">{subtitle}</p>}
            {title && <p className="truncate text-sm font-semibold sm:text-base">{title}</p>}
          </div>

          <div
            className={cn(
              "bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pt-12 pb-2 sm:px-4 sm:pb-3",
              chromeVisible && "pointer-events-auto",
            )}
          >
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              bufferedEnd={bufferedEnd}
              onSeek={seek}
              onScrubChange={setScrubbing}
            />

            <div className="mt-1 flex items-center gap-0.5 sm:gap-1">
              <button type="button" aria-label={playing ? "Pause (k)" : "Play (k)"} onClick={togglePlay} className={iconButton}>
                {playing ? <FiPause className="fill-current" /> : <FiPlay className="ml-0.5 fill-current" />}
              </button>
              <button type="button" aria-label="Back 10 seconds (j)" onClick={() => seekBy(-10)} className={iconButton}>
                <SkipIcon direction="back" />
              </button>
              <button type="button" aria-label="Forward 10 seconds (l)" onClick={() => seekBy(10)} className={iconButton}>
                <SkipIcon direction="forward" />
              </button>

              <div className="group/volume flex items-center">
                <button type="button" aria-label={muted ? "Unmute (m)" : "Mute (m)"} onClick={toggleMute} className={iconButton}>
                  <VolumeIcon />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  aria-label="Volume"
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  className="hidden h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/25 accent-white opacity-0 transition-all duration-300 group-focus-within/volume:w-20 group-focus-within/volume:opacity-100 group-hover/volume:w-20 group-hover/volume:opacity-100 sm:block [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{
                    background: `linear-gradient(to right, white ${(muted ? 0 : volume) * 100}%, rgb(255 255 255 / 0.25) 0)`,
                  }}
                />
              </div>

              <span className="ml-2 text-xs font-medium text-white/80 tabular-nums">
                {formatTime(currentTime)}
                <span className="text-white/40"> / {formatTime(duration)}</span>
              </span>

              <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
                <SettingsMenu
                  levels={levels}
                  selectedLevel={selectedLevel}
                  activeLevel={activeLevel}
                  onLevelChange={setLevel}
                  rate={rate}
                  onRateChange={changeRate}
                  onOpenChange={setMenuOpen}
                  buttonClassName={iconButton}
                />
                {pipSupported && (
                  <span className="hidden sm:contents">
                    <button
                      type="button"
                      aria-label={pip ? "Exit picture-in-picture" : "Picture-in-picture"}
                      onClick={() => void togglePip()}
                      className={cn(iconButton, pip && "text-accent")}
                    >
                      <MdOutlinePictureInPictureAlt />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  aria-label={fullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
                  onClick={() => void toggleFullscreen()}
                  className={iconButton}
                >
                  {fullscreen ? <FiMinimize /> : <FiMaximize />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hairline progress while the controls are hidden. */}
      {phase === "content" && !chromeVisible && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/10">
          <div className="h-full bg-accent" style={{ width: `${progressPercent}%` }} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
