import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Category, Movie } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MovieRail from "../components/MovieRail/MovieRail";
import PageHeader from "../components/ui/PageHeader";
import { FiArrowUpRight } from "react-icons/fi";
import { hideBrokenImage } from "../components/ui/hideBrokenImage";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, moviesData] = await Promise.all([
          api.getCategories(),
          api.getAllMovies().catch(() => []), // Rails still render the genre tiles if movies fail
        ]);
        setCategories(catsData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const genreSections = useMemo(() => {
    return categories
      .map((category) => {
        const categoryMovies = movies
          .filter((movie) => movie.categories?.some((c) => c.id === category.id))
          .sort((a, b) => {
            const dateA = new Date(a.created_at || a.release_date || 0).getTime();
            const dateB = new Date(b.created_at || b.release_date || 0).getTime();
            return dateB - dateA;
          });

        // Counts come from the API (published titles); fall back to the loaded movies.
        const movieCount = category.movie_count ?? categoryMovies.length;
        const seriesCount = category.series_count ?? 0;

        return {
          category,
          movies: categoryMovies,
          poster: category.poster || categoryMovies[0]?.poster || null,
          movieCount,
          seriesCount,
          featuredCount: movieCount + seriesCount,
        };
      })
      .filter((section) => section.featuredCount > 0 || section.category.is_active !== false);
  }, [categories, movies]);

  const movieSections = genreSections.filter((section) => section.movies.length > 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No Categories Available"
        message="We couldn't find any genres at the moment. Please check back later!"
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        kicker="Genre atlas"
        title="Choose the mood, then press play."
        description="Drift through curated worlds of action, drama, suspense, comedy, and everything in between."
      />

      <section aria-label="Movie genres" className="page-x mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {genreSections.map(({ category: cat, poster, movieCount, seriesCount, featuredCount }, index) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="group relative isolate flex aspect-[16/11] animate-fade-up flex-col justify-end overflow-hidden rounded-2xl bg-ink-800 p-4 ring-1 ring-white/[0.07] transition duration-300 hover:ring-white/20 sm:p-5"
            style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
          >
            {poster && (
              <img
                onError={hideBrokenImage}
                src={api.getMediaUrl(poster)}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 size-full object-cover opacity-50 saturate-[0.85] transition duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-70"
              />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/10" />
            <FiArrowUpRight className="absolute top-3.5 right-3.5 size-4 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            <span className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
              {featuredCount > 0
                ? [
                    movieCount ? `${movieCount} ${movieCount === 1 ? "movie" : "movies"}` : null,
                    seriesCount ? `${seriesCount} series` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : "Coming soon"}
            </span>
            <h2 className="mt-1 truncate font-display text-lg font-semibold text-white sm:text-xl">{cat.name}</h2>
            {cat.description && (
              <p className="mt-1 line-clamp-2 hidden text-xs leading-snug text-white/60 sm:block">{cat.description}</p>
            )}
          </Link>
        ))}
      </section>

      {movieSections.map(({ category, movies: categoryMovies }) => (
        <MovieRail
          key={category.id}
          kicker={`${categoryMovies.length} ${categoryMovies.length === 1 ? "movie" : "movies"}`}
          title={category.name}
          href={`/categories/${category.slug}`}
          movies={categoryMovies.slice(0, 18)}
        />
      ))}
    </div>
  );
};

export default Categories;
