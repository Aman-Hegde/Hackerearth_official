import { CheckCircle2, Code2, Layout, Target } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

  const toggleDomain = (domain: Domain) => {
    if (selectedDomains.includes(domain)) {
      onChange(selectedDomains.filter((selected) => selected !== domain));
      return;
    }

    onChange([...selectedDomains, domain]);
  };

  return (
    <fieldset className="space-y-3" aria-describedby={error ? "domains-error" : undefined}>
      <legend className="text-[0.95rem] font-semibold text-ink">Domain interest</legend>
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
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className={cn(
                "group flex min-h-28 flex-col justify-between rounded-card border bg-glass/55 p-3.5 text-left text-ink shadow-soft transition duration-200 focus-visible:outline-offset-2",
                isSelected
                  ? cn(
                      "border-dream/60 bg-gradient-to-br from-dream/15 via-rose/5 to-technical/10 shadow-glow",
                      !shouldReduceMotion && "scale-[1.015]",
                    )
                  : "border-dream/25 hover:border-dream/50 hover:bg-glass/80"
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="rounded-control bg-gradient-to-br from-dream/20 to-rose/10 p-2 text-dream-text">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CheckCircle2
                  className={cn(
                    "h-5 w-5 transition-opacity",
                    isSelected ? "text-rose-text opacity-100" : "text-ink-muted opacity-60",
                  )}
                  aria-hidden="true"
                />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{name}</span>
                <span className="mt-1 block text-xs leading-5 text-ink-muted">{description}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <p id="domains-error" className="text-sm font-semibold text-rose-text" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
