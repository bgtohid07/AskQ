"use client";
import React from "react";
import { Search } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "search";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, variant = "default", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-[var(--secondary)]">{label}</label>}
        <div className="relative">
          {variant === "search" && !icon && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary)]" />
          )}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all ${
              (icon || variant === "search") ? "pl-10" : ""
            } ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
