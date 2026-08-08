import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AuthThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="btn btn-ghost btn-icon border-dream/30 bg-glass/80 text-ink-muted shadow-glass backdrop-blur-lg hover:border-dream/55 hover:bg-dream-soft/35 hover:text-primary-text focus-visible:outline-offset-2"
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
