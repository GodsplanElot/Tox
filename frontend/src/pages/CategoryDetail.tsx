import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import { api } from "../services/api";
import type { Movie, Series, Category } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

import MovieGrid from "../components/MovieGrid/MovieGrid";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import AdResponsiveBanner from "../components/ads/AdResponsiveBanner";
import AdSlot from "../components/ads/AdSlot";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { chipClass } from "../components/ui/chipClass";

type SortOption = "az" | "newest" | "oldest" | "rating";

const SORTS: { key: SortOption; label: string }[] = [
  { key: "az", label: "A–Z" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "rating", label: "Top rated" },
];

const CategoryDetail = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState<SortOption>("az");
  const [category, setCategory] = useState<Category | null>(null);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch only this category's titles, across every page.
        const [catData, allMovies, allSeries] = await Promise.all([
          api.getCategories().catch(() => []),
          slug ? api.getAllMovies(slug).catch(() => []) : Promise.resolve([]),
          slug ? api.getAllSeries(slug).catch(() => []) : Promise.resolve([]),
        ]);

        const currentCat = catData.find((c) => c.slug === slug) || null;

        setCategory(currentCat);
        setMoviesList(allMovies);
        setSeriesList(allSeries);
      } catch (error) {
        console.error("Error fetching category detail data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  /**
   * MOVIES
   */
  const movies = useMemo(() => {
    if (!category) return [];

    const filtered = moviesList.filter((movie) =>
      movie.categories.some((c) => c.id === category.id),
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);

        case "newest":
          return (
            new Date(b.release_date ?? "").getTime() -
            new Date(a.release_date ?? "").getTime()
          );

        case "oldest":
          return (
            new Date(a.release_date ?? "").getTime() -
            new Date(b.release_date ?? "").getTime()
          );

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return 0;
      }
    });
  }, [category, sortBy, moviesList]);

  /**
   * SERIES
   */
  const series = useMemo(() => {
    if (!category) return [];

    const filtered = seriesList.filter((show) =>
      show.categories.some((c) => c.id === category.id),
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);

        case "newest":
          return (
            new Date(b.first_air_date ?? "").getTime() -
            new Date(a.first_air_date ?? "").getTime()
          );

        case "oldest":
          return (
            new Date(a.first_air_date ?? "").getTime() -
            new Date(b.first_air_date ?? "").getTime()
          );

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return 0;
      }
    });
  }, [category, sortBy, seriesList]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!category) {
    return <EmptyState title="Category not found" message="This genre doesn't exist or is no longer available." />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader kicker="Genre" title={category.name} description={category.description}>
        <div className="bleed-x flex gap-1.5 overflow-x-auto scrollbar-none sm:mx-0 sm:px-0" role="group" aria-label="Sort titles">
          {SORTS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={sortBy === option.key}
              onClick={() => setSortBy(option.key)}
              className={chipClass(sortBy === option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {series.length > 0 && <SeriesRail kicker={`${series.length} shows`} title="TV series" series={series} />}

      {movies.length > 0 && (
        <Section title="Movies" meta={`${movies.length}`}>
          <MovieGrid movies={movies} />
        </Section>
      )}

      {movies.length === 0 && series.length === 0 && (
        <EmptyState title="Nothing here yet" message="No movies or TV series found in this category." />
      )}

      <div className="page-x">
        <AdResponsiveBanner className="mt-12" />
        {movies.length > 0 && series.length > 0 && <AdSlot unit="300x250" className="my-8" />}
      </div>
    </div>
  );
};

export default CategoryDetail;
