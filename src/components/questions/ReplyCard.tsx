"use client";
import React from "react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";

interface ReplyCardProps {
  question: string;
  reply: string;
  username: string;
  avatarUrl?: string;
}

export function ReplyCard({ question, reply, username, avatarUrl }: ReplyCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border)]/50 relative">
        <div className="absolute -top-3 left-4 bg-[var(--card)] px-2 text-xs font-bold text-[var(--secondary)]">
          QUESTION
        </div>
        <p className="text-[var(--foreground)] italic">"{question}"</p>
      </div>
      
      <div className="flex gap-3">
        <Avatar src={avatarUrl} initials={username.charAt(0).toUpperCase()} size="sm" />
        <div className="flex-1 bg-[var(--accent)]/10 text-[var(--foreground)] p-4 rounded-xl rounded-tl-none border border-[var(--accent)]/20">
          <p>{reply}</p>
        </div>
      </div>
    </Card>
  );
}
