import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { api } from "../services/api";
import type { Movie } from "../types/movie";

interface HeroCarouselProps {
  movies: Movie[];
}

const HeroCarousel = ({ movies }: HeroCarouselProps) => {
  const [index, setIndex] = useState(0);

  const handleSelect = useCallback((selectedIndex: number) => {
    setIndex(selectedIndex);
  }, []);

  if (!movies || movies.length === 0) return null;

  // Take top 5 movies for the carousel
  const carouselMovies = movies.slice(0, 5);

  return (
    <section className="hero-carousel">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={6000}
        pause="hover"
        controls
        indicators
      >
        {carouselMovies.map((movie) => (
          <Carousel.Item key={movie.id}>
            <div
              className="hero-bg"
              style={{
                backgroundImage: `url(${api.getMediaUrl(movie.poster)})`,
              }}
            />
            <div className="hero-fade" />
            <div className="hero-content">
              <h1 className="hero-title">
                {movie.title}
                {movie.rating && (
                  <span
                    className={`hero-rating hero-rating--${movie.rating >= 8 ? "green" : movie.rating >= 6 ? "yellow" : "red"}`}
                  >
                    {movie.rating.toFixed(1)}
                  </span>
                )}
              </h1>

              <p className="hero-description line-clamp-3">
                {movie.description}
              </p>

              <div className="hero-categories">
                {movie.categories?.map((cat) => (
                  <span key={cat.id} className="category-badge">
                    {cat.name}
                  </span>
                ))}
              </div>

              <Link
                to={`/movies/${movie.slug}`}
                className="hero-cta btn btn-primary"
              >
                Watch Now
              </Link>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
