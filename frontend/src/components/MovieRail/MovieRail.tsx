import { RiRadiationLine } from "react-icons/ri";

const MovieRail: React.FC<MovieRailProps> = ({ title, movies }) => {
  return (
    <section className="content-section">
      <div className="section-header">
        <span className="title-icon">
          <RiRadiationLine />
        </span>
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="movie-rail">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieRail;
