import SeriesRail from "../../components/SeriesRail/SeriesRail";
import { seriesFromDb } from "../../data/series";
import { categories } from "../../data/categories";
import "./SeriesList.css";

const SeriesList = () => {
  return (
    <div className="series-list-page container-fluid py-4">
      <header className="mb-5 border-bottom pb-3">
        <h1 className="display-5 fw-bold text-white">TV Series</h1>
        <p className="text-muted">Explore the best shows by category</p>
      </header>

      {categories.map((cat, index) => {
        const filteredSeries = seriesFromDb.filter((s) =>
          s.categoryIds.includes(cat.id),
        );

        // Only show category if it has series
        if (filteredSeries.length === 0) return null;

        return (
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
        );
      })}
    </div>
  );
};

export default SeriesList;
