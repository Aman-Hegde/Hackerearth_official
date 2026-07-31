import { FormEvent, useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import DomainSelector from "../components/auth/DomainSelector";
import type { Domain } from "../components/auth/DomainSelector";
import PasswordInput from "../components/auth/PasswordInput";
import { cn } from "../lib/utils";
import logo from "../assets/image.png";

interface RegisterForm {
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
}

const initialForm: RegisterForm = {
  name: "",
  email: "",
  usn: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = [
  { label: "8 characters", test: (value: string) => value.length >= 8 },
  { label: "1 uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "1 lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "1 number", test: (value: string) => /\d/.test(value) },
  { label: "1 special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>(initialForm);
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm | "domains", string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterForm | "domains", boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const passedPasswordRules = useMemo(() => passwordRules.filter((rule) => rule.test(formData.password)).length, [formData.password]);
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"][passedPasswordRules];
  const strengthColor = passedPasswordRules <= 2 ? "bg-highlight" : passedPasswordRules <= 4 ? "bg-primary" : "bg-success";

  const getPasswordRuleCount = (password: string) => passwordRules.filter((rule) => rule.test(password)).length;

  const validateField = (name: keyof RegisterForm | "domains", value: string | Domain[], nextForm = formData) => {
    if (name === "domains") {
      return Array.isArray(value) && value.length > 0 ? undefined : "Select at least one domain.";
    }

    const fieldValue = String(value);

    if (name === "name" && !fieldValue.trim()) return "Name is required.";
    if (name === "email") {
      const email = fieldValue.trim();
      if (!email) return "Email ID is required.";
      if (!emailPattern.test(email)) return "Enter a valid email address.";
    }
    if (name === "usn" && !fieldValue.trim()) return "USN is required.";
    if (name === "contactNumber") {
      if (!fieldValue.trim()) return "Contact number is required.";
      if (!/^\d{10}$/.test(fieldValue)) return "Contact number must contain exactly 10 digits.";
    }
    if (name === "password") {
      if (!fieldValue) return "Password is required.";
      if (getPasswordRuleCount(fieldValue) < passwordRules.length) return "Password must satisfy all strength requirements.";
    }
    if (name === "confirmPassword") {
      if (!fieldValue) return "Confirm password is required.";
      if (fieldValue !== nextForm.password) return "Passwords do not match.";
    }

    return undefined;
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof RegisterForm | "domains", string>> = {};

    (["name", "email", "usn", "contactNumber", "password", "confirmPassword"] as Array<keyof RegisterForm>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) nextErrors[field] = error;
    });
    const domainsError = validateField("domains", selectedDomains);
    if (domainsError) nextErrors.domains = domainsError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof RegisterForm;
    const nextValue = name === "contactNumber" ? value.replace(/\D/g, "").slice(0, 10) : value;
    const nextForm = { ...formData, [fieldName]: nextValue };

    setFormData(nextForm);
    if (hasSubmitted || touched[fieldName] || (fieldName === "password" && touched.confirmPassword)) {
      setErrors((current) => ({
        ...current,
        ...(hasSubmitted || touched[fieldName] ? { [fieldName]: validateField(fieldName, nextValue, nextForm) } : {}),
        ...(fieldName === "password" && (hasSubmitted || touched.confirmPassword)
          ? { confirmPassword: validateField("confirmPassword", nextForm.confirmPassword, nextForm) }
          : {}),
      }));
    }
    setStatusMessage("");
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof RegisterForm;
    setTouched((current) => ({ ...current, [fieldName]: true }));
    setErrors((current) => ({ ...current, [fieldName]: validateField(fieldName, formData[fieldName]) }));
  };

  const handleDomainChange = (domains: Domain[]) => {
    setSelectedDomains(domains);
    setStatusMessage("");
    if (hasSubmitted || touched.domains) {
      setErrors((current) => ({ ...current, domains: validateField("domains", domains) }));
    }
  };

  const handleDomainBlur = () => {
    setTouched((current) => ({ ...current, domains: true }));
    setErrors((current) => ({ ...current, domains: validateField("domains", selectedDomains) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({
      name: true,
      email: true,
      usn: true,
      contactNumber: true,
      password: true,
      confirmPassword: true,
      domains: true,
    });
    setStatusMessage("");
    if (!validateForm()) return;

    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
      setStatusMessage("Registration backend integration is pending. Your account has not been created.");
    }, 900);
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

      <div className="relative mt-20 grid w-full min-w-0 max-w-7xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-line-strong bg-surface/80 p-3 shadow-surface backdrop-blur-2xl sm:mt-24 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:self-start">
          <AuthVisual variant="register" />
        </div>

        <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-line-strong bg-surface/95 p-4 shadow-surface backdrop-blur-xl sm:p-6 lg:p-7">
        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-technical-text">Student registration</p>
                <h2 className="mt-2 break-words text-3xl font-bold tracking-tight text-ink">Create your account</h2>
                <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-ink-muted">Tell us who you are and which tracks you want to grow in.</p>
              </div>
            </div>
            <div className="hidden rounded-card border border-technical/30 bg-gradient-to-br from-technical/10 to-creative/10 px-4 py-3 font-mono text-xs text-ink-muted md:block">
              const member = ready;
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
            <div className="grid gap-4 md:grid-cols-2">
              <AuthInput id="name" name="name" label="Name" value={formData.name} error={errors.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" icon={<User className="h-4 w-4" aria-hidden="true" />} />
              <AuthInput id="email" name="email" label="Email ID" type="email" value={formData.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" icon={<Mail className="h-4 w-4" aria-hidden="true" />} />
              <AuthInput id="usn" name="usn" label="USN" value={formData.usn} error={errors.usn} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
              <AuthInput id="contactNumber" name="contactNumber" label="Contact Number" inputMode="numeric" value={formData.contactNumber} error={errors.contactNumber} onChange={handleChange} onBlur={handleBlur} autoComplete="tel" icon={<Phone className="h-4 w-4" aria-hidden="true" />} />
              <div>
                <PasswordInput id="password" name="password" label="Password" value={formData.password} error={errors.password} autoComplete="new-password" onChange={handleChange} onBlur={handleBlur} />
                <div className="mt-2 space-y-1.5" aria-live="polite">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        shouldReduceMotion ? "" : "transition-[width] duration-300",
                        strengthColor,
                      )}
                      style={{ width: `${(passedPasswordRules / passwordRules.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-ink-muted">Password strength: {strengthLabel}</p>
                  <div className="grid gap-x-3 gap-y-0.5 text-[0.72rem] leading-5 text-ink-muted sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <span key={rule.label} className={cn(rule.test(formData.password) && "text-success-text")}>
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} error={errors.confirmPassword} autoComplete="new-password" onChange={handleChange} onBlur={handleBlur} />
            </div>

            <DomainSelector selectedDomains={selectedDomains} onChange={handleDomainChange} onBlur={handleDomainBlur} error={errors.domains} />

            {statusMessage && (
              <p
                className="rounded-control border border-highlight/40 bg-highlight/10 px-4 py-3 text-sm font-medium text-highlight-text"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary group w-full sm:w-auto sm:px-8"
            >
              {isLoading ? "Checking details..." : "Submit registration details"}
              <ArrowRight
                className={cn(
                  "h-4 w-4",
                  shouldReduceMotion ? "" : "transition-transform group-hover:translate-x-0.5",
                )}
                aria-hidden="true"
              />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-muted">
            Already registered?{" "}
            <Link to="/login" className="inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4 transition-colors hover:text-technical-text focus-visible:outline-offset-2">
              Login
            </Link>
          </p>
        </motion.section>
        </div>
      </div>
    </AuthShell>
  );
}
