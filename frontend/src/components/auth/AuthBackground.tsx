import { motion } from "framer-motion";

const codeTokens = ["</>", "{}", "01", "const", "git", "fn", "API"];

export default function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#020617]" />
      <div className="absolute inset-0 opacity-[0.16] dark:opacity-[0.24] bg-[linear-gradient(rgba(37,99,235,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.24)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl dark:bg-cyan-500/20" />
      <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl dark:bg-purple-600/25" />
      <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-cyan-400/14 blur-3xl dark:bg-blue-500/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.88),transparent_36%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.44),transparent_38%)]" />

      <motion.div
        className="absolute inset-0 hidden sm:block motion-reduce:hidden"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        {codeTokens.map((token, index) => (
          <span
            key={token}
            className="absolute rounded-full border border-blue-500/10 bg-white/30 px-3 py-1 font-mono text-xs text-blue-900/25 backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:text-cyan-100/25"
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
