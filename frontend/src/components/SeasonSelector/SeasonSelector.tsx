import type { Season } from "../../types/series";

interface Props {
  seasons: Season[];
  activeSeason: number;
  onSelect: (index: number) => void;
}

const SeasonSelector = ({ seasons, activeSeason, onSelect }: Props) => {
  return (
    <div className="season-selector">
      {seasons.map((season, index) => (
        <button
          key={season.id}
          className={index === activeSeason ? "active" : ""}
          onClick={() => onSelect(index)}
        >
          Season {season.season_number}
        </button>
      ))}
    </div>
  );
};

export default SeasonSelector;
