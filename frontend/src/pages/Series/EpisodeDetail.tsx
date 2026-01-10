import { useParams } from "react-router-dom"
import { seriesFromDb } from "../../data/series"

const EpisodeDetail = () => {
  const { seriesId, episodeId } = useParams()

  const series = seriesFromDb.find((s) => String(s.id) === seriesId)
  const episode =
    series?.seasons
      .flatMap((s) => s.episodes)
      .find((e) => String(e.id) === episodeId)

  if (!episode) return <h2>Episode not found</h2>

  return (
    <div className="movie-detail">
      <h2>{episode.title}</h2>

      <video
        src={episode.videoUrl}
        controls
        style={{ width: "100%", maxWidth: 900 }}
      />
    </div>
  )
}

export default EpisodeDetail
