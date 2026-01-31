import { useParams, useNavigate } from "react-router-dom";
import { seriesFromDb } from "../../data/series";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import "./EpisodeDetail.css";

const EpisodeDetail = () => {
  const { seriesId, episodeId } = useParams();
  const navigate = useNavigate();

  const series = seriesFromDb.find((s) => String(s.id) === seriesId);
  const episode = series?.seasons
    .flatMap((s) => s.episodes)
    .find((e) => String(e.id) === episodeId);

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
      {/* Video Section */}
      <div className="video-player-section">
        <video
          src={episode.videoUrl}
          controls
          autoPlay
          poster={episode.thumb || series?.backdrop}
        />
      </div>

      <div className="episode-content-body">
        {/* Navigation */}
        <div className="detail-controls" style={{ padding: "1rem 0" }}>
          <button className="back-btn" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i> Back to Series
          </button>
          <Breadcrumbs />
        </div>

        {/* Content */}
        <div className="episode-header-main">
          <div className="episode-meta-top">
            <span>Episode {episode.episodeNumber}</span>
            {episode.runtime && (
              <>
                <span className="dot">•</span>
                <span>{episode.runtime} min</span>
              </>
            )}
          </div>
          <h1 className="episode-title-large">{episode.title}</h1>
        </div>

        <div className="episode-description-box">
          <h3>Overview</h3>
          <p>{series?.description}</p>
          <p className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
            This is where episode-specific descriptions would go if available in
            the data model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetail;
