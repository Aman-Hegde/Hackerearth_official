import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export default function AuthInput({ label, error, icon, id, className, ...props }: AuthInputProps) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-[0.95rem] font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "min-h-11 w-full rounded-control border bg-surface px-4 py-3 text-sm text-ink shadow-soft transition-colors duration-200 placeholder:text-ink-muted focus-visible:border-focus",
            Boolean(icon) && "pl-10",
            error
              ? "border-red-500 dark:border-red-400"
              : "border-line-strong hover:border-technical",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm font-medium text-red-600 dark:text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
