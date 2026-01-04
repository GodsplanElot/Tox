import { Link } from "react-router-dom"

type MovieCardProps = {
  id: string
  title: string
  poster: string
  rating?: number
}

const MovieCard = ({ id, title, poster, rating }: MovieCardProps) => {
  return (
    <Link to={`/details/${id}`} className="movie-card">
      <div className="movie-poster">
        <img src={poster} alt={title} />
        {rating && <span className="movie-rating">{rating}</span>}
      </div>
      <p className="movie-title">{title}</p>
    </Link>
  )
}

export default MovieCard
