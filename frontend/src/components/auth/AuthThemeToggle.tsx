import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AuthThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="absolute right-4 top-4 z-20 rounded-full border border-slate-200/80 bg-white/85 p-2.5 text-slate-700 shadow-lg shadow-blue-950/10 backdrop-blur-xl transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200 dark:shadow-black/30 dark:hover:text-cyan-300"
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
