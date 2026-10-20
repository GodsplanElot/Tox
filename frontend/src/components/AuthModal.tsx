import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { useAuth } from "../context/useAuth";
import type { GoogleCredentialResponse } from "../types/auth";
import Dialog from "./ui/Dialog";
import { cn } from "./ui/cn";
import { buttonClass } from "./ui/buttonClass";

type AuthTab = "login" | "signup" | "reset";

type Props = {
  show: boolean;
  onHide: () => void;
  defaultTab?: AuthTab;
};

type GoogleButtonOptions = {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  shape: "rectangular" | "pill" | "circle" | "square";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  type?: "standard" | "icon";
  width?: number;
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
            options: GoogleButtonOptions,
          ) => void;
        };
      };
    };
    toxGoogleClientId?: string;
    toxGoogleCredentialHandler?: (response: GoogleCredentialResponse) => void;
  }
}

export const GoogleIcon = () => (
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

const Field = ({
  id,
  label,
  className,
  ...input
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold text-fg-muted">
      {label}
    </label>
    <input
      id={id}
      className={cn(
        "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-sm text-white ring-1 ring-white/[0.08] transition ring-inset",
        "placeholder:text-fg-subtle hover:ring-white/15 focus:bg-white/[0.06] focus:ring-accent/50 focus:outline-none",
        className,
      )}
      {...input}
    />
  </div>
);

const Notice = ({ tone, children }: { tone: "error" | "success"; children: ReactNode }) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={cn(
      "rounded-xl px-3.5 py-2.5 text-[13px] leading-snug ring-1 ring-inset",
      tone === "error" ? "bg-red-500/10 text-red-200 ring-red-400/25" : "bg-emerald-500/10 text-emerald-200 ring-emerald-400/25",
    )}
  >
    {children}
  </div>
);

const StepIntro = ({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) => (
  <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] ring-inset">
    <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">{kicker}</p>
    <h3 className="mt-1 font-display text-base font-semibold text-white">{title}</h3>
    <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{children}</p>
  </div>
);

const submitClass = buttonClass("primary", "lg", "w-full");
const linkClass = "font-semibold text-accent transition hover:text-accent-strong disabled:cursor-not-allowed disabled:text-fg-subtle";
const footerClass = "text-center text-[13px] text-fg-muted";
const otpInputClass = "h-14 text-center font-display text-2xl tracking-[0.5em] tabular-nums";

const AuthModal = ({ show, onHide, defaultTab = "login" }: Props) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, show]);

  const switchTab = (tab: AuthTab) => setActiveTab(tab);

  const title =
    activeTab === "login" ? "Welcome back" : activeTab === "signup" ? "Create your account" : "Reset password";

  return (
    <Dialog open={show} onClose={onHide} title={title}>
      <div className="space-y-5 px-5 pt-2 pb-6">
        {activeTab !== "reset" && (
          <>
            <div role="tablist" className="grid grid-cols-2 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/[0.06] ring-inset">
              {(["login", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => switchTab(tab)}
                  className={cn(
                    "h-9 rounded-full text-[13px] font-semibold transition",
                    activeTab === tab ? "bg-white/10 text-white shadow-sm" : "text-fg-muted hover:text-white",
                  )}
                >
                  {tab === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <GoogleSignInButton onSuccess={onHide} onError={setOauthError} />
              {oauthError && <Notice tone="error">{oauthError}</Notice>}
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-fg-subtle">
              <span className="h-px flex-1 bg-white/[0.07]" />
              or with email
              <span className="h-px flex-1 bg-white/[0.07]" />
            </div>
          </>
        )}

        <div key={activeTab} className="animate-fade-in">
          {activeTab === "login" ? (
            <LoginForm
              onSuccess={onHide}
              onSwitchTab={() => switchTab("signup")}
              onForgotPassword={() => switchTab("reset")}
            />
          ) : activeTab === "signup" ? (
            <SignUpForm onSuccess={onHide} onSwitchTab={() => switchTab("login")} />
          ) : (
            <PasswordResetForm onSwitchLogin={() => switchTab("login")} />
          )}
        </div>
      </div>
    </Dialog>
  );
};

export const GoogleSignInButton = ({
  onSuccess,
  onError,
  variant = "standard",
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
  variant?: "standard" | "icon";
}) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const { googleLogin } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;
    const buttonElement = buttonRef.current;
    let hasUnmounted = false;
    let lastRenderedWidth = 0;

    const renderGoogleButton = () => {
      if (!window.google || hasUnmounted) return;

      const containerWidth = Math.floor(buttonElement.getBoundingClientRect().width);
      const buttonWidth = variant === "standard" ? Math.min(Math.max(containerWidth, 240), 400) : 44;
      if (!buttonWidth || buttonWidth === lastRenderedWidth) return;

      lastRenderedWidth = buttonWidth;
      buttonElement.innerHTML = "";
      window.toxGoogleCredentialHandler = async (response) => {
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
      };

      if (window.toxGoogleClientId !== clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => window.toxGoogleCredentialHandler?.(response),
        });
        window.toxGoogleClientId = clientId;
      }

      const renderOptions: GoogleButtonOptions = {
        theme: variant === "icon" ? "outline" : "filled_black",
        size: "large",
        shape: variant === "icon" ? "circle" : "pill",
        type: variant === "icon" ? "icon" : "standard",
        text: "continue_with",
      };

      if (variant === "standard") {
        renderOptions.width = buttonWidth;
      }

      window.google.accounts.id.renderButton(buttonElement, renderOptions);
    };

    const renderWhenReady = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(renderGoogleButton);
      });
    };

    if (window.google) {
      renderWhenReady();
      return () => {
        hasUnmounted = true;
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderWhenReady);
      return () => {
        hasUnmounted = true;
        existingScript.removeEventListener("load", renderWhenReady);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderWhenReady;
    script.onerror = () => onError("Unable to load Google sign-in.");
    document.head.appendChild(script);

    return () => {
      hasUnmounted = true;
      script.onload = null;
      script.onerror = null;
    };
  }, [clientId, googleLogin, onError, onSuccess, variant]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        aria-label="Google sign-in not configured"
        className={buttonClass("secondary", "lg", variant === "icon" ? "size-11 px-0" : "w-full")}
      >
        <GoogleIcon />
        {variant === "standard" && <span>Google sign-in unavailable</span>}
      </button>
    );
  }

  if (variant === "icon") {
    // The SDK renders an invisible button on top of our own mark.
    return (
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white">
        <span className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <GoogleIcon />
        </span>
        <div ref={buttonRef} className="absolute inset-0 opacity-[0.01]" />
      </div>
    );
  }

  return <div ref={buttonRef} className="flex min-h-11 w-full justify-center [color-scheme:light]" />;
};

