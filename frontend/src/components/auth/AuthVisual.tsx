import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Braces, GitBranch, Network, Terminal } from "lucide-react";
import { cn } from "../../lib/utils";

type AuthVisualVariant = "login" | "register";

interface AuthVisualProps {
  variant: AuthVisualVariant;
  className?: string;
}

const terminalLines = [
  { prompt: "$", text: "sync hub --member", color: "text-technical-text" },
  { prompt: ">", text: "loading contests, teams, domains", color: "text-primary-text" },
  { prompt: ">", text: "status: ready_to_build", color: "text-success-text" },
];

export default function AuthVisual({ variant, className }: AuthVisualProps) {
  const isLogin = variant === "login";

  return (
    <section className={cn("ui-panel-glass relative isolate flex min-h-52 min-w-0 flex-col justify-center gap-6 overflow-hidden border-dream/25 bg-gradient-to-br from-dream-soft/40 via-glass/65 to-rose/10 p-5 text-ink sm:min-h-[300px] sm:gap-8 sm:p-8 lg:min-h-[420px] lg:p-10", className)}>
      <div
        className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full bg-dream/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-20 size-72 rounded-full bg-rose/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--color-border) / 0.2) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border) / 0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-dream/35 bg-glass/60 px-3 py-1.5 text-xs font-semibold text-dream-text shadow-soft backdrop-blur-sm">
          {isLogin ? <Terminal className="h-4 w-4" aria-hidden="true" /> : <BadgeCheck className="h-4 w-4" aria-hidden="true" />}
          {isLogin ? "Member Portal" : "Open Registration"}
        </div>
        <h1 className="mt-5 max-w-[15rem] break-words text-2xl font-bold leading-tight tracking-tight sm:mt-6 sm:max-w-md sm:text-5xl">
          <span className="sm:hidden">{isLogin ? "Build. Compete. Grow." : "Join the Hub"}</span>
          <span className="hidden sm:inline">{isLogin ? "Build. Compete. Grow." : "Join the HackerEarth Hub"}</span>
        </h1>
        <p className="mt-3 max-w-[15rem] break-words text-sm leading-6 text-ink-muted sm:mt-4 sm:max-w-md">
          <span className="sm:hidden">
            {isLogin ? "Access contests, tracks, and community updates." : "Build, compete, and collaborate with peers."}
          </span>
          <span className="hidden sm:inline">
            {isLogin
              ? "Access coding tracks, contests, community updates, and the technical practice space built for NMAMIT developers."
              : "Choose your domain, sharpen your fundamentals, collaborate with peers, and get ready for hackathons and placements."}
          </span>
        </p>
      </div>

      <div className="relative z-10 mt-2 hidden sm:block">
        {isLogin ? <TerminalVisual /> : <NetworkVisual />}
      </div>
    </section>
  );
}

function TerminalVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-w-0 overflow-hidden rounded-card border border-dream/25 bg-glass/60 p-4 shadow-glass backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-highlight" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
        <span className="ml-auto truncate font-mono text-xs text-ink-muted">hub-session.ts</span>
      </div>
      <div className="space-y-3 font-mono text-xs sm:text-sm">
        {terminalLines.map((line, index) => (
          <motion.div
            key={line.text}
            className="flex gap-3"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.12 * index,
              duration: shouldReduceMotion ? 0 : 0.35,
            }}
          >
            <span className="text-creative-text">{line.prompt}</span>
            <span className={cn("min-w-0 truncate", line.color)}>{line.text}</span>
            {index === terminalLines.length - 1 && (
              <span
                className="h-5 w-2 rounded-sm bg-technical"
                aria-hidden="true"
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 text-center text-[0.68rem] text-ink-muted">
        {["DSA", "WEB", "APT"].map((item) => (
          <div key={item} className="min-w-0 rounded-lg border border-dream/20 bg-dream-soft/25 px-2 py-2">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkVisual() {
  const nodes = [
    "left-[12%] top-[36%]",
    "left-[34%] top-[18%]",
    "left-[48%] top-[56%]",
    "left-[68%] top-[26%]",
    "left-[78%] top-[68%]",
  ];

  return (
    <div className="relative h-56 min-w-0 overflow-hidden rounded-card border border-dream/25 bg-glass/60 p-4 shadow-glass backdrop-blur-sm">
      {[
        "left-[18%] right-[20%] top-1/2 -rotate-12 from-technical/10 via-technical/70 to-creative/10",
        "left-[35%] right-[16%] top-[42%] rotate-[22deg] from-creative/10 via-creative/70 to-primary/10",
        "bottom-[28%] left-[16%] right-[18%] from-primary/10 via-primary/70 to-technical/10",
      ].map((line) => (
        <div
          key={line}
          className={cn("absolute h-px bg-gradient-to-r", line)}
          aria-hidden="true"
        />
      ))}
      {nodes.map((position, index) => (
        <div
          key={position}
          className={cn("absolute flex h-11 w-11 items-center justify-center rounded-2xl border border-dream/30 bg-glass/70 text-dream-text shadow-soft backdrop-blur-sm", position)}
          aria-hidden="true"
        >
          {index % 2 === 0 ? <Braces className="h-5 w-5" aria-hidden="true" /> : <GitBranch className="h-5 w-5" aria-hidden="true" />}
        </div>
      ))}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-control border border-dream/20 bg-glass/70 px-3 py-2 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-2">
          <Network className="h-4 w-4 text-technical-text" aria-hidden="true" />
          domain graph
        </span>
        <span className="font-mono text-technical-text">active</span>
      </div>
    </div>
  );
}
