import { useCallback, useRef, useState } from "react";
import { FiCheck, FiChevronLeft, FiChevronRight, FiSettings } from "react-icons/fi";
import { useDismiss } from "../ui/useDismiss";
import { cn } from "../ui/cn";
import type { QualityLevel } from "./useHls";
import { PLAYBACK_RATES } from "./format";

type SettingsMenuProps = {
  levels: QualityLevel[];
  selectedLevel: number;
  activeLevel: number;
  onLevelChange: (index: number) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  onOpenChange?: (open: boolean) => void;
  buttonClassName: string;
};

type Panel = "root" | "quality" | "speed";

const rowClass =
  "flex w-full items-center justify-between gap-6 rounded-lg px-3 py-2 text-left text-[13px] text-white/85 transition hover:bg-white/10";

const SettingsMenu = ({
  levels,
  selectedLevel,
  activeLevel,
  onLevelChange,
  rate,
  onRateChange,
  onOpenChange,
  buttonClassName,
}: SettingsMenuProps) => {
  const [panel, setPanel] = useState<Panel | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: Panel | null) => {
      setPanel(next);
      onOpenChange?.(next !== null);
    },
    [onOpenChange],
  );
  const close = useCallback(() => setOpen(null), [setOpen]);
  useDismiss(ref, panel !== null, close);

  const activeHeight = levels.find((l) => l.index === activeLevel)?.height;
  const qualityLabel =
    selectedLevel === -1
      ? `Auto${activeHeight ? ` · ${activeHeight}p` : ""}`
      : `${levels.find((l) => l.index === selectedLevel)?.height ?? ""}p`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={panel !== null}
        onClick={() => setOpen(panel ? null : "root")}
        className={buttonClassName}
      >
        <FiSettings className={cn("transition-transform duration-300", panel && "rotate-45")} />
      </button>

      {panel && (
        <div
          role="menu"
          className="absolute right-0 bottom-[calc(100%+12px)] z-30 w-60 origin-bottom-right animate-scale-in rounded-xl bg-ink-900/90 p-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
        >
          {panel === "root" && (
            <>
              {levels.length > 1 && (
                <button type="button" className={rowClass} onClick={() => setPanel("quality")}>
                  Quality
                  <span className="flex items-center gap-1 text-white/55">
                    {qualityLabel} <FiChevronRight className="size-3.5" />
                  </span>
                </button>
              )}
              <button type="button" className={rowClass} onClick={() => setPanel("speed")}>
                Speed
                <span className="flex items-center gap-1 text-white/55">
                  {rate === 1 ? "Normal" : `${rate}×`} <FiChevronRight className="size-3.5" />
                </span>
              </button>
            </>
          )}

          {panel !== "root" && (
            <>
              <button
                type="button"
                onClick={() => setPanel("root")}
                className="mb-1 flex w-full items-center gap-1.5 border-b border-white/10 px-2 pt-1 pb-2 text-[13px] font-semibold text-white"
              >
                <FiChevronLeft className="size-4" /> {panel === "quality" ? "Quality" : "Playback speed"}
              </button>
              <div className="max-h-56 overflow-y-auto">
                {panel === "quality"
                  ? [{ index: -1, height: 0, bitrate: 0 }, ...levels].map((level) => (
                      <button
                        key={level.index}
                        type="button"
                        role="menuitemradio"
                        aria-checked={selectedLevel === level.index}
                        className={rowClass}
                        onClick={() => {
                          onLevelChange(level.index);
                          close();
                        }}
                      >
                        <span>
                          {level.index === -1 ? "Auto" : `${level.height}p`}
                          {level.height >= 720 && <span className="ml-1.5 text-[10px] font-bold text-accent">HD</span>}
                        </span>
                        {selectedLevel === level.index && <FiCheck className="size-4 text-accent" />}
                      </button>
                    ))
                  : PLAYBACK_RATES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={rate === value}
                        className={rowClass}
                        onClick={() => {
                          onRateChange(value);
                          close();
                        }}
                      >
                        {value === 1 ? "Normal" : `${value}×`}
                        {rate === value && <FiCheck className="size-4 text-accent" />}
                      </button>
                    ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
