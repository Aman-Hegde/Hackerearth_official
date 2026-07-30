import { FormEvent, useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import DomainSelector from "../components/auth/DomainSelector";
import type { Domain } from "../components/auth/DomainSelector";
import PasswordInput from "../components/auth/PasswordInput";
import { cn } from "../lib/utils";

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
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const passedPasswordRules = useMemo(() => passwordRules.filter((rule) => rule.test(formData.password)).length, [formData.password]);
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"][passedPasswordRules];
  const strengthColor = passedPasswordRules <= 2 ? "bg-red-500" : passedPasswordRules <= 4 ? "bg-yellow-500" : "bg-green-500";

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
    setSuccessMessage("");
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof RegisterForm;
    setTouched((current) => ({ ...current, [fieldName]: true }));
    setErrors((current) => ({ ...current, [fieldName]: validateField(fieldName, formData[fieldName]) }));
  };

  const handleDomainChange = (domains: Domain[]) => {
    setSelectedDomains(domains);
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
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    window.setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Registration successful. Redirecting to login...");
      window.setTimeout(() => navigate("/login"), 700);
    }, 900);
  };

  return (
    <AuthShell>
      <div className="auth-card relative grid w-[calc(100vw-1.5rem)] min-w-0 grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 pt-14 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/30 sm:w-[calc(100vw-3rem)] sm:pt-3 lg:w-full lg:max-w-7xl lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <AuthThemeToggle />
        <div className="min-w-0 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:self-start">
          <AuthVisual variant="register" />
        </div>

        <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-slate-200/80 bg-white/85 p-4 shadow-xl shadow-blue-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 sm:p-6 lg:p-7">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-purple-600 dark:text-blue-300 dark:hover:text-purple-300">
                HackerEarth Hub NMAMIT
              </Link>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Student registration</p>
                <h2 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Create your account</h2>
                <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-slate-600 dark:text-slate-300">Tell us who you are and which tracks you want to grow in.</p>
              </div>
            </div>
            <div className="hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 px-4 py-3 font-mono text-xs text-slate-600 dark:text-cyan-100 md:block">
              const member = ready;
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <AuthInput id="name" name="name" label="Name" value={formData.name} error={errors.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" icon={<User className="h-4 w-4" aria-hidden="true" />} />
              <AuthInput id="email" name="email" label="Email ID" type="email" value={formData.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" icon={<Mail className="h-4 w-4" aria-hidden="true" />} />
              <AuthInput id="usn" name="usn" label="USN" value={formData.usn} error={errors.usn} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
              <AuthInput id="contactNumber" name="contactNumber" label="Contact Number" inputMode="numeric" value={formData.contactNumber} error={errors.contactNumber} onChange={handleChange} onBlur={handleBlur} autoComplete="tel" icon={<Phone className="h-4 w-4" aria-hidden="true" />} />
              <div>
                <PasswordInput id="password" name="password" label="Password" value={formData.password} error={errors.password} autoComplete="new-password" onChange={handleChange} onBlur={handleBlur} />
                <div className="mt-2 space-y-1.5" aria-live="polite">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div className={cn("h-full rounded-full transition-all duration-300", strengthColor)} style={{ width: `${(passedPasswordRules / passwordRules.length) * 100}%` }} />
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Password strength: {strengthLabel}</p>
                  <div className="grid gap-x-3 gap-y-0.5 text-[0.72rem] leading-5 text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <span key={rule.label} className={cn(rule.test(formData.password) && "text-green-600 dark:text-green-300")}>
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} error={errors.confirmPassword} autoComplete="new-password" onChange={handleChange} onBlur={handleBlur} />
            </div>

            <DomainSelector selectedDomains={selectedDomains} onChange={handleDomainChange} onBlur={handleDomainBlur} error={errors.domains} />

            {successMessage && <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-200">{successMessage}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:from-cyan-500 hover:via-blue-600 hover:to-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-slate-950 sm:w-auto sm:px-8"
            >
              {isLoading ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-purple-600 dark:text-cyan-300 dark:hover:text-purple-300">
              Login
            </Link>
          </p>
        </motion.section>
        </div>
      </div>
    </AuthShell>
  );
}
