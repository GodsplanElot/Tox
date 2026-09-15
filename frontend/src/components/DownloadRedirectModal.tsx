import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";
import AdSlot from "./ads/AdSlot";
import { ADSTERRA_SMARTLINK_URL } from "./ads/adsterraConfig";
import "./DownloadRedirectModal.css";

type DownloadRedirectModalProps = {
  show: boolean;
  title: string;
  targetUrl: string;
  onHide: () => void;
};

const CONTINUE_DELAY_SECONDS = 5;

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
