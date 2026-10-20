import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

type ToastProps = {
  show: boolean;
  title: string;
  message: ReactNode;
  icon?: ReactNode;
  onClose: () => void;
  /** Auto-dismiss delay in ms. */
  duration?: number;
};

/** Small transient notification pinned above the mobile nav / bottom-right on desktop. */
const Toast = ({ show, title, message, icon, onClose, duration = 4500 }: ToastProps) => {
  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [show, onClose, duration]);

  if (!show) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-[calc(108px+env(safe-area-inset-bottom))] z-[1300] flex animate-scale-in items-start gap-3 rounded-2xl p-3.5 shadow-2xl shadow-black/50 glass sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-80"
    >
      {icon && (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-fg-muted">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="grid size-7 shrink-0 place-items-center rounded-full text-fg-subtle transition hover:bg-white/8 hover:text-white"
      >
        <FiX className="size-4" />
      </button>
    </div>,
    document.body,
  );
};

export default Toast;
