import { useEffect, type RefObject } from "react";

/**
 * Close a popover-style element when the user presses Escape or interacts
 * outside of `ref`.
 */
export const useDismiss = (
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: () => void,
) => {
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onDismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, open, onDismiss]);
};
