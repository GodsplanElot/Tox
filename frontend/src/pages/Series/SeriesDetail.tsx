import { useParams, useNavigate } from "react-router-dom";
import { seriesFromDb } from "../../data/series";
import { useState } from "react";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import EpisodeList from "../../components/EpisodeList/EpisodeList";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import "./SeriesDetail.css";

const SeriesDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const series = seriesFromDb.find((s) => String(s.id) === id);

  const [activeSeason, setActiveSeason] = useState(0);

  if (!series)
    return (
      <div className="p-5 text-center">
        <h2>Series not found</h2>
      </div>
    );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="series-detail-container">
      {/* Hero Section */}
      <div className="series-hero">
        <div
          className="hero-backdrop"
          style={{
            backgroundImage: `url(${series.backdrop || series.poster})`,
          }}
        />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="series-poster-main">
            <img src={series.poster} alt={series.title} />
          </div>
          <div className="series-info-main">
            <div className="series-meta">
              <span className="rating-badge">★ {series.rating}</span>
              <span>{series.year}</span>
              {series.firstAirDate && (
                <span>
                  {new Date(series.firstAirDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="series-title-large">{series.title}</h1>
            <div className="series-genres">
              {series.genres?.map((genre) => (
                <span key={genre} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
            <p className="series-description-large">{series.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="detail-controls">
        <button className="back-btn" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <Breadcrumbs />
      </div>

      {/* Seasons & Episodes Section */}
      <div className="series-body">
        <div className="section-head">
          <h2>Seasons-({series.seasons.length})</h2>
          <SeasonSelector
            seasons={series.seasons}
            activeSeason={activeSeason}
            onSelect={setActiveSeason}
          />
        </div>

        <EpisodeList episodes={series.seasons[activeSeason].episodes} />
      </div>
    </div>
  );
};

export default SeriesDetail;
