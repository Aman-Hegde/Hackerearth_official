import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "../lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
  action?: ReactNode;
  durationMs?: number;
}

interface Toast extends Required<Omit<ToastInput, "title" | "action">> {
  id: string;
  title?: string;
  action?: ReactNode;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<
  ToastVariant,
  {
    container: string;
    iconWrap: string;
    icon: ReactNode;
  }
> = {
  success: {
    container: "border-success/40 bg-success/10 text-success-text",
    iconWrap: "bg-success/15 text-success-text",
    icon: <CheckCircle2 className="size-5" aria-hidden="true" />,
  },
  error: {
    container: "border-highlight/45 bg-highlight/10 text-highlight-text",
    iconWrap: "bg-highlight/15 text-highlight-text",
    icon: <AlertCircle className="size-5" aria-hidden="true" />,
  },
  warning: {
    container: "border-amber-400/45 bg-amber-400/10 text-amber-700 dark:text-amber-200",
    iconWrap: "bg-amber-400/15 text-amber-700 dark:text-amber-200",
    icon: <AlertTriangle className="size-5" aria-hidden="true" />,
  },
  info: {
    container: "border-technical/45 bg-technical/10 text-technical-text",
    iconWrap: "bg-technical/15 text-technical-text",
    icon: <Info className="size-5" aria-hidden="true" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      message,
      variant = "info",
      action,
      durationMs = 5000,
    }: ToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((current) => [
        ...current,
        {
          id,
          title,
          message,
          variant,
          action,
          durationMs,
        },
      ]);

      if (durationMs > 0) {
        window.setTimeout(() => dismissToast(id), durationMs);
      }

      return id;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-3 top-3 z-[80] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col gap-3 sm:right-5 sm:top-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const styles = variantStyles[toast.variant];

            return (
              <motion.div
                key={toast.id}
                layout
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 32, y: -8 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, y: -6 }
                }
                transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
                className={cn(
                  "pointer-events-auto overflow-hidden rounded-card border bg-surface/95 p-4 shadow-surface backdrop-blur-xl",
                  styles.container
                )}
                role={toast.variant === "error" || toast.variant === "warning" ? "alert" : "status"}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-control",
                      styles.iconWrap
                    )}
                  >
                    {styles.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    {toast.title && (
                      <p className="font-semibold leading-5 text-ink">{toast.title}</p>
                    )}
                    <p className={cn("text-sm leading-6", toast.title && "mt-1")}>
                      {toast.message}
                    </p>
                    {toast.action && <div className="mt-3">{toast.action}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-control text-ink-muted transition hover:bg-surface-muted hover:text-ink focus-visible:outline-offset-2"
                    aria-label="Close notification"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
};
