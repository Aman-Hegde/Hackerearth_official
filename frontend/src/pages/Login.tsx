import { FormEvent, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import PasswordInput from "../components/auth/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import logo from "../assets/image.png";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialForm: LoginForm = {
  email: "",
  password: "",
  rememberMe: false,
};

const getDashboardPath = (role: "student" | "admin") =>
  role === "admin" ? "/admin/dashboard" : "/student/dashboard";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginForm, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const validateField = (name: keyof LoginForm, value: string | boolean) => {
    if (name === "email") {
      const email = String(value).trim().toLowerCase();
      if (!email) return "Email is required.";
      if (!email.endsWith("@nmamit.in")) return "Use your official @nmamit.in email address.";
    }

    if (name === "password" && !String(value)) {
      return "Password is required.";
    }

    return undefined;
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof LoginForm, string>> = {};

    (["email", "password"] as Array<keyof LoginForm>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const fieldName = name as keyof LoginForm;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((current) => ({ ...current, [fieldName]: nextValue }));
    setAuthError("");

    if (hasSubmitted || touched[fieldName]) {
      setErrors((current) => ({
        ...current,
        [fieldName]: validateField(fieldName, nextValue),
      }));
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof LoginForm;
    setTouched((current) => ({ ...current, [fieldName]: true }));
    setErrors((current) => ({
      ...current,
      [fieldName]: validateField(fieldName, formData[fieldName]),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ email: true, password: true });
    setAuthError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const user = await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );
      navigate(getDashboardPath(user.role));
    } catch (error) {
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <Link
        to="/"
        aria-label="Go to HackerEarth Hub-NMAMIT home page"
        className="group absolute left-4 top-4 z-20 flex min-h-11 max-w-[calc(100%-5.5rem)] min-w-0 items-center gap-2 rounded-full border border-line-strong bg-surface/95 p-1 pr-3 text-ink shadow-soft backdrop-blur-xl transition-colors hover:border-technical hover:text-technical-text focus-visible:outline-offset-2 sm:left-6 sm:top-6 sm:gap-3"
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-white p-0.5 transition duration-200 group-hover:border-technical/50 sm:size-11 ${
            shouldReduceMotion ? "" : "group-hover:-translate-y-0.5"
          }`}
        >
          <img
            src={logo}
            alt="HackerEarth Logo"
            className="size-full rounded-full object-cover"
          />
        </span>
        <span className="min-w-0 break-words font-display text-sm font-semibold leading-tight tracking-[-0.02em] sm:text-base">
          HackerEarth Hub-NMAMIT
        </span>
      </Link>

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <AuthThemeToggle />
      </div>

      <div className="relative mt-20 grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-line-strong bg-surface/80 p-3 shadow-surface backdrop-blur-2xl sm:mt-24 lg:grid-cols-[1.05fr_0.95fr]">
        <AuthVisual variant="login" />

        <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-line-strong bg-surface/95 p-4 shadow-surface backdrop-blur-xl sm:p-8 lg:p-10">
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
            aria-busy={isLoading}
          >
            <div className="space-y-2">
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

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <AuthInput
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              />
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                error={errors.password}
                autoComplete="current-password"
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex min-h-11 items-center gap-2 text-ink-muted">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="size-5 rounded border-line-strong bg-surface-muted text-primary focus:ring-technical"
                  />
                  Secure session lasts up to 7 days
                </label>
                <Link
                  to="/forgot-password"
                  className="inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4 transition-colors hover:text-technical-text focus-visible:outline-offset-2"
                >
                  Forgot Password?
                </Link>
              </div>

              {authError && (
                <p
                  className="rounded-control border border-highlight/40 bg-highlight/10 px-4 py-3 text-sm font-medium text-highlight-text"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {authError}
                </p>
              )}

              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {isLoading ? "Signing in." : ""}
              </p>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading && (
                  <span
                    className={`size-4 rounded-full border-2 border-ink-inverse/40 border-b-ink-inverse ${
                      shouldReduceMotion ? "" : "animate-spin"
                    }`}
                    aria-hidden="true"
                  />
                )}
                {isLoading ? "Signing in..." : "Login"}
                {!isLoading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>

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
