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
      <label htmlFor={inputId} className="block text-[0.95rem] font-medium text-gray-800 dark:text-gray-100">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "w-full rounded-2xl border bg-white/75 px-4 py-3.5 text-sm text-slate-950 shadow-sm shadow-blue-950/5 transition-all duration-200 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500 dark:shadow-black/20",
            icon && "pl-10",
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/30 dark:border-red-400/70" : "border-slate-200/80 hover:border-blue-300/80 dark:hover:border-cyan-400/40",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
