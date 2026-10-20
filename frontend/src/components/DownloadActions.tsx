import { FiDownload, FiExternalLink } from "react-icons/fi";
import { buttonClass } from "./ui/buttonClass";

export type DownloadSource = "bunny" | "external" | "local";

type DownloadActionsProps = {
  bunnyReady?: boolean;
  hasExternalUrl?: boolean;
  downloadAvailable?: boolean;
  onDownload: (source: DownloadSource) => void;
};

/** Download buttons for whichever sources a movie or episode offers. */
const DownloadActions = ({ bunnyReady, hasExternalUrl, downloadAvailable, onDownload }: DownloadActionsProps) => {
  if (!bunnyReady && !hasExternalUrl && !downloadAvailable) {
    return (
      <button type="button" disabled className={buttonClass("secondary", "lg")}>
        <FiDownload /> No download yet
      </button>
    );
  }

  return (
    <>
      {bunnyReady && (
        <button type="button" className={buttonClass("secondary", "lg", "backdrop-blur-md")} onClick={() => onDownload("bunny")}>
          <FiDownload /> Download
          <span className="rounded bg-accent px-1 py-px text-[9px] font-extrabold tracking-wide text-ink-950">HD</span>
        </button>
      )}
      {hasExternalUrl && (
        <button type="button" className={buttonClass("secondary", "lg", "backdrop-blur-md")} onClick={() => onDownload("external")}>
          <FiExternalLink /> External server
        </button>
      )}
      {!bunnyReady && !hasExternalUrl && downloadAvailable && (
        <button type="button" className={buttonClass("secondary", "lg", "backdrop-blur-md")} onClick={() => onDownload("local")}>
          <FiDownload /> Download
        </button>
      )}
    </>
  );
};

export default DownloadActions;
