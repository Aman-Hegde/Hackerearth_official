import type { ReactNode } from "react";
import AuthBackground from "./AuthBackground";

interface AuthShellProps {
  children: ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-gray-900 transition-colors duration-300 dark:text-white">
      <AuthBackground />
      <main className="relative z-10 flex min-h-screen w-full max-w-full items-center justify-center overflow-hidden px-3 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
