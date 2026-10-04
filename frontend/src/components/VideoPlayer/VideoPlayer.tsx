import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api";
import type { StreamUrlResponse } from "../../services/api";
import "./VideoPlayer.css";

import videojs from "video.js";
import type Player from "video.js/dist/types/player";
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
    });

    playerRef.current = player;

    player.on("error", () => {
      const err = player.error();
      setError(err?.message ?? "Video failed to load. Please try again.");
    });

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
