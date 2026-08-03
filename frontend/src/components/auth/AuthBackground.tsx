import { motion, useReducedMotion } from "framer-motion";

const codeTokens = ["</>", "{}", "01", "const", "git", "fn", "API"];

export default function AuthBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-canvas" />
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--color-border) / 0.22) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border) / 0.22) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-creative/15 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-technical/15 blur-3xl" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgb(var(--color-surface) / 0.88), transparent 36%)",
        }}
      />

      <motion.div
        className="absolute inset-0 hidden sm:block"
        animate={shouldReduceMotion ? undefined : { y: [-8, 8, -8] }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 28, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {codeTokens.map((token, index) => (
          <span
            key={token}
            className="absolute rounded-full border border-primary/20 bg-surface/40 px-3 py-1 font-mono text-xs text-primary-text/40 backdrop-blur"
            style={{
              left: `${8 + index * 13}%`,
              top: `${14 + (index % 4) * 19}%`,
            }}
          >
            {token}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
