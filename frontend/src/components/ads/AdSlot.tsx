import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  NATIVE_ADSTERRA_CONTAINER_ID,
  NATIVE_ADSTERRA_SRC,
  type DisplayAdUnit,
  getDisplayAdConfig,
} from "./adsterraConfig";
import "./AdSlot.css";

type AdSlotProps = {
  unit: DisplayAdUnit | "native";
  className?: string;
  label?: string;
};

const buildDisplaySrcDoc = (unit: DisplayAdUnit) => {
  const config = getDisplayAdConfig(unit);
  const options = JSON.stringify({
    key: config.key,
    format: config.format,
    height: config.height,
    width: config.width,
    params: {},
  });

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: transparent;
      }
      body {
        display: grid;
        place-items: center;
      }
    </style>
  </head>
  <body>
    <script>
      window.atOptions = ${options};
      var atOptions = window.atOptions;
    </script>
    <script src="${config.src}"></script>
  </body>
</html>`;
};

const buildNativeSrcDoc = () => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        width: 100%;
        min-height: 100%;
        margin: 0;
        overflow: hidden;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script async data-cfasync="false" src="${NATIVE_ADSTERRA_SRC}"></script>
    <div id="${NATIVE_ADSTERRA_CONTAINER_ID}"></div>
  </body>
</html>`;

const useLazyAdRender = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || shouldRender) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px 0px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [shouldRender]);

  return { wrapperRef, shouldRender };
};

const AdSlot = ({ unit, className = "", label = "Advertisement" }: AdSlotProps) => {
  const frameId = useId();
  const { wrapperRef, shouldRender } = useLazyAdRender();
  const config = unit === "native" ? null : getDisplayAdConfig(unit);
  const srcDoc = useMemo(() => {
    if (!shouldRender) return "";
    return unit === "native" ? buildNativeSrcDoc() : buildDisplaySrcDoc(unit);
  }, [shouldRender, unit]);

  const width = config?.width ?? 720;
  const height = config?.height ?? 220;

  return (
    <div
      ref={wrapperRef}
      className={`ad-slot ad-slot--${unit.replace("x", "-")} ${className}`}
      style={{ "--ad-width": `${width}px`, "--ad-height": `${height}px` } as CSSProperties}
      aria-label={label}
    >
      <span className="ad-slot__label">{label}</span>
      {shouldRender ? (
        <iframe
          key={`${frameId}-${unit}`}
          className="ad-slot__frame"
          title={`${label} ${unit}`}
          srcDoc={srcDoc}
          width={width}
          height={height}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      ) : (
        <div className="ad-slot__reserve" aria-hidden="true" />
      )}
    </div>
  );
};

export default AdSlot;
