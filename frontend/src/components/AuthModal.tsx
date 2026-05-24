import { useEffect, useRef, useState, type FormEvent } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../context/useAuth";
import type { GoogleCredentialResponse } from "../types/auth";
import "./AuthModal.css";

type AuthTab = "login" | "signup";

type Props = {
  show: boolean;
  onHide: () => void;
  defaultTab?: AuthTab;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: "outline" | "filled_blue" | "filled_black";
              size: "large" | "medium" | "small";
              shape: "rectangular" | "pill" | "circle" | "square";
              text: "signin_with" | "signup_with" | "continue_with" | "signin";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const AuthModal = ({ show, onHide, defaultTab = "login" }: Props) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, show]);

  const switchTab = (tab: AuthTab) => setActiveTab(tab);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="auth-modal"
      backdropClassName="auth-modal-backdrop"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {activeTab === "login" ? "Welcome back" : "Create account"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="auth-tab-nav">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "login" ? "auth-tab-btn--active" : ""}`}
            onClick={() => switchTab("login")}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "signup" ? "auth-tab-btn--active" : ""}`}
            onClick={() => switchTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-oauth-section">
          <GoogleSignInButton
            onSuccess={onHide}
            onError={setOauthError}
          />
          {oauthError && <div className="auth-oauth-error">{oauthError}</div>}

          <button type="button" className="auth-oauth-btn auth-oauth-btn--github" disabled>
            <span className="auth-oauth-icon">
              <GitHubIcon />
            </span>
            Continue with GitHub
          </button>

          <button type="button" className="auth-oauth-btn auth-oauth-btn--apple" disabled>
            <span className="auth-oauth-icon">
              <AppleIcon />
            </span>
            Continue with Apple
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        <div key={activeTab} className="auth-tab-content">
          {activeTab === "login" ? (
            <LoginForm
              onSuccess={onHide}
              onSwitchTab={() => switchTab("signup")}
            />
          ) : (
            <SignUpForm
              onSuccess={onHide}
              onSwitchTab={() => switchTab("login")}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const GoogleSignInButton = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
}) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const { googleLogin } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) return;

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            onError("Google did not return a sign-in credential.");
            return;
          }

          try {
            onError("");
            await googleLogin(response.credential);
            onSuccess();
          } catch (error) {
            onError(
              error instanceof Error
                ? error.message
                : "Unable to sign in with Google.",
            );
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: 360,
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton);
      return () => existingScript.removeEventListener("load", renderGoogleButton);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => onError("Unable to load Google sign-in.");
    document.head.appendChild(script);
  }, [clientId, googleLogin, onError, onSuccess]);

  if (!clientId) {
    return (
      <button type="button" className="auth-oauth-btn auth-oauth-btn--google" disabled>
        <span className="auth-oauth-icon">
          <GoogleIcon />
        </span>
        Google sign-in not configured
      </button>
    );
  }

  return <div ref={buttonRef} className="auth-google-button" />;
};

const LoginForm = ({
  onSuccess,
  onSwitchTab,
}: {
  onSuccess: () => void;
  onSwitchTab: () => void;
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="auth-form-group">
        <label className="auth-form-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className="auth-form-input"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="auth-form-group">
        <label className="auth-form-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="auth-form-input"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div className="auth-extras">
        <div />
        <button type="button" className="auth-forgot-link">
          Forgot password?
        </button>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <div className="auth-footer">
        <span>Don't have an account? </span>
        <button type="button" className="auth-footer-link" onClick={onSwitchTab}>
          Sign Up
        </button>
      </div>
    </form>
  );
};

const SignUpForm = ({
  onSuccess,
  onSwitchTab,
}: {
  onSuccess: () => void;
  onSwitchTab: () => void;
}) => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Accept the terms to create an account.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="auth-form-group">
        <label className="auth-form-label" htmlFor="signup-username">
          Username
        </label>
        <input
          id="signup-username"
          type="text"
          className="auth-form-input"
          placeholder="Choose a username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>

      <div className="auth-form-group">
        <label className="auth-form-label" htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          className="auth-form-input"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="auth-form-group">
        <label className="auth-form-label" htmlFor="signup-password">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          className="auth-form-input"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
      </div>

      <div className="auth-form-group">
        <label className="auth-form-label" htmlFor="signup-confirm">
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          className="auth-form-input"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          minLength={8}
          required
        />
      </div>

      <div className="auth-checkbox-wrapper">
        <input
          id="terms"
          type="checkbox"
          className="auth-checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
        />
        <label htmlFor="terms" className="auth-checkbox-label">
          I agree to the <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Account"}
      </button>

      <div className="auth-footer">
        <span>Already have an account? </span>
        <button type="button" className="auth-footer-link" onClick={onSwitchTab}>
          Log In
        </button>
      </div>
    </form>
  );
};

export default AuthModal;
