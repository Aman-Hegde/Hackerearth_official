import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MailCheck, RotateCw } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import { ApiError, apiRequest } from "../lib/api";
import { cn } from "../lib/utils";
import logo from "../assets/image.png";

interface ForgotPasswordOtpState {
  email?: string;
  expiresInSeconds?: number;
  resendAvailableInSeconds?: number;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  passwordChangeAuthorized?: boolean;
  expiresInSeconds?: number;
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds?: number;
  resendAvailableInSeconds?: number;
}

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getNumberField = (data: unknown, field: string) => {
  if (data && typeof data === "object" && field in data) {
    const value = data[field as keyof typeof data];
    return typeof value === "number" ? value : undefined;
  }

  return undefined;
};

export default function ForgotPasswordOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const state = (location.state ?? {}) as ForgotPasswordOtpState;
  const email = typeof state.email === "string" ? state.email : "";
  const [otp, setOtp] = useState("");
  const [expirySeconds, setExpirySeconds] = useState(
    typeof state.expiresInSeconds === "number" ? state.expiresInSeconds : 600
  );
  const [cooldownSeconds, setCooldownSeconds] = useState(
    typeof state.resendAvailableInSeconds === "number"
      ? state.resendAvailableInSeconds
      : 60
  );
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setExpirySeconds((current) => Math.max(0, current - 1));
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const isExpired = expirySeconds <= 0;
  const isOtpComplete = /^\d{6}$/.test(otp);
  const canVerify = isOtpComplete && !isExpired && !isLocked && !isVerifying;
  const canResend = cooldownSeconds <= 0 && !isResending;

  const helperMessage = useMemo(() => {
    if (isLocked) return "Too many incorrect attempts. Request a new OTP to continue.";
    if (isExpired) return "OTP expired. Request a new OTP to continue.";
    return "Enter the six-digit OTP sent to your NMAMIT email address.";
  }, [isExpired, isLocked]);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/\D/g, "").slice(0, 6));
    setErrorMessage("");
    setStatusMessage("");
  };

  const handleVerifyError = (error: ApiError) => {
    if (error.code === "OTP_INVALID") {
      setRemainingAttempts(getNumberField(error.data, "remainingAttempts") ?? null);
      setErrorMessage(error.message || "Incorrect OTP.");
      return;
    }

    if (error.code === "OTP_EXPIRED") {
      setExpirySeconds(0);
      setErrorMessage("OTP expired. Request a new OTP to continue.");
      return;
    }

    if (error.code === "OTP_LOCKED") {
      setIsLocked(true);
      setErrorMessage("Too many incorrect attempts. Request a new OTP to continue.");
      return;
    }

    setErrorMessage(error.message || "Unable to verify OTP. Please try again.");
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOtpComplete) {
      setErrorMessage("Enter a valid six-digit OTP.");
      return;
    }

    if (isExpired || isLocked) return;

    setIsVerifying(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const data = await apiRequest<VerifyOtpResponse>(
        "/api/auth/forgot-password/verify-otp",
        {
          method: "POST",
          body: JSON.stringify({ email, otp }),
        }
      );

      setStatusMessage(data.message || "OTP verified. You may now set a new password.");
      navigate("/forgot-password/change-password", { state: { email } });
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        handleVerifyError(requestError);
      } else {
        setErrorMessage("Unable to connect to the server. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const data = await apiRequest<ResendOtpResponse>(
        "/api/auth/forgot-password/resend-otp",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );

      setOtp("");
      setRemainingAttempts(null);
      setIsLocked(false);
      setExpirySeconds(data.expiresInSeconds ?? 600);
      setCooldownSeconds(data.resendAvailableInSeconds ?? 60);
      setStatusMessage(data.message || "A new OTP has been sent.");
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        if (requestError.code === "OTP_RESEND_COOLDOWN") {
          setCooldownSeconds(getNumberField(requestError.data, "retryAfterSeconds") ?? 60);
          setErrorMessage(requestError.message || "Please wait before requesting another OTP.");
        } else {
          setErrorMessage(requestError.message || "Unable to resend OTP. Please try again.");
        }
      } else {
        setErrorMessage("Unable to connect to the server. Please try again.");
      }
    } finally {
      setIsResending(false);
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

      <div className="relative mt-20 grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-[2rem] border border-line-strong bg-surface/80 p-3 shadow-surface backdrop-blur-2xl sm:mt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <AuthVisual variant="register" />

        <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-line-strong bg-surface/95 p-4 shadow-surface backdrop-blur-xl sm:p-6 lg:p-8">
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
            aria-busy={isVerifying || isResending}
          >
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-technical-text">
                Password reset
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-ink">Verify your OTP</h2>
              <p className="text-sm leading-6 text-ink-muted">
                We sent a six-digit code to <span className="font-semibold text-ink">{email}</span>.
              </p>
            </div>

            <form className="mt-7 space-y-5" onSubmit={handleVerify} noValidate>
              <div className="space-y-2">
                <label htmlFor="forgotPasswordOtp" className="block text-[0.95rem] font-medium text-ink">
                  Six-digit OTP
                </label>
                <div className="relative">
                  <MailCheck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                  <input
                    id="forgotPasswordOtp"
                    value={otp}
                    onChange={(event) => handleOtpChange(event.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    disabled={isLocked || isVerifying}
                    aria-invalid={Boolean(errorMessage)}
                    className="w-full rounded-control border border-line-strong bg-surface/90 py-4 pl-12 pr-4 text-center font-mono text-2xl tracking-[0.35em] text-ink shadow-soft outline-none transition placeholder:tracking-normal focus:border-technical focus:ring-2 focus:ring-technical/30 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="000000"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-card border border-line bg-surface-muted px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Expires in</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-ink">{formatTime(expirySeconds)}</p>
                </div>
                <div className="rounded-card border border-line bg-surface-muted px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Resend available</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-ink">
                    {cooldownSeconds > 0 ? formatTime(cooldownSeconds) : "Now"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-ink-muted">{helperMessage}</p>

              {remainingAttempts !== null && !isLocked && (
                <p className="rounded-control border border-highlight/35 bg-highlight/10 px-4 py-3 text-sm font-medium text-highlight-text">
                  Remaining attempts: {remainingAttempts}
                </p>
              )}

              {errorMessage && (
                <p className="rounded-control border border-highlight/40 bg-highlight/10 px-4 py-3 text-sm font-medium text-highlight-text" role="alert">
                  {errorMessage}
                </p>
              )}

              {statusMessage && (
                <p className="rounded-control border border-success/40 bg-success/10 px-4 py-3 text-sm font-medium text-success-text" role="status" aria-live="polite">
                  {statusMessage}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={!canVerify} className="btn btn-primary group w-full sm:flex-1">
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                  <ArrowRight className={cn("h-4 w-4", shouldReduceMotion ? "" : "transition-transform group-hover:translate-x-0.5")} aria-hidden="true" />
                </button>
                <button type="button" onClick={handleResend} disabled={!canResend} className="btn btn-secondary w-full sm:flex-1">
                  <RotateCw className={cn("h-4 w-4", isResending && !shouldReduceMotion ? "animate-spin" : "")} aria-hidden="true" />
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-ink-muted">
              Need a different email?{" "}
              <Link to="/forgot-password" className="inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4 transition-colors hover:text-technical-text focus-visible:outline-offset-2">
                Start again
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </AuthShell>
  );
}
