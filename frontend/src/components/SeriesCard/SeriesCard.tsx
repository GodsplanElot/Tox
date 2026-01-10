import { Link } from "react-router-dom"
import type { Series } from "../../types/series"
import "./SeriesCard.css"

interface Props {
  series: Series
}

const SeriesCard = ({ series }: Props) => {
  return (
    <Link to={`/series/${series.id}`} className="series-card">
      <img src={series.poster} alt={series.title} />
      <div className="series-card-info">
        <h4>{series.title}</h4>
        {series.year && <span>{series.year}</span>}
      </div>
    </Link>
  )
}

export default SeriesCard
