import { Link } from "react-router-dom"
import type { Episode } from "../../types/series"

interface Props {
  episodes: Episode[]
}

const EpisodeList = ({ episodes }: Props) => {
  return (
    <div className="episode-list">
      {episodes.map((ep) => (
        <Link
          key={ep.id}
          to={`episode/${ep.id}`}
          className="episode-item"
        >
          <span>E{ep.episodeNumber}</span>
          <strong>{ep.title}</strong>
        </Link>
      ))}
    </div>
  )
}

export default EpisodeList
