import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import type { Movie } from "../../types/movie";
import RatingBadge from "../common/RatingBadge";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="movie-card"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-card-image">
        <img src={movie.poster} alt={movie.title} loading="lazy" />
        {movie.rating && (
          <div className="movie-card-rating">
            <RatingBadge rating={movie.rating} size="small" />
          </div>
        )}
      </div>

      <div className="movie-card-info">
        <h4>{movie.title}</h4>
        {movie.release_date && (
          <span>{new Date(movie.release_date).getFullYear()}</span>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
