"use client";
import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-gradient">AskQ</span>
          <span className="text-[var(--secondary)] text-sm">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm text-[var(--secondary)]">
          <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
