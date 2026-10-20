import SeriesCard from "../SeriesCard/SeriesCard";
import Section from "../ui/Section";
import Rail from "../ui/Rail";
import type { Series } from "../../types/series";

interface Props {
  title?: string;
  kicker?: string;
  series: Series[];
  href?: string;
}

const SeriesRail = ({ title, kicker, series, href = "/series" }: Props) => {
  if (series.length === 0) return null;

  return (
    <Section title={title} kicker={kicker} href={href}>
      <Rail>
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} className="w-[132px] shrink-0 sm:w-[150px] lg:w-[170px]" />
        ))}
      </Rail>
    </Section>
  );
};

export default SeriesRail;
