import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api";
import type { StreamUrlResponse } from "../../services/api";
import "./VideoPlayer.css";

// These imports end up in their own lazy chunk only when VideoPlayer
// itself is lazy-loaded from the detail pages.
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "videojs-ima";
import "video.js/dist/video-js.css";

interface Props {
  contentType: "movie" | "episode";
  slug: string;
  seriesSlug?: string;
}


const VideoPlayer = ({ contentType, slug, seriesSlug }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [stream, setStream] = useState<StreamUrlResponse | null>(null);
  const [error, setError] = useState("");

  // 1. Fetch the signed HLS URL + VAST tag
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data =
          contentType === "movie"
            ? await api.getMovieStreamUrl(slug)
            : await api.getEpisodeStreamUrl(seriesSlug!, slug);
        if (!cancelled) setStream(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Stream unavailable.");
      }
    };
    load();
    return () => { cancelled = true; };
  }, [contentType, slug, seriesSlug]);

  // 2. Mount Video.js once stream data arrives
  useEffect(() => {
    if (!stream || !containerRef.current) return;

    // Create a fresh <video> element each mount so Video.js owns it
    const videoEl = document.createElement("video");
    videoEl.className = "video-js vjs-toxicreels vjs-big-play-centered";
    containerRef.current.appendChild(videoEl);

    const player = videojs(videoEl, {
      sources: [{ src: stream.hls_url, type: "application/x-mpegURL" }],
      fluid: true,
      controls: true,
      preload: "metadata",
      playsinline: true,
      responsive: true,
      html5: { vhs: { overrideNative: !videojs.browser.IS_SAFARI } },
    }) as Player & { ima?: (opts: { adTagUrl: string }) => void };

    playerRef.current = player;

    // Attach IMA ads only if VAST tag is set and IMA SDK has loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (stream.vast_tag && (window as any).google?.ima) {
      player.ima?.({ adTagUrl: stream.vast_tag });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      // Remove the video element so it doesn't linger in the DOM
      videoEl.remove();
    };
  }, [stream]);

  if (error) {
    return (
      <div className="vp-state vp-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="vp-state vp-loading">
        <span className="vp-spinner" aria-hidden="true" />
        <span>Loading stream…</span>
      </div>
    );
  }

  return <div ref={containerRef} className="vp-mount" />;
};

export default VideoPlayer;
