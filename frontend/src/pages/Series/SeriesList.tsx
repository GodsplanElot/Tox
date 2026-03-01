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
    <div className="series-list-page container-fluid py-4">
      <header className="mb-5 border-bottom pb-3">
        <h1 className="display-5 fw-bold text-white">TV Series</h1>
        <p className="text-muted">Explore the best shows by category</p>
      </header>

      {categorizedSeries.map(({ cat, filteredSeries }, index) => (
        <div key={cat.id} className="category-section mb-5 animate-in">
          {index > 0 && <hr className="my-5 opacity-25 border-light" />}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="category-accent" />
            <h2 className="h4 fw-bold mb-0 text-uppercase tracking-wider">
              {cat.name}
            </h2>
            <span className="badge rounded-pill bg-dark text-muted border border-secondary py-2 px-3 ms-auto">
              {filteredSeries.length} SHOWS
            </span>
          </div>
          <SeriesRail title="" series={filteredSeries} />
        </div>
      ))}
    </div>
  );
};

export default SeriesList;
