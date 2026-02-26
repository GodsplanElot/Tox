import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaPlay, FaPlus, FaShareAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import EpisodeList from "../../components/EpisodeList/EpisodeList";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import RatingBadge from "../../components/common/RatingBadge";
import { api } from "../../services/api";
import type { Series } from "../../types/series";
import { Spinner, Container } from "react-bootstrap";
import "./SeriesDetail.css";

const SeriesDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(0);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!slug) return;
      try {
        const data = await api.getSeriesDetail(slug);
        setSeries(data);
      } catch (error) {
        console.error("Error fetching series detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [slug]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!series)
    return (
      <div className="p-5 text-center">
        <h2>Series not found</h2>
      </div>
    );

  return (
    <div className="series-detail-container">
      {/* Hero Section */}
      <div className="series-hero">
        <div
          className="detail-hero-backdrop"
          style={{
            backgroundImage: `url(${api.getMediaUrl(series.poster)})`,
          }}
        />
        <div className="detail-hero-overlay" />

        <div className="detail-hero-content">
          <div className="series-poster-main">
            <img src={api.getMediaUrl(series.poster)} alt={series.title} />
          </div>
          <div className="series-info-main">
            <div className="series-meta">
              {series.rating && (
                <RatingBadge rating={series.rating} size="medium" />
              )}
              {series.first_air_date && (
                <>
                  <span>{new Date(series.first_air_date).getFullYear()}</span>
                  <span>
                    {new Date(series.first_air_date).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
            <h1 className="series-title-large">{series.title}</h1>
            <div className="series-genres">
              {series.categories?.map((cat) => (
                <span key={cat.id} className="genre-tag">
                  {cat.name}
                </span>
              ))}
            </div>
            <p className="series-description-large">{series.description}</p>
            <div className="series-actions">
              <div className="download-group">
                <button className="download-btn download-btn--1080p">
                  <FaDownload /> 1080p
                </button>
                <button className="download-btn download-btn--720p">
                  720p
                </button>
                <button className="download-btn download-btn--480p">
                  480p
                </button>
              </div>

              <div className="secondary-actions">
                <button className="action-btn action-btn--trailer">
                  <FaPlay /> Watch Trailer
                </button>
                <button
                  className="action-btn action-btn--watchlist"
                  title="Add to Watchlist"
                >
                  <FaPlus /> Watchlist
                </button>
                <button className="action-btn action-btn--share" title="Share">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="detail-controls">
        <button className="back-btn" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <Breadcrumbs
          items={[
            { label: "Series", path: "/series" },
            { label: series.title, path: `/series/${series.slug}` },
          ]}
        />
      </div>

      {/* Seasons & Episodes Section */}
      <div className="series-body">
        {series.seasons && series.seasons.length > 0 ? (
          <>
            <div className="section-head">
              <h2>Seasons-({series.seasons.length})</h2>
              <SeasonSelector
                seasons={series.seasons}
                activeSeason={activeSeason}
                onSelect={setActiveSeason}
              />
            </div>
            <EpisodeList episodes={series.seasons[activeSeason].episodes} />
          </>
        ) : (
          <div className="p-5 text-center text-muted">
            <h3>No seasons available yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesDetail;
