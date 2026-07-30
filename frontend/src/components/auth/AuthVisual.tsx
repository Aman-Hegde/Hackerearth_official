import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Braces, GitBranch, Network, Terminal } from "lucide-react";
import { cn } from "../../lib/utils";

type AuthVisualVariant = "login" | "register";

interface AuthVisualProps {
  variant: AuthVisualVariant;
}

const terminalLines = [
  { prompt: "$", text: "sync hub --member", color: "text-cyan-200" },
  { prompt: ">", text: "loading contests, teams, domains", color: "text-blue-200" },
  { prompt: ">", text: "status: ready_to_build", color: "text-emerald-200" },
];

export default function AuthVisual({ variant }: AuthVisualProps) {
  const isLogin = variant === "login";

  return (
    <section className="relative isolate flex h-full min-w-0 flex-col justify-center gap-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#06111f] p-5 text-white shadow-2xl shadow-blue-950/30 sm:min-h-[300px] sm:gap-8 sm:p-8 lg:min-h-[420px] lg:rounded-[1.8rem] lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(147,51,234,0.28),transparent_35%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-100 backdrop-blur">
          {isLogin ? <Terminal className="h-4 w-4" aria-hidden="true" /> : <BadgeCheck className="h-4 w-4" aria-hidden="true" />}
          {isLogin ? "Member Portal" : "Open Registration"}
        </div>
        <h1 className="mt-5 max-w-[15rem] break-words text-2xl font-bold leading-tight tracking-tight sm:mt-6 sm:max-w-md sm:text-5xl">
          <span className="sm:hidden">{isLogin ? "Build. Compete. Grow." : "Join the Hub"}</span>
          <span className="hidden sm:inline">{isLogin ? "Build. Compete. Grow." : "Join the HackerEarth Hub"}</span>
        </h1>
        <p className="mt-3 max-w-[15rem] break-words text-sm leading-6 text-slate-300 sm:mt-4 sm:max-w-md">
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
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-auto truncate font-mono text-xs text-slate-500">hub-session.ts</span>
      </div>
      <div className="space-y-3 font-mono text-xs sm:text-sm">
        {terminalLines.map((line, index) => (
          <motion.div
            key={line.text}
            className="flex gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 * index, duration: 0.35 }}
          >
            <span className="text-violet-300">{line.prompt}</span>
            <span className={cn("min-w-0 truncate", line.color)}>{line.text}</span>
            {index === terminalLines.length - 1 && (
              <motion.span
                className="h-5 w-2 rounded-sm bg-cyan-200"
                animate={shouldReduceMotion ? undefined : { opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 text-center text-[0.68rem] text-slate-400">
        {["DSA", "WEB", "APT"].map((item) => (
          <div key={item} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkVisual() {
  const shouldReduceMotion = useReducedMotion();
  const nodes = [
    "left-[12%] top-[36%]",
    "left-[34%] top-[18%]",
    "left-[48%] top-[56%]",
    "left-[68%] top-[26%]",
    "left-[78%] top-[68%]",
  ];

  return (
    <div className="relative h-56 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-2xl shadow-violet-950/30 backdrop-blur">
      {[
        "left-[18%] right-[20%] top-1/2 -rotate-12 from-cyan-300/10 via-cyan-300/70 to-violet-300/10",
        "left-[35%] right-[16%] top-[42%] rotate-[22deg] from-violet-300/10 via-violet-300/70 to-blue-300/10",
        "bottom-[28%] left-[16%] right-[18%] from-blue-300/10 via-blue-300/70 to-cyan-300/10",
      ].map((line) => (
        <motion.div
          key={line}
          className={cn("absolute h-px bg-gradient-to-r", line)}
          animate={shouldReduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((position, index) => (
        <motion.div
          key={position}
          className={cn("absolute flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/25 bg-white/10 text-cyan-100 shadow-lg shadow-cyan-500/10 backdrop-blur", position)}
          animate={shouldReduceMotion ? undefined : { y: [0, index % 2 ? 4 : -4, 0], boxShadow: ["0 10px 24px rgba(34,211,238,0.08)", "0 12px 30px rgba(34,211,238,0.18)", "0 10px 24px rgba(34,211,238,0.08)"] }}
          transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          {index % 2 === 0 ? <Braces className="h-5 w-5" aria-hidden="true" /> : <GitBranch className="h-5 w-5" aria-hidden="true" />}
        </motion.div>
      ))}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
        <span className="inline-flex items-center gap-2">
          <Network className="h-4 w-4 text-cyan-200" aria-hidden="true" />
          domain graph
        </span>
        <span className="font-mono text-cyan-200">active</span>
      </div>
    </div>
  );
}
