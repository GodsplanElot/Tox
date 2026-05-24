import { Link } from "react-router-dom";
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
      {episodes.map((ep) => (
        <Link key={ep.id} to={`episode/${ep.slug}`} className="episode-item">
          <div className="episode-thumb">
            {ep.thumbnail ? (
              <img src={api.getMediaUrl(ep.thumbnail)} alt={ep.title} />
            ) : (
              <div className="episode-thumb-fallback">Episode {ep.episode_number}</div>
            )}
            <div className="episode-number-badge">E{ep.episode_number}</div>
          </div>
          <div className="episode-info">
            <strong>{ep.title}</strong>
            {ep.plot && <p>{ep.plot}</p>}
            {ep.runtime && (
              <span className="episode-runtime">{ep.runtime} min</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EpisodeList;
