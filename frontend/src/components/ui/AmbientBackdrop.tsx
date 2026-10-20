import { cn } from "./cn";

type AmbientBackdropProps = {
  /** Image whose colours bleed into the page as a soft glow. */
  glow: string;
  /** Optional crisp landscape image, faded in from the right. */
  image?: string | null;
  className?: string;
};

/**
 * Cinematic page backdrop: a heavily blurred colour wash of the artwork, an
 * optional sharp still masked in from one side, and a layer of film grain.
 * Place inside a `relative isolate` container.
 */
const AmbientBackdrop = ({ glow, image, className }: AmbientBackdropProps) => (
  <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
    <img
      src={glow}
      alt=""
      className="absolute inset-0 size-full scale-150 object-cover opacity-45 blur-3xl saturate-[1.6]"
    />
    {image && (
      <img
        src={image}
        alt=""
        className="absolute inset-y-0 right-0 h-full w-full object-cover object-[center_20%] opacity-55 [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)] lg:w-[72%] lg:[mask-image:linear-gradient(to_left,black_25%,transparent_90%),linear-gradient(to_bottom,black_50%,transparent)] lg:[mask-composite:intersect]"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/25" />
    <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-transparent" />
    <div className="grain absolute inset-0 opacity-[0.07]" />
  </div>
);

export default AmbientBackdrop;
