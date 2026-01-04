import React from "react";
import MovieCard, { Movie } from "../MovieCard/MovieCard";
import "./MovieGrid.css";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, title }) => {
  return (
    <section className="movie-grid-section w-full">
      {title && <h2 className="movie-grid-title">{title}</h2>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
