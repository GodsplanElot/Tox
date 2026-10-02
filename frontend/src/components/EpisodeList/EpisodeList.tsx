import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import type { Episode } from "../../types/series";
import { api } from "../../services/api";

interface Props {
  episodes: Episode[];
}

const EpisodeList = ({ episodes }: Props) => {
  if (episodes.length === 0) {
    return (
      <div className="episode-empty">
        <span>No episodes have been added to this season yet.</span>
      </div>
    );
  }

  return (
    <div className="episode-list">
      {episodes.map((ep) => {
        const hasDownload = ep.bunny_ready || ep.has_external_url || ep.download_available;
        const isHd = ep.bunny_ready;
        return (
          <Link key={ep.id} to={`episode/${ep.slug}`} className="episode-item">
            <div className="episode-thumb">
              {ep.thumbnail ? (
                <img
                  src={api.getMediaUrl(ep.thumbnail)}
                  alt={ep.title}
                  loading="lazy"
                />
              ) : (
                <div className="episode-thumb-fallback">
                  <span>Ep {ep.episode_number}</span>
                </div>
              )}
              <div className="episode-play-overlay" aria-hidden="true">
                <div className="episode-play-btn">
                  <FaPlay />
                </div>
              </div>
              <div className="episode-number-badge">E{ep.episode_number}</div>
            </div>

            <div className="episode-info">
              <strong>{ep.title}</strong>
              {ep.plot && <p>{ep.plot}</p>}
              <div className="episode-info-footer">
                {ep.runtime && (
                  <span className="episode-runtime">{ep.runtime} min</span>
                )}
                {hasDownload && (
                  <span className="episode-dl-badge">
                    {isHd ? "HD" : "DL"}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default EpisodeList;
