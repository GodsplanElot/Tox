export type DisplayAdUnit =
  | "468x60"
  | "160x300"
  | "320x50"
  | "728x90"
  | "300x250"
  | "160x600";

export type AdsterraDisplayConfig = {
  key: string;
  format: "iframe";
  height: number;
  width: number;
  src: string;
};

const displayDefaults: Record<DisplayAdUnit, AdsterraDisplayConfig> = {
  "468x60": {
    key: "555872033f85919476263e287b7096a5",
    format: "iframe",
    height: 60,
    width: 468,
    src: "https://www.highrevenueformat.com/555872033f85919476263e287b7096a5/invoke.js",
  },
  "160x300": {
    key: "ca7669d168df1f55e42445371640f972",
    format: "iframe",
    height: 300,
    width: 160,
    src: "https://www.highrevenueformat.com/ca7669d168df1f55e42445371640f972/invoke.js",
  },
  "320x50": {
    key: "b0c09ead4fa5b5a6fec3784823ee21cb",
    format: "iframe",
    height: 50,
    width: 320,
    src: "https://www.highrevenueformat.com/b0c09ead4fa5b5a6fec3784823ee21cb/invoke.js",
  },
  "728x90": {
    key: "8f2fed0ad68e6b21ec867767c504bcb2",
    format: "iframe",
    height: 90,
    width: 728,
    src: "https://www.highrevenueformat.com/8f2fed0ad68e6b21ec867767c504bcb2/invoke.js",
  },
  "300x250": {
    key: "65fb2158eebb200ce1ad32b9cda3e2f3",
    format: "iframe",
    height: 250,
    width: 300,
    src: "https://www.highrevenueformat.com/65fb2158eebb200ce1ad32b9cda3e2f3/invoke.js",
  },
  "160x600": {
    key: "5d5bd91424d8d1eb351989c24992bcaf",
    format: "iframe",
    height: 600,
    width: 160,
    src: "https://www.highrevenueformat.com/5d5bd91424d8d1eb351989c24992bcaf/invoke.js",
  },
};

export const NATIVE_ADSTERRA_CONTAINER_ID =
  "container-752bcad22ec54c7410df4a4bd8166e0f";

export const NATIVE_ADSTERRA_SRC =
  import.meta.env.VITE_ADSTERRA_NATIVE_SRC ||
  "https://pl29588396.profitableratecpmnetwork.com/752bcad22ec54c7410df4a4bd8166e0f/invoke.js";

export const ADSTERRA_POPUNDER_SRC =
  import.meta.env.VITE_ADSTERRA_POPUNDER_SRC ||
  "https://pl29588395.profitableratecpmnetwork.com/b3/56/68/b35668d93b4441b9e6698faaa2db4128.js";

export const ADSTERRA_SMARTLINK_URL =
  import.meta.env.VITE_ADSTERRA_SMARTLINK_URL ||
  "https://www.profitableratecpmnetwork.com/b3c67da0gj?key=f79fdb3840e94b6e5a45d4995898fa6f";

const envToken = (unit: DisplayAdUnit) => unit.replace("x", "X");

const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getDisplayAdConfig = (unit: DisplayAdUnit): AdsterraDisplayConfig => {
  const defaults = displayDefaults[unit];
  const token = envToken(unit);

  return {
    key: import.meta.env[`VITE_ADSTERRA_${token}_KEY`] || defaults.key,
    format:
      (import.meta.env[`VITE_ADSTERRA_${token}_FORMAT`] as "iframe" | undefined) ||
      defaults.format,
    height: numberFromEnv(
      import.meta.env[`VITE_ADSTERRA_${token}_HEIGHT`],
      defaults.height,
    ),
    width: numberFromEnv(
      import.meta.env[`VITE_ADSTERRA_${token}_WIDTH`],
      defaults.width,
    ),
    src: import.meta.env[`VITE_ADSTERRA_${token}_SRC`] || defaults.src,
  };
};
