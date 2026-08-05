"use client";
import React from "react";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, hoverEffect = false, ...props }, ref) => {
    const Component = hoverEffect ? motion.div : "div";
    const motionProps = hoverEffect ? { whileHover: { y: -2 }, transition: { duration: 0.2 } } : {};

    return (
      <Component
        ref={ref as any}
        className={`bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-5 glass ${className}`}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);
Card.displayName = "Card";
