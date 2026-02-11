import { Link } from "react-router-dom";
import type { Episode } from "../../types/series";

interface Props {
  episodes: Episode[];
}

const EpisodeList = ({ episodes }: Props) => {
  return (
    <div className="episode-list">
      {episodes.map((ep) => (
        <Link key={ep.id} to={`episode/${ep.id}`} className="episode-item">
          <div className="episode-thumb">
            {ep.thumbnail && <img src={ep.thumbnail} alt={ep.title} />}
            <div className="episode-number-overlay">E{ep.episode_number}</div>
          </div>
          <div className="episode-info">
            <strong>{ep.title}</strong>
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
