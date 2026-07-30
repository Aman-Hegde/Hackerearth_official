import { CheckCircle2, Code2, Layout, Target } from "lucide-react";
import { motion } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "../../lib/utils";

export type Domain = "Web Development" | "DSA" | "Aptitude";

interface DomainSelectorProps {
  selectedDomains: Domain[];
  onChange: (domains: Domain[]) => void;
  onBlur?: () => void;
  error?: string;
}

const domains: Array<{ name: Domain; description: string; icon: ElementType }> = [
  { name: "Web Development", description: "Frontend, backend, and product building", icon: Layout },
  { name: "DSA", description: "Problem solving and coding rounds", icon: Code2 },
  { name: "Aptitude", description: "Placement readiness and reasoning", icon: Target },
];

export default function DomainSelector({ selectedDomains, onChange, onBlur, error }: DomainSelectorProps) {
  const toggleDomain = (domain: Domain) => {
    if (selectedDomains.includes(domain)) {
      onChange(selectedDomains.filter((selected) => selected !== domain));
      return;
    }

    onChange([...selectedDomains, domain]);
  };

  return (
    <fieldset className="space-y-3" aria-describedby={error ? "domains-error" : undefined}>
      <legend className="text-[0.95rem] font-medium text-gray-800 dark:text-gray-100">Domain interest</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {domains.map(({ name, description, icon: Icon }) => {
          const isSelected = selectedDomains.includes(name);

          return (
            <motion.button
              key={name}
              type="button"
              onClick={() => toggleDomain(name)}
              onBlur={onBlur}
              aria-pressed={isSelected}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group flex min-h-28 flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 sm:min-h-30",
                isSelected
                  ? "scale-[1.015] border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/15 dark:border-cyan-300/80 dark:bg-cyan-400/10"
                  : "border-slate-200/80 bg-white/65 hover:border-cyan-300 hover:bg-white dark:border-white/10 dark:bg-slate-950/35 dark:hover:border-cyan-400/60 dark:hover:bg-white/10"
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 p-2 text-blue-600 dark:text-blue-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CheckCircle2
                  className={cn("h-5 w-5 transition-opacity", isSelected ? "text-cyan-500 opacity-100 dark:text-cyan-300" : "text-slate-300 opacity-40")}
                  aria-hidden="true"
                />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">{name}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-400">{description}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <p id="domains-error" className="text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </fieldset>
  );
}
