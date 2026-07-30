import { FormEvent, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import PasswordInput from "../components/auth/PasswordInput";
import { useAuth } from "../context/AuthContext";

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginForm, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name: keyof LoginForm, value: LoginForm[keyof LoginForm]) => {
    if (name === "email") {
      const email = String(value).trim();
      if (!email) return "Email is required.";
      if (!emailPattern.test(email)) return "Enter a valid email address.";
    }

    if (name === "password" && !value) {
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
    if (hasSubmitted || touched[fieldName]) {
      const fieldError = validateField(fieldName, nextValue);
      setErrors((current) => ({ ...current, [fieldName]: fieldError }));
    }
    setSuccessMessage("");
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof LoginForm;
    setTouched((current) => ({ ...current, [fieldName]: true }));
    setErrors((current) => ({ ...current, [fieldName]: validateField(fieldName, formData[fieldName]) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ email: true, password: true });
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    window.setTimeout(() => {
      login(formData.email, formData.email.split("@")[0]);
      setIsLoading(false);
      setSuccessMessage("Login successful. Redirecting...");
      navigate("/");
    }, 900);
  };

  return (
    <AuthShell>
      <div className="auth-card relative grid w-[calc(100vw-1.5rem)] min-w-0 grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 pt-14 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/30 sm:w-[calc(100vw-3rem)] sm:pt-3 lg:w-full lg:max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <AuthThemeToggle />
        <AuthVisual variant="login" />

        <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-slate-200/80 bg-white/85 p-4 shadow-xl shadow-blue-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 sm:p-8 lg:p-10">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-purple-600 dark:text-blue-300 dark:hover:text-purple-300">
              HackerEarth Hub NMAMIT
            </Link>
            <div className="mt-8 space-y-2">
              <p className="text-[0.95rem] font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Portal access</p>
              <h2 className="break-words text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Login to your account</h2>
              <p className="break-words text-[0.95rem] leading-6 text-slate-600 dark:text-slate-300">Pick up where you left off in contests, resources, and domain practice.</p>
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

              <div className="flex flex-col gap-3 text-[0.95rem] sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-white/20 dark:bg-white/10"
                  />
                  Remember me
                </label>
                <Link to="/login" className="font-semibold text-blue-600 hover:text-purple-600 dark:text-cyan-300 dark:hover:text-purple-300">
                  Forgot Password
                </Link>
              </div>

              {successMessage && <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-200">{successMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:from-cyan-500 hover:via-blue-600 hover:to-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-slate-950"
              >
                {isLoading ? "Signing in..." : "Login"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </form>

            <p className="mt-6 break-words text-center text-[0.95rem] text-slate-600 dark:text-slate-300">
              New member?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-purple-600 dark:text-cyan-300 dark:hover:text-purple-300">
                Create an account
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </AuthShell>
  );
}
