import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaDownload, FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";
import AdSlot from "./ads/AdSlot";
import { ADSTERRA_SMARTLINK_URL } from "./ads/adsterraConfig";
import "./DownloadRedirectModal.css";

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
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="download-redirect-modal"
      backdropClassName="auth-modal-backdrop"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="download-redirect-modal__icon">
            {isBunny ? <FaDownload /> : <FaShieldAlt />}
          </span>
          {isBunny ? "HD Download" : "Leaving ToxicReels"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="download-redirect-modal__message">
          {isBunny ? (
            <>
              Your HD file will open in a new tab. It will either{" "}
              <strong>download automatically</strong> or open in your browser&rsquo;s
              built-in video player — if it plays instead of downloading,{" "}
              <strong>right-click the video and choose &ldquo;Save video as&rdquo;</strong>{" "}
              to save it to your device. The link expires shortly so start the
              download straight away.
            </>
          ) : (
            "You are about to open a site where you can watch or download this title. ToxicReels is not affiliated with that site, so please review the page carefully before continuing."
          )}
        </p>

        <div className="download-redirect-modal__target">
          <span>Selected title</span>
          <strong title={title}>{title}</strong>
        </div>

        {errorMessage && (
          <div className="download-redirect-modal__status" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="download-redirect-modal__ad">
          {show && <AdSlot unit="300x250" />}
        </div>

        <a
          className="download-redirect-modal__sponsor"
          href={ADSTERRA_SMARTLINK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sponsored discovery link <FaExternalLinkAlt />
        </a>

        <div className="download-redirect-modal__actions">
          <button
            type="button"
            className="download-redirect-modal__btn download-redirect-modal__btn--secondary"
            onClick={onHide}
          >
            Stay here
          </button>
          <button
            type="button"
            className="download-redirect-modal__btn download-redirect-modal__btn--primary"
            disabled={secondsRemaining > 0 || isPreparing}
            onClick={handleContinue}
          >
            {isPreparing ? (
              isBunny ? "Preparing HD link..." : "Preparing secure link..."
            ) : secondsRemaining > 0 ? (
              `Continue in ${secondsRemaining}s`
            ) : isBunny ? (
              <>
                Start HD Download <FaDownload />
              </>
            ) : (
              <>
                Continue to site <FaExternalLinkAlt />
              </>
            )}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DownloadRedirectModal;
