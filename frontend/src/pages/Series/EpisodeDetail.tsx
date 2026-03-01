import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaDownload, FaPlay } from "react-icons/fa";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { api } from "../../services/api";
import type { Series } from "../../types/series";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { seriesFromDb } from "../../data/series";
import "./EpisodeDetail.css";

const EpisodeDetail = () => {
  const { seriesSlug, episodeSlug } = useParams<{
    seriesSlug: string;
    episodeSlug: string;
  }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!seriesSlug) return;
      try {
        const data = await api.getSeriesDetail(seriesSlug).catch(() => null);

        let finalSeries = data;
        if (!finalSeries) {
          finalSeries = seriesFromDb.find((s) => s.slug === seriesSlug) || null;
        }

        setSeries(finalSeries);
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

  return (
    <div className="episode-detail-container">
      {/* Video Player Section */}
      <div className="video-player-section">
        {episode.source_type === "upload" && episode.video_file ? (
          <video
            src={api.getMediaUrl(episode.video_file)}
            controls
            className="w-full h-full"
            poster={api.getMediaUrl(episode.thumbnail || series?.poster)}
          />
        ) : episode.source_type === "external" && episode.external_url ? (
          <div className="external-video-placeholder">
            <img
              src={api.getMediaUrl(episode.thumbnail || series?.poster)}
              alt={episode.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="detail-hero-overlay" />
            <a
              href={episode.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="play-overlay-btn"
            >
              <FaPlay size={40} />
              <span>Watch External Stream</span>
            </a>
          </div>
        ) : (
          <div className="no-video-placeholder">
            <img
              src={api.getMediaUrl(episode.thumbnail || series?.poster)}
              alt={episode.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="detail-hero-overlay" />
            <div className="no-video-text">Video Not Available</div>
          </div>
        )}
      </div>

      <div className="episode-content-body">
        {/* Navigation */}
        <div className="detail-controls" style={{ padding: "1rem 0" }}>
          <button className="back-btn" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i> Back to Series
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
                <a
                  href={api.getVideoUrl(episode)}
                  className="download-btn download-btn--small"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload /> Download Episode
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="episode-description-box">
          <h3>Overview</h3>
          <p>{episode.plot || series?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetail;
