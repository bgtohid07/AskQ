"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, User, BarChart2, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Inbox", href: "/inbox", icon: Inbox },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border)] min-h-[calc(100vh-4rem)] p-4 glass">
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium" 
                  : "text-[var(--secondary)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
