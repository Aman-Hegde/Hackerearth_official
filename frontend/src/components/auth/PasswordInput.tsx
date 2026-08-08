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
        className="pr-14"
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-1 top-[2.15rem] flex size-11 items-center justify-center rounded-control border border-transparent text-ink-muted transition hover:border-dream/25 hover:bg-dream-soft/35 hover:text-primary-text focus-visible:outline-offset-2"
        aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
