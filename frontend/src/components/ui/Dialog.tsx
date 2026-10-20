import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { cn } from "./cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Hide the default header (title + close button). */
  bare?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog. Renders as a bottom sheet on phones and a centered
 * panel from `sm` upward. Locks page scroll, traps Tab focus, and restores
 * focus to the trigger on close.
 */
const Dialog = ({ open, onClose, title, icon, children, className, bare }: DialogProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("[autofocus]") ?? panel;
    first?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92svh] w-full animate-scale-in flex-col overflow-hidden outline-none",
          "rounded-t-3xl border border-white/[0.08] bg-ink-850 shadow-2xl shadow-black/60",
          "pb-[env(safe-area-inset-bottom)] sm:max-w-md sm:rounded-2xl sm:pb-0",
          className,
        )}
      >
        {/* Grab handle hints the sheet affordance on touch screens. */}
        <span className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/15 sm:hidden" aria-hidden="true" />

        {!bare && (
          <div className="flex items-center gap-3 px-5 pt-4 pb-2 sm:pt-5">
            {icon && (
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
                {icon}
              </span>
            )}
            {title && (
              <h2 id={titleId} className="min-w-0 flex-1 truncate font-display text-base font-semibold text-white">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto grid size-9 shrink-0 place-items-center rounded-full text-fg-muted transition hover:bg-white/8 hover:text-white"
            >
              <FiX className="size-[18px]" />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Dialog;
