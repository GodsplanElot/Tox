import { useEffect, useState } from "react";
import { FiDownload, FiExternalLink, FiShield } from "react-icons/fi";
import AdSlot from "./ads/AdSlot";
import { ADSTERRA_SMARTLINK_URL } from "./ads/adsterraConfig";
import Dialog from "./ui/Dialog";
import { buttonClass } from "./ui/buttonClass";

type DownloadRedirectModalProps = {
  show: boolean;
  title: string;
  sourceType?: "bunny" | "external" | "local";
  // Bunny/external: open the /preparing-download ad page in a new tab
  contentSlug?: string;
  contentType?: "movie" | "episode";
  seriesSlug?: string;
  // Local source only: async callback that returns the download URL
  onPrepareDownload: () => Promise<string>;
  onHide: () => void;
};

const CONTINUE_DELAY_SECONDS = 5;

const DownloadRedirectModal = ({
  show,
  title,
  sourceType = "external",
  contentSlug,
  contentType = "movie",
  seriesSlug,
  onPrepareDownload,
  onHide,
}: DownloadRedirectModalProps) => {
  const isBunny = sourceType === "bunny";
  const [secondsRemaining, setSecondsRemaining] = useState(CONTINUE_DELAY_SECONDS);
  const [isPreparing, setIsPreparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!show) return;

    setSecondsRemaining(CONTINUE_DELAY_SECONDS);
    setIsPreparing(false);
    setErrorMessage("");
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [show]);

  const handleContinue = async () => {
    if (secondsRemaining > 0 || isPreparing) return;

    // Bunny/external: open the /preparing-download page (shows ad + spinner,
    // makes the API call itself, then navigates to the file URL).
    if ((sourceType === "bunny" || sourceType === "external") && contentSlug) {
      const qs = new URLSearchParams({ type: contentType, slug: contentSlug, source: sourceType });
      if (seriesSlug) qs.set("series", seriesSlug);
      window.open(`/preparing-download?${qs}`, "_blank", "noopener,noreferrer");
      onHide();
      return;
    }

    // Local source: fetch signed URL here and navigate the new tab to it.
    setIsPreparing(true);
    setErrorMessage("");
    const openedWindow = window.open("about:blank", "_blank", "noopener,noreferrer");
    if (openedWindow) {
      openedWindow.opener = null;
      openedWindow.document.title = "Preparing download...";
      openedWindow.document.body.textContent = "Preparing secure download link...";
    }

    try {
      const targetUrl = await onPrepareDownload();
      if (!targetUrl) {
        throw new Error("Download link is not available yet.");
      }
      if (openedWindow) {
        openedWindow.location.href = targetUrl;
      } else {
        window.location.href = targetUrl;
      }
      onHide();
    } catch (error) {
      openedWindow?.close();
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not prepare the download link. Please try again.",
      );
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={onHide}
      title={isBunny ? "HD Download" : "Leaving ToxicReels"}
      icon={isBunny ? <FiDownload className="size-4" /> : <FiShield className="size-4" />}
    >
      <div className="space-y-4 px-5 pt-1 pb-6">
        <p className="text-[13px] leading-relaxed text-fg-muted">
          {isBunny ? (
            <>
              Your HD file opens in a new tab. It will either{" "}
              <strong className="text-white">download automatically</strong> or play in your browser. If it plays,{" "}
              <strong className="text-white">right-click the video and choose &ldquo;Save video as&rdquo;</strong>. The
              link expires shortly, so start the download straight away.
            </>
          ) : (
            "You are about to open a site where you can watch or download this title. ToxicReels is not affiliated with that site, so please review the page carefully before continuing."
          )}
        </p>

        <div className="rounded-xl bg-white/[0.03] px-3.5 py-3 ring-1 ring-white/[0.06] ring-inset">
          <p className="text-[10px] font-bold tracking-[0.16em] text-fg-subtle uppercase">Selected title</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white" title={title}>
            {title}
          </p>
        </div>

        {errorMessage && (
          <div role="alert" className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-200 ring-1 ring-red-400/25 ring-inset">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-[250px] justify-center overflow-hidden rounded-xl bg-black/20">
          {show && <AdSlot unit="300x250" />}
        </div>

        <a
          href={ADSTERRA_SMARTLINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-fg-subtle transition hover:text-fg-muted"
        >
          Sponsored discovery link <FiExternalLink className="size-3" />
        </a>

        <div className="grid grid-cols-[auto_1fr] gap-2 pt-1">
          <button type="button" className={buttonClass("ghost", "lg")} onClick={onHide}>
            Stay here
          </button>
          <button
            type="button"
            className={buttonClass("primary", "lg", "relative overflow-hidden tabular-nums")}
            disabled={secondsRemaining > 0 || isPreparing}
            onClick={handleContinue}
          >
            {secondsRemaining > 0 && (
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 bg-black/15 transition-[width] duration-1000 ease-linear"
                style={{ width: `${(secondsRemaining / CONTINUE_DELAY_SECONDS) * 100}%` }}
              />
            )}
            <span className="relative inline-flex items-center gap-2">
              {isPreparing ? (
                isBunny ? "Preparing HD link…" : "Preparing secure link…"
              ) : secondsRemaining > 0 ? (
                `Continue in ${secondsRemaining}s`
              ) : isBunny ? (
                <>
                  Start HD download <FiDownload />
                </>
              ) : (
                <>
                  Continue to site <FiExternalLink />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DownloadRedirectModal;
