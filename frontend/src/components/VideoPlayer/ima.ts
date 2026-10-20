/**
 * Minimal Google IMA (ima3.js, loaded in index.html) pre-roll runner.
 *
 * Ads are strictly best-effort: if the SDK is missing (ad blockers), the tag is
 * empty, or anything fails or stalls, `onDone` fires and content starts.
 */

type ImaEventTarget = {
  addEventListener: (type: string, handler: (event: never) => void) => void;
};

type ImaAdsManager = ImaEventTarget & {
  init: (width: number, height: number, viewMode: string) => void;
  start: () => void;
  resize: (width: number, height: number, viewMode: string) => void;
  destroy: () => void;
};

type ImaSdk = {
  AdDisplayContainer: new (container: HTMLElement, video: HTMLVideoElement) => {
    initialize: () => void;
    destroy: () => void;
  };
  AdsLoader: new (container: unknown) => ImaEventTarget & {
    requestAds: (request: unknown) => void;
    destroy: () => void;
  };
  AdsRequest: new () => {
    adTagUrl: string;
    linearAdSlotWidth: number;
    linearAdSlotHeight: number;
    nonLinearAdSlotWidth: number;
    nonLinearAdSlotHeight: number;
  };
  AdsRenderingSettings: new () => { restoreCustomPlaybackStateOnAdBreakComplete: boolean };
  AdsManagerLoadedEvent: { Type: { ADS_MANAGER_LOADED: string } };
  AdErrorEvent: { Type: { AD_ERROR: string } };
  AdEvent: {
    Type: {
      CONTENT_PAUSE_REQUESTED: string;
      CONTENT_RESUME_REQUESTED: string;
      ALL_ADS_COMPLETED: string;
      STARTED: string;
    };
  };
  ViewMode: { NORMAL: string; FULLSCREEN: string };
};

const getIma = (): ImaSdk | undefined =>
  (window as unknown as { google?: { ima?: ImaSdk } }).google?.ima;

export const imaAvailable = () => Boolean(getIma());

type PrerollOptions = {
  tag: string;
  container: HTMLElement;
  video: HTMLVideoElement;
  /** An ad actually began playing. */
  onAdStart: () => void;
  /** Ad break finished, was skipped, or failed. Always called exactly once. */
  onDone: () => void;
};

/** Ads that haven't started by now are abandoned so content isn't held hostage. */
const AD_START_TIMEOUT_MS = 8000;

/**
 * Must be called synchronously inside a user gesture (the play click) so the
 * ad display container can unlock playback on mobile.
 * Returns a cancel function that tears the ad break down without calling `onDone`.
 */
export const runPreroll = ({ tag, container, video, onAdStart, onDone }: PrerollOptions) => {
  const ima = getIma();
  if (!ima || !tag) {
    onDone();
    return () => undefined;
  }

  let finished = false;
  let manager: ImaAdsManager | null = null;
  const displayContainer = new ima.AdDisplayContainer(container, video);
  const loader = new ima.AdsLoader(displayContainer);

  const size = () => ({ width: container.clientWidth || 640, height: container.clientHeight || 360 });

  const handleResize = () => {
    const { width, height } = size();
    manager?.resize(width, height, document.fullscreenElement ? ima.ViewMode.FULLSCREEN : ima.ViewMode.NORMAL);
  };

  const teardown = () => {
    if (finished) return false;
    finished = true;
    window.clearTimeout(timeout);
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("fullscreenchange", handleResize);
    try {
      manager?.destroy();
      loader.destroy();
      displayContainer.destroy();
    } catch {
      // The SDK can throw if it was already torn down; nothing to recover.
    }
    return true;
  };
  const finish = () => {
    if (teardown()) onDone();
  };

  const timeout = window.setTimeout(finish, AD_START_TIMEOUT_MS);

  try {
    displayContainer.initialize();

    loader.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, finish);
    loader.addEventListener(
      ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (event: { getAdsManager: (video: HTMLVideoElement, settings: unknown) => ImaAdsManager }) => {
        if (finished) return;
        const settings = new ima.AdsRenderingSettings();
        settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        manager = event.getAdsManager(video, settings);

        manager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, finish);
        manager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, finish);
        manager.addEventListener(ima.AdEvent.Type.ALL_ADS_COMPLETED, finish);
        manager.addEventListener(ima.AdEvent.Type.STARTED, () => {
          window.clearTimeout(timeout);
          onAdStart();
        });

        const { width, height } = size();
        manager.init(width, height, ima.ViewMode.NORMAL);
        manager.start();
      },
    );

    const request = new ima.AdsRequest();
    const { width, height } = size();
    request.adTagUrl = tag;
    request.linearAdSlotWidth = width;
    request.linearAdSlotHeight = height;
    request.nonLinearAdSlotWidth = width;
    request.nonLinearAdSlotHeight = Math.round(height / 3);
    loader.requestAds(request);

    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleResize);
  } catch {
    finish();
  }

  // Cancelling (e.g. on unmount) tears down without starting content.
  return () => void teardown();
};
