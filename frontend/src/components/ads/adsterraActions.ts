import { ADSTERRA_POPUNDER_SRC } from "./adsterraConfig";

const POPUNDER_STORAGE_KEY = "tox_adsterra_popunder_last_seen";
const POPUNDER_INTERVAL_MS = 12 * 60 * 60 * 1000;

export const triggerAdsterraPopunder = () => {
  if (!ADSTERRA_POPUNDER_SRC || typeof window === "undefined") return;

  const lastSeen = Number(window.localStorage.getItem(POPUNDER_STORAGE_KEY) || "0");
  const now = Date.now();

  if (Number.isFinite(lastSeen) && now - lastSeen < POPUNDER_INTERVAL_MS) {
    return;
  }

  window.localStorage.setItem(POPUNDER_STORAGE_KEY, String(now));

  const script = document.createElement("script");
  script.src = ADSTERRA_POPUNDER_SRC;
  script.async = true;
  script.dataset.adsterraPopunder = "true";
  document.body.appendChild(script);
};
