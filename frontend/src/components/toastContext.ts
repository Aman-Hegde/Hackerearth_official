import { createContext, type ReactNode, useContext } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
  action?: ReactNode;
  durationMs?: number;
}

export interface ToastContextValue {
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
};
