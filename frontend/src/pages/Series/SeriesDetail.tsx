import { useParams } from "react-router-dom"
import { seriesFromDb } from "../../data/series"
import { useState } from "react"
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector"
import EpisodeList from "../../components/EpisodeList/EpisodeList"

const SeriesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const series = seriesFromDb.find((s) => String(s.id) === id)

  const [activeSeason, setActiveSeason] = useState(0)

  if (!series) return <h2>Series not found</h2>

  return (
    <div className="movie-detail">
      <h1>{series.title}</h1>
      <p>{series.description}</p>

      <SeasonSelector
        seasons={series.seasons}
        activeSeason={activeSeason}
        onSelect={setActiveSeason}
      />

      <EpisodeList episodes={series.seasons[activeSeason].episodes} />
    </div>
  )
}

export default SeriesDetail
