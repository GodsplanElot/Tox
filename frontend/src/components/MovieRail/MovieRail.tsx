import React from "react";
import MovieCard from "../MovieCard/MovieCard";
import Section from "../ui/Section";
import Rail from "../ui/Rail";
import type { Movie } from "../../types/movie";

interface MovieRailProps {
  title?: string;
  kicker?: string;
  href?: string;
  movies: Movie[];
}

const MovieRail: React.FC<MovieRailProps> = ({ title, kicker, href, movies }) => {
  if (movies.length === 0) return null;

  return (
    <Section title={title} kicker={kicker} href={href}>
      <Rail>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} className="w-[124px] shrink-0 sm:w-[142px] lg:w-[160px]" />
        ))}
      </Rail>
    </Section>
  );
};

export default MovieRail;
