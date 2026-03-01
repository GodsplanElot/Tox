import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import type { Movie } from "../../types/movie";
import { api } from "../../services/api";
import RatingBadge from "../common/RatingBadge";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/movies/${movie.slug}`} className="movie-card">
      <div className="movie-card-image">
        <img
          src={api.getMediaUrl(movie.poster)}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-card-rating">
          <RatingBadge rating={movie.rating || 0} size="small" />
        </div>
      </div>
      <div className="movie-card-info">
        <h4>{movie.title}</h4>
        <span>
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </span>
      </div>
    </Link>
  );
};

export default MovieCard;
