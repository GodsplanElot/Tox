import React from "react";
import "./MovieCard.css";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-card-image">
        <img src={movie.poster} alt={movie.title} loading="lazy" />
      </div>

      <div className="movie-card-info">
        <h4>{movie.title}</h4>
        {movie.year && <span>{movie.year}</span>}
      </div>
    </div>
  );
};

export default MovieCard;
