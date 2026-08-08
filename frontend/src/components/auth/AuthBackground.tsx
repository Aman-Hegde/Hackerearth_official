const codeTokens = ["</>", "{}", "01", "const", "git", "fn", "API"];

export default function AuthBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-canvas/35 dark:bg-canvas/25" />
      <div
        className="absolute inset-0 opacity-35 dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--color-border) / 0.22) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border) / 0.22) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -left-28 top-10 h-64 w-64 rounded-full bg-dream/10" />
      <div className="absolute bottom-[-8rem] right-[-6rem] h-72 w-72 rounded-full bg-rose/8" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgb(var(--color-glass) / 0.7), transparent 38%)",
        }}
      />

      <div className="absolute inset-0 hidden sm:block">
        {codeTokens.map((token, index) => (
          <span
            key={token}
            className="absolute rounded-full border border-dream/20 bg-glass/35 px-3 py-1 font-mono text-xs text-dream-text/35"
            style={{
              left: `${8 + index * 13}%`,
              top: `${14 + (index % 4) * 19}%`,
            }}
          >
            {token}
          </span>
        ))}
      </div>
    </div>
  );
}
