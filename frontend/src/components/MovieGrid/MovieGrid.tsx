import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import MovieCard from "../MovieCard/MovieCard";
import type { Movie } from "../../types/movie";
import { buttonClass } from "../ui/buttonClass";

interface MovieGridProps {
  movies: Movie[];
  showLimit?: boolean;
}

const MAX_MOVIES = 100;

/** Responsive poster grid. Wrap in a `Section` for the heading and gutter. */
const MovieGrid: React.FC<MovieGridProps> = ({ movies, showLimit = true }) => {
  const shouldLimit = showLimit && movies.length > MAX_MOVIES;
  const visibleMovies = shouldLimit ? movies.slice(0, MAX_MOVIES) : movies;

  return (
    <>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {shouldLimit && (
        <div className="mt-8 flex justify-center">
          <Link to="/movies" className={buttonClass("secondary")}>
            View all {movies.length} movies <FiArrowRight />
          </Link>
        </div>
      )}
    </>
  );
};

export default MovieGrid;
