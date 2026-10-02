import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import AdSlot from "../../components/ads/AdSlot";
import "./PreparingDownload.css";

const PreparingDownload = () => {
  const [params] = useSearchParams();
  const type = params.get("type") ?? "movie";
  const slug = params.get("slug") ?? "";
  const source = (params.get("source") ?? "bunny") as "bunny" | "external";
  const seriesSlug = params.get("series") ?? "";

  const [status, setStatus] = useState<"preparing" | "error">("preparing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!slug) {
      setStatus("error");
      setErrorMsg("Invalid download request — no title was specified.");
      return;
    }

    const prepare = async () => {
      try {
        const result =
          type === "episode" && seriesSlug
            ? await api.getEpisodeDownloadLink(seriesSlug, slug, source)
            : await api.getMovieDownloadLink(slug, source);

        if (result.url) {
          window.location.href = result.url;
        } else {
          throw new Error("Download link is not available.");
        }
      } catch (e) {
        setStatus("error");
        setErrorMsg(
          e instanceof Error
            ? e.message
            : "Could not prepare your download. Please go back and try again.",
        );
      }
    };

    prepare();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="prep-page">
      <header className="prep-page__header">
        <a href="/" className="prep-page__brand">TOXICREELS</a>
      </header>

      <main className="prep-page__main">
        <div className="prep-page__ad-wrap">
          <AdSlot unit="300x250" label="Advertisement" />
        </div>

        <div className="prep-page__status">
          {status === "preparing" ? (
            <>
              <div className="prep-spinner" aria-hidden="true">
                <div className="prep-spinner__ring" />
              </div>
              <p className="prep-page__message">Preparing your download&hellip;</p>
              <p className="prep-page__hint">
                Your file will start automatically. Keep this tab open.
              </p>
            </>
          ) : (
            <>
              <p className="prep-page__error">{errorMsg}</p>
              <button
                type="button"
                className="prep-page__close-btn"
                onClick={() => window.close()}
              >
                Close this tab
              </button>
            </>
          )}
        </div>
      </main>

      <footer className="prep-page__footer">
        <span>
          &copy; {new Date().getFullYear()} ToxicReels &mdash; content served from
          secure CDN
        </span>
      </footer>
    </div>
  );
};

export default PreparingDownload;
