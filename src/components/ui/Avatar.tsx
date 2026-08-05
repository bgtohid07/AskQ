"use client";
import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  isVerified?: boolean;
}

export function Avatar({ src, alt = "Avatar", initials = "?", size = "md", isOnline, isVerified }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
  };

  return (
    <div className={`relative inline-block ${sizes[size]}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover rounded-full bg-[var(--border)]" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6C5CE7] to-[#00B894] text-white rounded-full font-bold">
          {initials}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-[var(--card)] rounded-full" />
      )}
      {isVerified && (
        <span className="absolute top-0 right-0 block w-4 h-4 bg-blue-500 border-2 border-[var(--card)] rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </div>
  );
}
