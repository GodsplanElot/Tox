import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Hls, { ErrorTypes, Events, type ErrorData } from "hls.js";

export type QualityLevel = { index: number; height: number; bitrate: number };

export type StreamError = {
  /** Short message for viewers. */
  message: string;
  /** Technical detail for support/debugging, e.g. "networkError/manifestLoadError (403)". */
  detail: string;
};

type Options = {
  /** Fetch a fresh signed manifest URL (used when the current one expires). */
  refreshSource: () => Promise<string>;
  onFatalError: (error: StreamError) => void;
};

const MAX_NETWORK_RETRIES = 3;
const MAX_SOURCE_REFRESHES = 2;
const MEDIA_RECOVERY_WINDOW_MS = 3000;
/** Signed-URL rejections from the CDN. */
const AUTH_FAILURE_CODES = [401, 403, 410];

const describe = (data: ErrorData) => {
  const code = data.response?.code;
  return `${data.type}/${data.details}${code ? ` (${code})` : ""}`;
};

const messageForCode = (code: number) =>
  AUTH_FAILURE_CODES.includes(code)
    ? "Access to this stream was refused."
    : code === 404
      ? "This video isn't available right now."
      : "We couldn't reach the stream. Check your connection.";

/**
 * Attach an HLS stream to a <video> element and keep it alive.
 *
 * - hls.js drives MSE browsers; Safari/iOS fall back to native HLS.
 * - 401/403/410 mean the signed URL expired or was rejected: fetch a new one
 *   and resume from the same position.
 * - Other network failures retry with exponential backoff.
 * - Media errors use hls.js recovery, then a codec swap, before giving up.
 */
export const useHls = (videoRef: RefObject<HTMLVideoElement | null>, { refreshSource, onFatalError }: Options) => {
  const hlsRef = useRef<Hls | null>(null);
  const teardownRef = useRef<(() => void) | null>(null);
  const optionsRef = useRef({ refreshSource, onFatalError });
  const [levels, setLevels] = useState<QualityLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(-1);
  const [activeLevel, setActiveLevel] = useState(-1);

  useEffect(() => {
    optionsRef.current = { refreshSource, onFatalError };
  }, [refreshSource, onFatalError]);

  const destroy = useCallback(() => {
    teardownRef.current?.();
    teardownRef.current = null;
    hlsRef.current = null;
  }, []);

  useEffect(() => destroy, [destroy]);

  const fail = useCallback(
    (error: StreamError) => {
      destroy();
      optionsRef.current.onFatalError(error);
    },
    [destroy],
  );

  const attachNative = useCallback(
    (video: HTMLVideoElement, url: string, startAt: number) => {
      let refreshes = 0;

      const handleError = async () => {
        if (refreshes >= MAX_SOURCE_REFRESHES) {
          fail({ message: "The video stopped unexpectedly.", detail: `native/${video.error?.code ?? "unknown"}` });
          return;
        }
        refreshes += 1;
        const resumeAt = video.currentTime;
        try {
          video.src = await optionsRef.current.refreshSource();
          video.addEventListener("loadedmetadata", () => (video.currentTime = resumeAt), { once: true });
          void video.play().catch(() => undefined);
        } catch {
          fail({ message: "We couldn't reach the stream.", detail: "native/refresh-failed" });
        }
      };
      const seekToStart = () => {
        if (startAt > 0) video.currentTime = startAt;
      };

      video.addEventListener("error", handleError);
      video.addEventListener("loadedmetadata", seekToStart, { once: true });
      video.src = url;

      teardownRef.current = () => {
        video.removeEventListener("error", handleError);
        video.removeEventListener("loadedmetadata", seekToStart);
        video.removeAttribute("src");
        video.load();
      };
    },
    [fail],
  );

  const attachHlsJs = useCallback(
    (video: HTMLVideoElement, url: string, startAt: number) => {
      const hls = new Hls({
        startPosition: startAt > 0 ? startAt : -1,
        capLevelToPlayerSize: true,
        backBufferLength: 60,
        maxBufferLength: 30,
      });
      hlsRef.current = hls;
      teardownRef.current = () => hls.destroy();

      let networkRetries = 0;
      let sourceRefreshes = 0;
      let lastMediaRecoveryAt = 0;
      let codecSwapped = false;

      hls.on(Events.MANIFEST_PARSED, (_event, data) => {
        setLevels(
          data.levels
            .map((level, index) => ({ index, height: level.height, bitrate: level.bitrate }))
            .sort((a, b) => b.height - a.height),
        );
      });
      hls.on(Events.LEVEL_SWITCHED, (_event, data) => setActiveLevel(data.level));
      hls.on(Events.FRAG_LOADED, () => {
        networkRetries = 0;
      });

      hls.on(Events.ERROR, async (_event, data) => {
        if (!data.fatal || hlsRef.current !== hls) return;

        if (data.type === ErrorTypes.NETWORK_ERROR) {
          const code = data.response?.code ?? 0;

          if (AUTH_FAILURE_CODES.includes(code) && sourceRefreshes < MAX_SOURCE_REFRESHES) {
            sourceRefreshes += 1;
            const resumeAt = video.currentTime;
            try {
              const freshUrl = await optionsRef.current.refreshSource();
              if (hlsRef.current !== hls) return;
              hls.once(Events.MANIFEST_PARSED, () => {
                if (resumeAt > 0) video.currentTime = resumeAt;
              });
              hls.loadSource(freshUrl);
            } catch {
              fail({ message: messageForCode(code), detail: `${describe(data)} + refresh failed` });
            }
            return;
          }

          if (!AUTH_FAILURE_CODES.includes(code) && code !== 404 && networkRetries < MAX_NETWORK_RETRIES) {
            networkRetries += 1;
            window.setTimeout(() => {
              if (hlsRef.current === hls) hls.startLoad(video.currentTime || -1);
            }, 1000 * 2 ** (networkRetries - 1));
            return;
          }

          fail({ message: messageForCode(code), detail: describe(data) });
          return;
        }

        if (data.type === ErrorTypes.MEDIA_ERROR) {
          const now = Date.now();
          if (now - lastMediaRecoveryAt > MEDIA_RECOVERY_WINDOW_MS) {
            lastMediaRecoveryAt = now;
            hls.recoverMediaError();
            return;
          }
          if (!codecSwapped) {
            codecSwapped = true;
            lastMediaRecoveryAt = now;
            hls.swapAudioCodec();
            hls.recoverMediaError();
            return;
          }
        }

        fail({ message: "The video stopped unexpectedly.", detail: describe(data) });
      });

      hls.loadSource(url);
      hls.attachMedia(video);
    },
    [fail],
  );

  /** Load `url` into the video element, optionally starting at `startAt` seconds. */
  const attach = useCallback(
    (url: string, startAt = 0) => {
      const video = videoRef.current;
      if (!video) return;
      destroy();
      setLevels([]);
      setSelectedLevel(-1);
      setActiveLevel(-1);

      if (Hls.isSupported()) {
        attachHlsJs(video, url, startAt);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        attachNative(video, url, startAt);
      } else {
        fail({ message: "This browser can't play this video.", detail: "No MSE or native HLS support" });
      }
    },
    [videoRef, destroy, attachHlsJs, attachNative, fail],
  );

  /** Pick a rendition by hls.js level index; -1 restores automatic switching. */
  const setLevel = useCallback((index: number) => {
    setSelectedLevel(index);
    if (hlsRef.current) hlsRef.current.currentLevel = index;
  }, []);

  return { attach, destroy, levels, selectedLevel, activeLevel, setLevel };
};
