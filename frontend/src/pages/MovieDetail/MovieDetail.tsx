import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import { api } from "../../services/api";
import type { Movie } from "../../types/movie";
import RatingBadge from "../../components/common/RatingBadge";
import { FaDownload, FaPlay, FaPlus, FaShareAlt } from "react-icons/fa";
import { Spinner, Container } from "react-bootstrap";
import "./MovieDetail.css";

const MovieDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!slug) return;
      try {
        const [movieData, allMovies] = await Promise.all([
          api.getMovie(slug),
          api.getMovies(),
        ]);
        setMovie(movieData);

        // Simple related movies logic (same categories, exclude current)
        const related = allMovies
          .filter(
            (m) =>
              m.id !== movieData.id &&
              m.categories?.some((cat) =>
                movieData.categories?.some((c) => c.id === cat.id),
              ),
          )
          .slice(0, 12);
        setRelatedMovies(related);
      } catch (error) {
        console.error("Error fetching movie detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [slug]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail__not-found">
        <h2>Movie not found</h2>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      {/* HERO SECTION */}
      <section
        className="movie-detail__hero"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.4),
            rgba(0,0,0,0.95)
          ), url(${api.getMediaUrl(movie.poster)})`,
        }}
      >
        <div className="movie-detail__hero-content">
          <div className="movie-detail__poster">
            <img src={api.getMediaUrl(movie.poster)} alt={movie.title} />
            {movie.rating && (
              <div className="movie-detail__rating">
                <RatingBadge rating={movie.rating} size="medium" />
              </div>
            )}
          </div>

          <div className="movie-detail__info">
            <h1 className="movie-detail__title">{movie.title}</h1>

            <div className="movie-detail__meta">
              {movie.release_date && (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.runtime && <span>{movie.runtime} min</span>}
            </div>

            {movie.categories && (
              <div className="movie-detail__genres">
                {movie.categories.map((cat) => (
                  <span key={cat.id}>{cat.name}</span>
                ))}
              </div>
            )}

            <p className="movie-detail__description">{movie.description}</p>

            <div className="movie-detail__actions">
              <div className="download-group">
                <button className="download-btn download-btn--1080p">
                  <FaDownload /> 1080p
                </button>
                <button className="download-btn download-btn--720p">
                  720p
                </button>
                <button className="download-btn download-btn--480p">
                  480p
                </button>
              </div>

              <div className="secondary-actions">
                <button className="action-btn action-btn--trailer">
                  <FaPlay /> Watch Trailer
                </button>
                <button
                  className="action-btn action-btn--watchlist"
                  title="Add to Watchlist"
                >
                  <FaPlus /> Watchlist
                </button>
                <button className="action-btn action-btn--share" title="Share">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      {relatedMovies.length > 0 && (
        <section className="movie-detail__related">
          <MovieGrid title="More Like This" movies={relatedMovies} />
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
