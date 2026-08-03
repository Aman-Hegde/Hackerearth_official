import { FormEvent, useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import PasswordInput from "../components/auth/PasswordInput";
import { ApiError, apiRequest } from "../lib/api";
import { cn } from "../lib/utils";
import logo from "../assets/image.png";

interface ChangePasswordForm {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

const passwordRules = [
  { label: "8 characters", test: (value: string) => value.length >= 8 },
  { label: "1 uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "1 lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "1 number", test: (value: string) => /\d/.test(value) },
  { label: "1 special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

const initialForm: ChangePasswordForm = {
  newPassword: "",
  confirmPassword: "",
};

export default function ChangeForgottenPasswordPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ChangePasswordForm, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const passedPasswordRules = useMemo(
    () => passwordRules.filter((rule) => rule.test(formData.newPassword)).length,
    [formData.newPassword]
  );
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"][passedPasswordRules];
  const strengthColor =
    passedPasswordRules <= 2 ? "bg-highlight" : passedPasswordRules <= 4 ? "bg-primary" : "bg-success";

  const validateField = (
    name: keyof ChangePasswordForm,
    value: string,
    nextForm = formData
  ) => {
    if (name === "newPassword") {
      if (!value) return "New password is required.";
      if (passwordRules.some((rule) => !rule.test(value))) {
        return "Password must satisfy all strength requirements.";
      }
    }

    if (name === "confirmPassword") {
      if (!value) return "Confirm password is required.";
      if (value !== nextForm.newPassword) return "Passwords do not match.";
    }

    return undefined;
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof ChangePasswordForm, string>> = {};

    (["newPassword", "confirmPassword"] as Array<keyof ChangePasswordForm>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof ChangePasswordForm;
    const nextValue = event.target.value;
    const nextForm = { ...formData, [fieldName]: nextValue };

    setFormData(nextForm);
    setMessage("");

    if (hasSubmitted || touched[fieldName] || (fieldName === "newPassword" && touched.confirmPassword)) {
      setErrors((current) => ({
        ...current,
        ...(hasSubmitted || touched[fieldName]
          ? { [fieldName]: validateField(fieldName, nextValue, nextForm) }
          : {}),
        ...(fieldName === "newPassword" && (hasSubmitted || touched.confirmPassword)
          ? { confirmPassword: validateField("confirmPassword", nextForm.confirmPassword, nextForm) }
          : {}),
      }));
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof ChangePasswordForm;
    setTouched((current) => ({ ...current, [fieldName]: true }));
    setErrors((current) => ({
      ...current,
      [fieldName]: validateField(fieldName, formData[fieldName]),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ newPassword: true, confirmPassword: true });
    setMessage("");
    setIsSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await apiRequest<ChangePasswordResponse>(
        "/api/auth/forgot-password/change-password",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      setIsSuccess(true);
      setMessage(data.message || "Password changed successfully. Please log in using your new password.");
      window.setTimeout(() => navigate("/login"), 900);
    } catch (requestError) {
      setIsSuccess(false);
      if (requestError instanceof ApiError) {
        if (
          requestError.code === "PASSWORD_RESET_AUTH_REQUIRED" ||
          requestError.code === "PASSWORD_RESET_TOKEN_INVALID"
        ) {
          setMessage(requestError.message);
        } else {
          setMessage(requestError.message || "Unable to change password. Please try again.");
        }
      } else {
        setMessage("Unable to connect to the server. Please try again.");
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
          className={cn(
            "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-white p-0.5 transition duration-200 group-hover:border-technical/50 sm:size-11",
            shouldReduceMotion ? "" : "group-hover:-translate-y-0.5"
          )}
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

      <div className="relative mt-20 grid w-full min-w-0 max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-line-strong bg-surface/80 p-3 shadow-surface backdrop-blur-2xl sm:mt-24 lg:grid-cols-[1fr_0.95fr]">
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
                Secure reset
              </p>
              <h2 className="break-words text-3xl font-bold tracking-tight text-ink">
                Set a new password
              </h2>
              <p className="break-words text-sm leading-6 text-ink-muted">
                Use a strong password that you have not used for this account before.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  value={formData.newPassword}
                  error={errors.newPassword}
                  autoComplete="new-password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="mt-2 space-y-1.5" aria-live="polite">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        shouldReduceMotion ? "" : "transition-[width] duration-300",
                        strengthColor
                      )}
                      style={{ width: `${(passedPasswordRules / passwordRules.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-ink-muted">Password strength: {strengthLabel}</p>
                  <div className="grid gap-x-3 gap-y-0.5 text-[0.72rem] leading-5 text-ink-muted sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <span key={rule.label} className={cn(rule.test(formData.newPassword) && "text-success-text")}>
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                autoComplete="new-password"
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {message && (
                <p
                  className={cn(
                    "rounded-control border px-4 py-3 text-sm font-medium",
                    isSuccess
                      ? "border-success/40 bg-success/10 text-success-text"
                      : "border-highlight/40 bg-highlight/10 text-highlight-text"
                  )}
                  role={isSuccess ? "status" : "alert"}
                  aria-live={isSuccess ? "polite" : "assertive"}
                  aria-atomic="true"
                >
                  {message}
                </p>
              )}

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading && (
                  <span
                    className={`size-4 rounded-full border-2 border-ink-inverse/40 border-b-ink-inverse ${
                      shouldReduceMotion ? "" : "animate-spin"
                    }`}
                    aria-hidden="true"
                  />
                )}
                {isLoading ? "Changing password..." : "Change password"}
                {!isLoading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>

            <p className="mt-6 break-words text-center text-sm text-ink-muted">
              Already changed it?{" "}
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4 transition-colors hover:text-technical-text focus-visible:outline-offset-2"
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
