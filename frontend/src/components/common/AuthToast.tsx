import { FiBookmark, FiLock } from "react-icons/fi";
import Toast from "../ui/Toast";

type AuthToastProps = {
  show: boolean;
  message: string;
  onClose: () => void;
};

const AUTH_HINTS = ["credentials", "authentication", "sign in", "logged in"];

const AuthToast = ({ show, message, onClose }: AuthToastProps) => {
  const lower = message.toLowerCase();
  const isAuthError = AUTH_HINTS.some((hint) => lower.includes(hint));

  return (
    <Toast
      show={show}
      onClose={onClose}
      icon={isAuthError ? <FiLock className="size-4" /> : <FiBookmark className="size-4" />}
      title={isAuthError ? "Sign in required" : "Watchlist"}
      message={isAuthError ? "Sign in to save titles to your watchlist." : message}
    />
  );
};

export default AuthToast;
