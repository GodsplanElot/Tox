import SeriesCard from "../SeriesCard/SeriesCard";
import type { Series } from "../../types/series";

interface Props {
  title: string;
  series: Series[];
}

const SeriesRail = ({ title, series }: Props) => {
  return (
    <section className="content-section">
      {title && (
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
        </div>
      )}

      <div className="movie-rail">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
};

export default SeriesRail;
