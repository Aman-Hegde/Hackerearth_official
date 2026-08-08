import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MailX } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthThemeToggle from "../components/auth/AuthThemeToggle";
import AuthVisual from "../components/auth/AuthVisual";
import logo from "../assets/image.png";

export default function ForgotPasswordPage() {
  const shouldReduceMotion = useReducedMotion();

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
                Password reset by email is temporarily unavailable. Please contact a HackerEarth Hub administrator.
              </p>
            </div>

            <div className="mt-8 rounded-card border border-highlight/35 bg-gradient-to-br from-highlight/10 via-rose/5 to-dream/10 p-5 text-ink shadow-soft">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-control border border-highlight/20 bg-highlight/10 text-highlight-text">
                  <MailX className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">Email reset unavailable</p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Password reset by email is temporarily unavailable. Please contact a HackerEarth Hub administrator.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/login" className="btn btn-primary mt-8 w-full">
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
