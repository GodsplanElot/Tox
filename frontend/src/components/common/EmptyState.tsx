import React from "react";
import { Container, Button } from "react-bootstrap";
import { BiBox } from "react-icons/bi";

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
  icon = <BiBox size={60} className="mb-4 text-muted opacity-50" />,
}) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5 text-center min-vh-50">
      <div className="glass-card p-5 rounded-4 border border-secondary border-opacity-25 shadow-lg">
        {icon}
        <h2 className="fw-bold mb-3 text-white">{title}</h2>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "400px" }}>
          {message}
        </p>
        {actionText && onAction && (
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2 fw-semibold"
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default EmptyState;
