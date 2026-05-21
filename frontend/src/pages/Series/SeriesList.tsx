import { useEffect, useState } from "react";
import SeriesRail from "../../components/SeriesRail/SeriesRail";
import { api } from "../../services/api";
import type { Category, Series } from "../../services/api";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./SeriesList.css";

const SeriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, seriesData] = await Promise.all([
          api.getCategories(),
          api.getSeries(),
        ]);
        setCategories(catData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching series list data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const categorizedSeries = categories
    .map((cat) => {
      const filteredSeries = series.filter((s) =>
        s.categories.some((c) => c.id === cat.id),
      );
      return { cat, filteredSeries };
    })
    .filter((item) => item.filteredSeries.length > 0);

  if (categorizedSeries.length === 0) {
    return (
      <EmptyState
        title="No Series Available"
        message="We couldn't find any TV series at the moment. Please check back later!"
      />
    );
  }

  return (
    <div className="series-list-page">
      <header className="series-list-hero">
        <span>Serial Picks</span>
        <h1>TV Series</h1>
        <p>Browse shows by genre, from new obsessions to long-running favorites.</p>
      </header>

      {categorizedSeries.map(({ cat, filteredSeries }, index) => (
        <div key={cat.id} className="category-section animate-in" style={{ animationDelay: `${index * 70}ms` }}>
          <div className="category-section__header">
            <h2>{cat.name}</h2>
            <span>{filteredSeries.length} shows</span>
          </div>
          <SeriesRail title="" series={filteredSeries} />
        </div>
      ))}
    </div>
  );
};

export default SeriesList;
