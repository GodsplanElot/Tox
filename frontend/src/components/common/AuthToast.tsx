import { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { FaLock, FaTimes } from "react-icons/fa";
import "./AuthToast.css";

type AuthToastProps = {
  show: boolean;
  message: string;
  onClose: () => void;
};

const AuthToast = ({ show, message, onClose }: AuthToastProps) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  const isAuthError =
    message.toLowerCase().includes("credentials") ||
    message.toLowerCase().includes("authentication") ||
    message.toLowerCase().includes("sign in") ||
    message.toLowerCase().includes("logged in");

  const displayMessage = isAuthError
    ? "Sign in to save titles to your watchlist."
    : message;

  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
      <Toast show={show} onClose={onClose} className="auth-toast">
        <Toast.Header closeButton={false} className="auth-toast__header">
          <FaLock className="auth-toast__icon" />
          <strong className="me-auto">
            {isAuthError ? "Sign in required" : "Watchlist"}
          </strong>
          <button
            type="button"
            className="auth-toast__close"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </Toast.Header>
        <Toast.Body className="auth-toast__body">{displayMessage}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default AuthToast;
