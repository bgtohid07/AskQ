import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--background)]">
      <div className="absolute top-0 right-0 p-4 z-50 flex items-center gap-4">
        <ThemeToggle />
      </div>
      <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] bg-gradient-to-b from-[#6C5CE7]/20 to-transparent blur-3xl rounded-full -z-10" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-t from-[#00B894]/20 to-transparent blur-3xl rounded-full -z-10" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Link href="/" className="font-bold text-3xl tracking-tighter text-gradient mb-8">
          AskQ
        </Link>
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] p-8 rounded-3xl shadow-2xl glass">
          {children}
        </div>
      </div>
    </div>
  );
}
