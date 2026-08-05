"use client";
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Dropdown } from "../ui/Dropdown";

export function NotificationBell() {
  const [unread] = useState(3);

  const trigger = (
    <div className="relative p-2 rounded-full hover:bg-[var(--border)] transition-colors">
      <Bell className="w-5 h-5 text-[var(--secondary)] hover:text-[var(--foreground)]" />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--background)] animate-pulse" />
      )}
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <div className="px-4 py-2 border-b border-[var(--border)]">
        <h3 className="font-semibold text-sm">Notifications</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 hover:bg-[var(--border)] transition-colors cursor-pointer flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex flex-shrink-0 items-center justify-center font-bold text-xs">
              U
            </div>
            <div>
              <p className="text-sm text-[var(--foreground)] line-clamp-2">
                <span className="font-semibold">Someone</span> asked you a new question!
              </p>
              <p className="text-xs text-[var(--secondary)] mt-1">2 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </Dropdown>
  );
}
