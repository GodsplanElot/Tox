import { useEffect, useState } from "react";
import SeriesRail from "../components/SeriesRail/SeriesRail";
import { api } from "../services/api";
import type { Category, Series } from "../services/api";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SeriesCategories = () => {
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
        console.error("Error fetching series categories data:", error);
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
    .map((category) => {
      const seriesInCategory = series.filter((show) =>
        show.categories.some((c) => c.id === category.id),
      );
      return { category, seriesInCategory };
    })
    .filter((item) => item.seriesInCategory.length > 0);

  if (categorizedSeries.length === 0) {
    return (
      <EmptyState
        title="No Series Found"
        message="We couldn't find any TV series at the moment. Please check back later!"
      />
    );
  }

  return (
    <section className="content-section">
      <h1 className="section-title">TV Series</h1>

      {categorizedSeries.map(({ category, seriesInCategory }) => (
        <SeriesRail
          key={category.id}
          title={category.name}
          series={seriesInCategory}
        />
      ))}
    </section>
  );
};

export default SeriesCategories;
