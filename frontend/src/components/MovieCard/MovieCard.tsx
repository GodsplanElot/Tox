import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import type { Movie } from "../../types/movie";
import { api } from "../../services/api";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/movies/${movie.slug}`} className="movie-card">
      <div className="card-poster">
        <img
          src={api.getMediaUrl(movie.poster)}
          alt={movie.title}
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="card-rating">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {movie.rating ? movie.rating.toFixed(1) : "N/A"}
          </div>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <span className="card-year">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </span>
      </div>
    </Link>
  );
};

export default MovieCard;
