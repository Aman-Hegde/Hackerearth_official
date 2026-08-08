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
    <div className="space-y-2.5">
      <label htmlFor={inputId} className="block text-[0.95rem] font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dream-text">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "min-h-12 w-full rounded-control border bg-glass/65 px-4 py-3 text-sm text-ink shadow-soft transition duration-200 placeholder:text-ink-subtle hover:bg-glass/80 focus-visible:border-primary focus-visible:bg-glass focus-visible:shadow-glow",
            Boolean(icon) && "pl-10",
            error
              ? "border-rose/70 bg-rose/5"
              : "border-dream/30 hover:border-dream/55",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm font-semibold text-rose-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
