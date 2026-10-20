import type { SyntheticEvent } from "react";

/** onError handler: hide an image whose file is missing instead of showing the broken-image icon and alt text. */
export const hideBrokenImage = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.visibility = "hidden";
};
