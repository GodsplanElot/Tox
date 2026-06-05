import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { api } from "../../services/api";
import type { Series } from "../../types/series";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DownloadRedirectModal from "../../components/DownloadRedirectModal";
import "./EpisodeDetail.css";

const EpisodeDetail = () => {
  const { seriesSlug, episodeSlug } = useParams<{
    seriesSlug: string;
    episodeSlug: string;
  }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadTarget, setDownloadTarget] = useState<{
    title: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!seriesSlug) return;
      try {
        const data = await api.getSeriesDetail(seriesSlug).catch(() => null);
        setSeries(data);
      } catch (error) {
        console.error("Error fetching episode data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodeData();
  }, [seriesSlug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const currentSeason = series?.seasons?.find((s) =>
    s.episodes?.some((e) => e.slug === episodeSlug),
  );
  const episode = currentSeason?.episodes?.find((e) => e.slug === episodeSlug);

  if (!episode)
    return (
      <div className="p-5 text-center">
        <h2>Episode not found</h2>
      </div>
    );

  const handleBack = () => {
    navigate(-1);
  };

  const openDownloadModal = () => {
    const url = api.getVideoUrl(episode);
    if (!url) return;
    setDownloadTarget({
      title: `E${episode.episode_number}: ${episode.title}`,
      url,
    });
  };

  return (
    <div className="episode-detail-container">
      {/* Thumbnail Hero Section */}
      <div className="episode-hero-section">
        <div
          className="episode-hero-backdrop"
          style={{
            backgroundImage: `url(${api.getMediaUrl(episode.thumbnail || series?.poster)})`,
          }}
        />
        <div className="detail-hero-overlay" />

        <div className="episode-hero-content">
          <div className="episode-thumbnail-main">
            <img
              src={api.getMediaUrl(episode.thumbnail || series?.poster)}
              alt={episode.title}
            />
          </div>
        </div>
      </div>

      <div className="episode-content-body">
        {/* Navigation */}
        <div className="detail-controls" style={{ padding: "1rem 0" }}>
          <button className="back-btn" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i>{" "}
            <span className="back-btn-label">Back to Series</span>
          </button>
          <Breadcrumbs
            items={[
              { label: "Series", path: "/series" },
              {
                label: series?.title || "Series",
                path: `/series/${seriesSlug}`,
              },
              {
                label: `Season ${currentSeason?.season_number}`,
                path: `/series/${seriesSlug}`,
              },
              {
                label: episode.title,
                path: `/series/${seriesSlug}/episode/${episodeSlug}`,
              },
            ]}
          />
        </div>

        {/* Content */}
        <div className="episode-header-main">
          <div className="episode-meta-top">
            <span>Season {currentSeason?.season_number}</span>
            <span className="dot">•</span>
            <span>Episode {episode.episode_number}</span>
            {episode.runtime && (
              <>
                <span className="dot">•</span>
                <span>{episode.runtime} min</span>
              </>
            )}
          </div>
          <div className="episode-title-row">
            <h1 className="episode-title-large">{episode.title}</h1>

            <div className="episode-actions">
              {api.getVideoUrl(episode) && (
                <button
                  type="button"
                  className="download-btn download-btn--small"
                  onClick={openDownloadModal}
                >
                  <FaDownload />{" "}
                  <span className="action-btn-label">
                    Download E{episode.episode_number}: {episode.title}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="episode-description-box">
          <h3>Overview</h3>
          <p>{episode.plot || series?.description}</p>
        </div>
      </div>

      <DownloadRedirectModal
        show={Boolean(downloadTarget)}
        title={downloadTarget?.title ?? ""}
        targetUrl={downloadTarget?.url ?? ""}
        onHide={() => setDownloadTarget(null)}
      />
    </div>
  );
};

export default EpisodeDetail;
