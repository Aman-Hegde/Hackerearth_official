import type { ReactNode } from "react";
import AuthBackground from "./AuthBackground";

interface AuthShellProps {
  children: ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-ink transition-colors duration-300">
      <AuthBackground />
      <div className="relative z-10 flex min-h-screen w-full min-w-0 max-w-full items-center justify-center overflow-hidden px-3 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
