import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import PasswordInput from "../components/auth/PasswordInput";
import { useAuth } from "../context/AuthContext";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

interface GoogleIdentityConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleIdentityService {
  initialize: (configuration: GoogleIdentityConfiguration) => void;
  prompt: (callback: (notification: GooglePromptNotification) => void) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityService;
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validateEmail = (email: string) => email.endsWith("@nmamit.in");

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (window.google || document.getElementById("google-identity")) return;

    const script = document.createElement("script");
    const handleScriptError = () => {
      setAuthError("Google Sign-In failed to load. Please try again.");
    };

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-identity";
    script.addEventListener("error", handleScriptError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("error", handleScriptError);
    };
  }, []);

  const handleGoogleCallback = async (response: GoogleCredentialResponse) => {
    setAuthError("");
    setIsLoading(true);

    try {
      if (!response.credential) {
        setAuthError("No Google Credential received.");
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
      });

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        setAuthError("Authentication response was invalid.");
        return;
      }

      if (!res.ok) {
        const backendError =
          isRecord(data) && typeof data.error === "string" && data.error
            ? data.error
            : "Authentication failed";
        setAuthError(backendError);
        return;
      }

      if (
        !isRecord(data) ||
        typeof data.email !== "string" ||
        data.email.length === 0 ||
        typeof data.name !== "string" ||
        data.name.trim().length === 0
      ) {
        setAuthError("Authentication response was invalid.");
        return;
      }

      if (!validateEmail(data.email)) {
        setAuthError("Please use your verified @nmamit.in Google account.");
        return;
      }

      login(data.email, data.name);
      navigate("/");
    } catch (error) {
      console.error("Sign-in error:", error);
      setAuthError("Sign-in failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setAuthError("");
    setIsLoading(true);

    if (!GOOGLE_CLIENT_ID) {
      setAuthError("Google Sign-In is not configured.");
      setIsLoading(false);
      return;
    }

    if (!window.google?.accounts?.id) {
      setAuthError("Google Sign-In not loaded yet. Please wait or try again.");
      setIsLoading(false);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        setAuthError("Google Sign-In could not be displayed. Please try again.");
        setIsLoading(false);
      } else if (notification.isSkippedMoment()) {
        setAuthError("Google Sign-In was skipped. Please try again.");
        setIsLoading(false);
      }
    });
  };

  return (
    <AuthShell>
      <div className="relative grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-line-strong bg-surface/80 p-3 pt-14 shadow-surface backdrop-blur-2xl sm:pt-3 lg:grid-cols-[1.05fr_0.95fr]">
        <AuthThemeToggle />
        <AuthVisual variant="login" />

        <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-line-strong bg-surface/95 p-4 shadow-surface backdrop-blur-xl sm:p-8 lg:p-10">
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
            aria-busy={isLoading}
          >
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-text underline decoration-line underline-offset-4 transition-colors hover:text-technical-text focus-visible:outline-offset-2"
            >
              HackerEarth Hub NMAMIT
            </Link>

            <div className="mt-8 space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-technical-text">
                Portal access
              </p>
              <h2 className="break-words text-3xl font-bold tracking-tight text-ink">
                Login to your account
              </h2>
              <p className="break-words text-sm leading-6 text-ink-muted">
                Pick up where you left off in contests, resources, and domain practice.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <p
                id="credential-login-status"
                className="rounded-control border border-highlight/40 bg-highlight/10 px-4 py-3 text-sm font-medium text-highlight-text"
              >
                Email and password login is not available yet. Please use Google Sign-In.
              </p>

              <fieldset
                disabled
                aria-describedby="credential-login-status persistence-status"
                className="space-y-5"
              >
                <legend className="sr-only">Email and password login</legend>
                <AuthInput
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value=""
                  disabled
                  icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  className="cursor-not-allowed bg-surface-muted text-ink-muted"
                />
                <PasswordInput
                  id="password"
                  name="password"
                  label="Password"
                  value=""
                  autoComplete="current-password"
                  onChange={() => undefined}
                />

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex min-h-11 items-center gap-2 text-ink-muted">
                    <input
                      type="checkbox"
                      disabled
                      className="size-5 rounded border-line-strong bg-surface-muted"
                    />
                    Remember me
                  </label>
                  <span className="inline-flex min-h-11 items-center font-semibold text-ink-muted" aria-disabled="true">
                    Forgot Password unavailable
                  </span>
                </div>
                <p id="persistence-status" className="text-sm leading-6 text-ink-muted">
                  Persistence options are unavailable until email and password login is supported.
                </p>
              </fieldset>

              {authError && (
                <p
                  className="rounded-control border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {authError}
                </p>
              )}

              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {isLoading ? "Google Sign-In in progress." : ""}
              </p>

              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className={`size-4 rounded-full border-2 border-ink-inverse/40 border-b-ink-inverse ${
                      shouldReduceMotion ? "" : "animate-spin"
                    }`}
                    aria-hidden="true"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
                )}
                {isLoading ? "Signing in..." : "Continue with Google"}
              </button>
            </div>

            <p className="mt-6 break-words text-center text-sm text-ink-muted">
              New member?{" "}
              <Link
                to="/register"
                className="inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4 transition-colors hover:text-technical-text focus-visible:outline-offset-2"
              >
                Create an account
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </AuthShell>
  );
}
