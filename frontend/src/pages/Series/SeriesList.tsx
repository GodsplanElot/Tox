import SeriesCard from "../../components/SeriesCard/SeriesCard"
import { seriesFromDb } from "../../data/series"

const SeriesList = () => {
  return (
    <div className="content-section">
      <h2 className="section-title">TV Series</h2>

      <div className="movie-grid">
        {seriesFromDb.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  )
}

export default SeriesList
