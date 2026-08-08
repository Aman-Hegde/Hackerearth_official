import type { ReactNode } from "react";
import AuthBackground from "./AuthBackground";
import PageTransition from "../ui/PageTransition";
import { cn } from "../../lib/utils";

interface AuthShellProps {
  children: ReactNode;
  waveClassName?: string;
}

export default function AuthShell({
  children,
  waveClassName,
}: AuthShellProps) {
  return (
    <PageTransition className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-ink transition-colors duration-300">
      <AuthBackground />
      <div className={cn('pointer-events-none absolute inset-0 bg-dream/5', waveClassName)} aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen w-full min-w-0 max-w-full items-center justify-center overflow-x-hidden px-3 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </PageTransition>
  );
}
