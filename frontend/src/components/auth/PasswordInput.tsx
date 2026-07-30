import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import AuthInput from "./AuthInput";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  error,
  autoComplete,
  onChange,
  onBlur,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <AuthInput
        id={id}
        name={name}
        label={label}
        type={isVisible ? "text" : "password"}
        value={value}
        error={error}
        autoComplete={autoComplete}
        onChange={onChange}
        onBlur={onBlur}
        icon={<Lock className="h-4 w-4" aria-hidden="true" />}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-3 top-9 rounded-xl p-2 text-slate-500 transition-colors hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-400 dark:hover:text-cyan-300"
        aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
