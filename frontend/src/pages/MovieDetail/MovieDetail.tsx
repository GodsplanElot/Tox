import React from "react";
import { useParams } from "react-router-dom";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import { moviesFromDb } from "../../data/movies";
import type { Movie } from "../../types/movie";
import "./MovieDetail.css";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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

  const relatedMovies = moviesFromDb
    .filter(
      (m) =>
        m.id !== movie.id &&
        m.genres?.some((g) => movie.genres?.includes(g))
    )
    .slice(0, 12);

  return (
    <div className="movie-detail">

      {/* HERO */}
      <section
        className="movie-detail__hero"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.5),
            rgba(0,0,0,0.95)
          ), url(${movie.backdrop || movie.poster})`,
        }}
      >
        <div className="movie-detail__hero-content">

          {/* MINI VIDEO SCREEN */}
          {movie.video && (
            <div className="movie-detail__video">
              <video
                src={movie.video.src}
                poster={movie.video.poster || movie.poster}
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            </div>
          )}

          {/* CORE INFO ONLY */}
          <div className="movie-detail__info">
            <h1>{movie.title}</h1>

            <div className="movie-detail__meta">
              {movie.year && <span>{movie.year}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.rating && <span>⭐ {movie.rating}</span>}
            </div>

            {movie.genres && (
              <div className="movie-detail__genres">
                {movie.genres.map((g) => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            )}

            {movie.description && (
              <p className="movie-detail__description">
                {movie.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDED */}
      {relatedMovies.length > 0 && (
        <section className="movie-detail__related">
          <MovieGrid title="Recommended" movies={relatedMovies} />
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
