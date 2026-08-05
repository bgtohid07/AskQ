"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NotificationBell } from "../notifications/NotificationBell";
import { Avatar } from "../ui/Avatar";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { Search, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const activeUser = user.dbUser || user.firebaseUser;

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-[var(--border)] bg-[var(--background)]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-gradient">
              AskQ
            </Link>
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary)]" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-[var(--border)]/50 border border-[var(--border)] rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {activeUser ? (
              <>
                <NotificationBell />
                <Dropdown
                  trigger={
                    <Avatar
                      src={user.dbUser?.profilePicture || undefined}
                      initials={user.dbUser?.name?.charAt(0) || "U"}
                      size="sm"
                      isOnline
                    />
                  }
                  align="right"
                >
                  <DropdownItem>
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/settings" className="flex items-center gap-2 w-full">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                  </DropdownItem>
                  <div className="border-t border-[var(--border)] my-1"></div>
                  <DropdownItem
                    onClick={logout}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
