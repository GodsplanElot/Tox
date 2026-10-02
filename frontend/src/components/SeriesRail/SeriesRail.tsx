import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import SeriesCard from "../SeriesCard/SeriesCard";
import type { Series } from "../../types/series";

interface Props {
  title: string;
  series: Series[];
}

const SeriesRail = ({ title, series }: Props) => {
  if (series.length === 0) return null;

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link to="/series" className="section-see-all">
          See All <FaChevronRight />
        </Link>
      </div>

      <div className="series-rail">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
};

export default SeriesRail;
