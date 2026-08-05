"use client";
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading, children, disabled, type = "button", onClick }, ref) => {
    const baseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
    const variants = {
      primary: "bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white hover:opacity-90 shadow-lg hover:shadow-xl",
      secondary: "border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--border)]",
      ghost: "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
