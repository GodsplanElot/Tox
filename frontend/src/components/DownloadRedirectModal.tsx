import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";
import "./DownloadRedirectModal.css";

type DownloadRedirectModalProps = {
  show: boolean;
  title: string;
  targetUrl: string;
  onHide: () => void;
};

const CONTINUE_DELAY_SECONDS = 5;

const getAdNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const AdsterraBanner = ({ active }: { active: boolean }) => {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const bannerKey = import.meta.env.VITE_ADSTERRA_BANNER_KEY as string | undefined;
  const bannerSrc = import.meta.env.VITE_ADSTERRA_BANNER_SRC as string | undefined;
  const bannerWidth = getAdNumber(import.meta.env.VITE_ADSTERRA_BANNER_WIDTH, 300);
  const bannerHeight = getAdNumber(import.meta.env.VITE_ADSTERRA_BANNER_HEIGHT, 250);
  const bannerFormat =
    (import.meta.env.VITE_ADSTERRA_BANNER_FORMAT as string | undefined) || "iframe";
  const isConfigured = Boolean(bannerKey && bannerSrc);

  useEffect(() => {
    const slot = slotRef.current;
    if (!active || !slot || !isConfigured) return;

    slot.innerHTML = "";

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        key: '${bannerKey}',
        format: '${bannerFormat}',
        height: ${bannerHeight},
        width: ${bannerWidth},
        params: {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = bannerSrc as string;
    invokeScript.async = true;

    slot.appendChild(configScript);
    slot.appendChild(invokeScript);

    return () => {
      slot.innerHTML = "";
    };
  }, [active, bannerFormat, bannerHeight, bannerKey, bannerSrc, bannerWidth, isConfigured]);

  return (
    <div
      className="adsterra-banner"
      style={{ maxWidth: `${bannerWidth}px`, minHeight: `${Math.min(bannerHeight, 250)}px` }}
    >
      {isConfigured ? (
        <div ref={slotRef} className="adsterra-banner__slot" />
      ) : (
        <div className="adsterra-banner__placeholder">Sponsored space</div>
      )}
    </div>
  );
};

const DownloadRedirectModal = ({
  show,
  title,
  targetUrl,
  onHide,
}: DownloadRedirectModalProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState(CONTINUE_DELAY_SECONDS);

  useEffect(() => {
    if (!show) return;

    setSecondsRemaining(CONTINUE_DELAY_SECONDS);
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
  }, [show, targetUrl]);

  const handleContinue = () => {
    if (!targetUrl || secondsRemaining > 0) return;

    const openedWindow = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (openedWindow) {
      openedWindow.opener = null;
    }
    onHide();
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
            <FaShieldAlt />
          </span>
          Leaving ToxicReels
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="download-redirect-modal__message">
          You are about to open a site where you can watch or download this title.
          ToxicReels is not affiliated with that site, so please review the page
          carefully before continuing.
        </p>

        <div className="download-redirect-modal__target">
          <span>Selected title</span>
          <strong title={title}>{title}</strong>
        </div>

        <div className="download-redirect-modal__ad">
          <AdsterraBanner active={show} />
        </div>

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
            disabled={secondsRemaining > 0 || !targetUrl}
            onClick={handleContinue}
          >
            {secondsRemaining > 0 ? (
              `Continue in ${secondsRemaining}s`
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
