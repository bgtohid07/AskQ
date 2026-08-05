"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, User, Home, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setShow(false);
        } else {
          setShow(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Inbox", href: "/inbox", icon: Inbox },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: show ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)] pb-safe"
    >
      <nav className="flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href) && link.href !== "/";
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-[var(--accent)]" : "text-[var(--secondary)]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
