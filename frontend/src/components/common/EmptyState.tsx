import React from "react";
import { FiInbox } from "react-icons/fi";
import Button from "../ui/Button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Content Found",
  message = "We couldn't find any items matching your criteria. Check back later!",
  actionText,
  onAction,
  icon = <FiInbox className="size-6" />,
}) => {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-white/[0.04] text-fg-muted ring-1 ring-white/[0.08]">
        {icon}
      </span>
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">{message}</p>
      {actionText && onAction && (
        <Button variant="secondary" className="mt-6" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
