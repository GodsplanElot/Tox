import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { FiAlertTriangle } from "react-icons/fi";
import AdSlot from "../../components/ads/AdSlot";
import Button from "../../components/ui/Button";
import logo from "../../assets/icons/nav_logo.png";

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
    <div className="flex min-h-svh flex-col bg-ink-950">
      <header className="border-b border-white/[0.06] px-5 py-4">
        <a href="/" aria-label="ToxicReels home">
          <img src={logo} alt="ToxicReels" className="h-7 w-auto" />
        </a>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-5 py-10">
        <AdSlot unit="300x250" label="Advertisement" />

        <div className="flex max-w-sm flex-col items-center text-center" aria-live="polite">
          {status === "preparing" ? (
            <>
              <span className="size-10 animate-spin rounded-full border-[3px] border-white/10 border-t-accent" aria-hidden="true" />
              <p className="mt-5 font-display text-lg font-semibold text-white">Preparing your download…</p>
              <p className="mt-1.5 text-sm text-fg-muted">Your file will start automatically. Keep this tab open.</p>
            </>
          ) : (
            <>
              <span className="grid size-12 place-items-center rounded-2xl bg-red-500/10 text-red-300 ring-1 ring-red-400/20">
                <FiAlertTriangle className="size-5" />
              </span>
              <p role="alert" className="mt-4 text-sm font-semibold text-white">
                {errorMsg}
              </p>
              <Button variant="secondary" className="mt-6" onClick={() => window.close()}>
                Close this tab
              </Button>
            </>
          )}
        </div>
      </main>

      <footer className="px-5 py-5 text-center text-xs text-fg-subtle">
        &copy; {new Date().getFullYear()} ToxicReels &mdash; content served from secure CDN
      </footer>
    </div>
  );
};

export default PreparingDownload;
