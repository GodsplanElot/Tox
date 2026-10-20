// hls.js ships its light build (no DRM, subtitles, or alt-audio) without
// separate typings; its API is a subset of the full build's.
declare module "hls.js/light" {
  export * from "hls.js";
  export { default } from "hls.js";
}
