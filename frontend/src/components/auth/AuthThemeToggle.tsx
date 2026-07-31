import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AuthThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="btn btn-ghost btn-icon absolute right-4 top-4 z-20 border-line-strong bg-surface/95 text-ink-muted shadow-soft backdrop-blur-xl hover:border-technical hover:text-technical-text focus-visible:outline-offset-2"
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