const LoginForm = ({
  onSuccess,
  onSwitchTab,
  onForgotPassword,
}: {
  onSuccess: () => void;
  onSwitchTab: () => void;
  onForgotPassword: () => void;
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Notice tone="error">{error}</Notice>}

      <Field
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Field
        id="login-password"
        label="Password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <div className="-mt-1 flex justify-end">
        <button type="button" className={cn(linkClass, "text-xs")} onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>

      <button type="submit" className={submitClass} disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <div className={footerClass}>
        <span>Don't have an account? </span>
        <button type="button" className={linkClass} onClick={onSwitchTab}>
          Sign Up
        </button>
      </div>
    </form>
  );
};

const PasswordResetForm = ({ onSwitchLogin }: { onSwitchLogin: () => void }) => {
  const { requestPasswordReset, confirmPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resendWait, setResendWait] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAwaitingOtp = Boolean(pendingEmail);

  useEffect(() => {
    if (!resendWait) return;

    const timer = window.setInterval(() => {
      setResendWait((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendWait]);

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(email);
      setPendingEmail(response.email);
      setResendWait(response.resend_available_in ?? 0);
      setMessage(response.detail);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send password reset code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await confirmPasswordReset({
        email: pendingEmail,
        otp,
        password,
        password_confirm: passwordConfirm,
      });
      setMessage("Password reset. You can log in with your new password.");
      setOtp("");
      setPassword("");
      setPasswordConfirm("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendWait > 0) return;
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(pendingEmail);
      setResendWait(response.resend_available_in ?? 0);
      setMessage(response.detail);
      setOtp("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send another reset code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAwaitingOtp) {
    return (
      <form onSubmit={handleConfirm} className="space-y-4">
        {error && <Notice tone="error">{error}</Notice>}
        {message && <Notice tone="success">{message}</Notice>}

        <StepIntro kicker="Password reset" title="Check your inbox">
          Enter the 6 digit code sent to <strong className="text-white">{pendingEmail}</strong>.
        </StepIntro>

        <Field
          id="reset-otp"
          label="Reset code"
          className={otpInputClass}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="000000"
          autoComplete="one-time-code"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          required
        />

        <Field
          id="reset-password"
          label="New password"
          type="password"
          placeholder="Create a new password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />

        <Field
          id="reset-password-confirm"
          label="Confirm new password"
          type="password"
          placeholder="Confirm new password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          minLength={8}
          required
        />

        <button
          type="submit"
          className={submitClass}
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>

        <div className={cn(footerClass, "flex items-center justify-center gap-2")}>
          <button
            type="button"
            className={linkClass}
            onClick={handleResend}
            disabled={resendWait > 0}
          >
            {resendWait > 0 ? `Resend in ${resendWait}s` : "Send another code"}
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" className={linkClass} onClick={onSwitchLogin}>
            Back to log in
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequest} className="space-y-4">
      {error && <Notice tone="error">{error}</Notice>}
      {message && <Notice tone="success">{message}</Notice>}

      <StepIntro kicker="Account recovery" title="Get a reset code">
        Enter your account email and we will send a one-time reset code.
      </StepIntro>

      <Field
        id="reset-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <button type="submit" className={submitClass} disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Reset Code"}
      </button>

      <div className={footerClass}>
        <button type="button" className={linkClass} onClick={onSwitchLogin}>
          Back to log in
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
  const { register, resendOtp, verifyEmail } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendWait, setResendWait] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAwaitingOtp = Boolean(pendingEmail);

  useEffect(() => {
    if (!resendWait) return;

    const timer = window.setInterval(() => {
      setResendWait((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendWait]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Accept the terms to create an account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      setPendingEmail(response.email);
      setResendWait(response.resend_available_in ?? 0);
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

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      await verifyEmail({ email: pendingEmail, otp });
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to verify this code.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsResending(true);

    try {
      const response = await resendOtp(pendingEmail);
      setResendWait(response.resend_available_in ?? 0);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to resend the verification code.",
      );
    } finally {
      setIsResending(false);
    }
  };

  if (isAwaitingOtp) {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        {error && <Notice tone="error">{error}</Notice>}

        <StepIntro kicker="Email verification" title="Check your inbox">
          Enter the 6 digit code sent to <strong className="text-white">{pendingEmail}</strong>.
        </StepIntro>

        <Field
          id="signup-otp"
          label="Verification code"
          className={otpInputClass}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="000000"
          autoComplete="one-time-code"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          required
        />

        <button type="submit" className={submitClass} disabled={isVerifying || otp.length !== 6}>
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>

        <div className={cn(footerClass, "flex items-center justify-center gap-2")}>
          <button
            type="button"
            className={linkClass}
            onClick={handleResend}
            disabled={isResending || resendWait > 0}
          >
            {resendWait > 0
              ? `Resend in ${resendWait}s`
              : isResending
                ? "Resending..."
                : "Resend code"}
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            className={linkClass}
            onClick={() => {
              setPendingEmail("");
              setOtp("");
              setError("");
            }}
          >
            Edit details
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Notice tone="error">{error}</Notice>}

      <Field
        id="signup-username"
        label="Username"
        type="text"
        placeholder="Choose a username"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <Field
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Field
        id="signup-password"
        label="Password"
        type="password"
        placeholder="Create a password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={8}
        required
      />

      <Field
        id="signup-confirm"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        value={passwordConfirm}
        onChange={(event) => setPasswordConfirm(event.target.value)}
        minLength={8}
        required
      />

      <label htmlFor="terms" className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-fg-muted">
        <input
          id="terms"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-accent"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="/legal/terms-of-use" target="_blank" className={linkClass}>
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/legal/privacy-policy" target="_blank" className={linkClass}>
            Privacy Policy
          </a>
        </span>
      </label>

      <button type="submit" className={submitClass} disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Account"}
      </button>

      <div className={footerClass}>
        <span>Already have an account? </span>
        <button type="button" className={linkClass} onClick={onSwitchTab}>
          Log In
        </button>
      </div>
    </form>
  );
};

export default AuthModal;
