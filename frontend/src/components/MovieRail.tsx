import MovieCard from "./MovieCard"

type Movie = {
  id: string
  title: string
  poster: string
  rating?: number
}

type MovieRailProps = {
  title: string
  movies: Movie[]
}

const MovieRail = ({ title, movies }: MovieRailProps) => {
  return (
    <section className="content-section">
      <h2 className="section-title">{title}</h2>

      <div className="movie-rail">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={movie.poster}
            rating={movie.rating}
          />
        ))}
      </div>
    </section>
  )
}

export default MovieRail
