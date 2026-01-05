import React from "react";
import { Link } from "react-router-dom";
import MovieCard from "../MovieCard/MovieCard";
import type { Movie } from "../../types/movie";
import "./MovieGrid.css";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  showLimit?: boolean; // optional, default true
}

const MAX_MOVIES = 100;

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  title,
  showLimit = true,
}) => {
  const shouldLimit = showLimit && movies.length > MAX_MOVIES;
  const visibleMovies = shouldLimit ? movies.slice(0, MAX_MOVIES) : movies;

  return (
    <section className="movie-grid-section w-full">
      {title && <h2 className="movie-grid-title">{title}</h2>}
      <p className="movie-count">
       Showing 100 of {movies.length} movies
      </p>


      <div className="movie-grid">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {shouldLimit && (
        <div className="movie-grid-cta">
          <Link to="/categories" className="movie-grid-link">
           View all {movies.length} movies →
          </Link>
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
