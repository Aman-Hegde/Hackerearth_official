import { FormEvent, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import logo from "../assets/image.png";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const parseResponseJson = async (response: Response): Promise<Record<string, unknown>> => {
  try {
    const data = await response.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "info">("info");
  const [hasTouchedEmail, setHasTouchedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    const normalizedEmail = value.trim().toLowerCase();

    if (!normalizedEmail) return "Email is required.";
    if (!normalizedEmail.endsWith("@nmamit.in")) {
      return "Use your official @nmamit.in email address.";
    }

    return "";
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;
    setEmail(nextEmail);
    setMessage("");

    if (hasTouchedEmail) {
      setEmailError(validateEmail(nextEmail));
    }
  };

  const handleEmailBlur = (_event: FocusEvent<HTMLInputElement>) => {
    setHasTouchedEmail(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTouchedEmail(true);
    setMessage("");

    const validationMessage = validateEmail(email);
    setEmailError(validationMessage);

    if (validationMessage) return;

    const normalizedEmail = email.trim().toLowerCase();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await parseResponseJson(response);

      if (!response.ok || data.success === false) {
        setMessageKind("error");
        setMessage(
          typeof data.message === "string"
            ? data.message
            : "Unable to request password reset OTP. Please try again."
        );
        return;
      }

      navigate("/forgot-password/verify-otp", {
        state: {
          email: normalizedEmail,
        },
      });
    } catch {
      setMessageKind("error");
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell waveClassName="opacity-30">
      <Link
        to="/"
        aria-label="Go to HackerEarth Hub-NMAMIT home page"
        className="group absolute left-4 top-4 z-20 flex min-h-11 max-w-[calc(100%-5.5rem)] min-w-0 items-center gap-2 rounded-full border border-dream/30 bg-glass/80 p-1 pr-3 text-ink shadow-glass backdrop-blur-lg transition hover:border-dream/55 hover:text-primary-text focus-visible:outline-offset-2 sm:left-6 sm:top-6 sm:gap-3"
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dream/30 bg-glass p-0.5 transition duration-200 group-hover:border-rose/50 sm:size-11 ${
            shouldReduceMotion ? "" : "group-hover:-translate-y-0.5"
          }`}
        >
          <img src={logo} alt="HackerEarth Logo" className="size-full rounded-full object-cover" />
        </span>
        <span className="min-w-0 break-words font-display text-sm font-semibold leading-tight tracking-[-0.02em] sm:text-base">
          HackerEarth Hub-NMAMIT
        </span>
      </Link>

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <AuthThemeToggle />
      </div>

      <div className="ui-panel-glass relative mt-20 grid w-full min-w-0 max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden border-dream/25 bg-glass/45 p-3 sm:mt-24 lg:grid-cols-[1fr_0.95fr]">
        <AuthVisual variant="login" className="order-2 lg:order-1" />

        <div className="ui-panel-glass order-1 min-w-0 overflow-hidden border-dream/30 bg-glass/80 p-5 sm:p-8 lg:order-2 lg:p-10">
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dream-text">
                Account recovery
              </p>
              <h2 className="break-words text-3xl font-bold tracking-tight text-ink">
                Forgot password
              </h2>
              <p className="break-words text-sm leading-6 text-ink-muted">
                Enter your NMAMIT email address and we will send a six-digit OTP if an account exists.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
              <AuthInput
                id="forgotPasswordEmail"
                name="email"
                label="NMAMIT email"
                type="email"
                autoComplete="email"
                placeholder="yourusn@nmamit.in"
                value={email}
                error={emailError}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              />

              {message && (
                <p
                  className={`rounded-control border px-4 py-3 text-sm font-medium ${
                    messageKind === "error"
                      ? "border-highlight/40 bg-highlight/10 text-highlight-text"
                      : "border-dream/35 bg-dream/10 text-dream-text"
                  }`}
                  role={messageKind === "error" ? "alert" : "status"}
                  aria-live={messageKind === "error" ? "assertive" : "polite"}
                  aria-atomic="true"
                >
                  {message}
                </p>
              )}

              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <span
                    className={`size-4 rounded-full border-2 border-ink-inverse/40 border-b-ink-inverse ${
                      shouldReduceMotion ? "" : "animate-spin"
                    }`}
                    aria-hidden="true"
                  />
                )}
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>

            <Link to="/login" className="btn btn-secondary mt-4 w-full">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to login
            </Link>

            <p className="mt-6 break-words text-center text-sm text-ink-muted">
              Remembered it?{" "}
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center font-semibold text-primary-text underline decoration-rose/35 underline-offset-4 transition-colors hover:text-rose-text focus-visible:outline-offset-2"
              >
                Back to login
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </AuthShell>
  );
}
