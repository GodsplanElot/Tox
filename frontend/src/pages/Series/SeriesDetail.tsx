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
          className="detail-hero-backdrop"
          style={{
            backgroundImage: `url(${series.poster})`,
          }}
        />
        <div className="detail-hero-overlay" />

        <div className="detail-hero-content">
          <div className="series-poster-main">
            <img src={series.poster} alt={series.title} />
          </div>
          <div className="series-info-main">
            <div className="series-meta">
              <span className="rating-badge">★ {series.rating}</span>
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
            { label: series.title, path: `/series/${series.id}` },
          ]}
        />
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
