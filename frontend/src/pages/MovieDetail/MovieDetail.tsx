import React from "react";
import { useParams } from "react-router-dom";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import { moviesFromDb } from "../../data/movies"; // adjust path if needed
import type { Movie } from "../../types/movie";
import "./MovieDetail.css";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Find movie by ID (mock DB)
  const movie: Movie | undefined = moviesFromDb.find(
    (m) => String(m.id) === id
  );

  if (!movie) {
    return (
      <div className="movie-detail__not-found">
        <h2>Movie not found</h2>
      </div>
    );
  }

  // Simple related movies logic (same genre, exclude current)
  const relatedMovies = moviesFromDb
    .filter(
      (m) =>
        m.id !== movie.id &&
        m.genres?.some((g) => movie.genres?.includes(g))
    )
    .slice(0, 12);

  return (
    <div className="movie-detail">
      {/* HERO SECTION */}
      <section
        className="movie-detail__hero"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.4),
            rgba(0,0,0,0.95)
          ), url(${movie.backdrop || movie.poster})`,
        }}
      >
        <div className="movie-detail__hero-content">
          <div className="movie-detail__poster">
            <img src={movie.poster} alt={movie.title} />
            {movie.rating && (
              <span className="movie-detail__rating">
                ⭐ {movie.rating}
              </span>
            )}
          </div>

          <div className="movie-detail__info">
            <h1 className="movie-detail__title">{movie.title}</h1>

            <div className="movie-detail__meta">
              {movie.year && <span>{movie.year}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
            </div>

            {movie.genres && (
              <div className="movie-detail__genres">
                {movie.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
            )}

            <p className="movie-detail__description">
              {movie.description}
            </p>

            {movie.trailer && (
              <a
                href={movie.trailer}
                target="_blank"
                rel="noreferrer"
                className="movie-detail__play-btn"
              >
                ▶ Watch Trailer
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      {relatedMovies.length > 0 && (
        <section className="movie-detail__related">
          <MovieGrid
            title="More Like This"
            movies={relatedMovies}
          />
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
