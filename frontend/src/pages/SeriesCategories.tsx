import SeriesRail from "../components/SeriesRail/SeriesRail";
import { categories } from "../data/categories";
import { seriesFromDb } from "../data/series";

const SeriesCategories = () => {
  return (
    <section className="content-section">
      <h1 className="section-title">TV Series</h1>

      {categories.map((category) => {
        const seriesInCategory = seriesFromDb.filter((show) =>
          show.categories.some((c) => c.id === category.id),
        );

        if (seriesInCategory.length === 0) return null;

        return (
          <SeriesRail
            key={category.id}
            title={category.name}
            series={seriesInCategory}
          />
        );
      })}
    </section>
  );
};

export default SeriesCategories;
