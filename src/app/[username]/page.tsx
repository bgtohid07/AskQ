"use client";
import React from "react";
import { useParams } from "next/navigation";
import { PublicProfile } from "@/components/profile/PublicProfile";

export default function UserProfilePage() {
  const params = useParams();
  const usernameRaw = params.username as string;
  const username = usernameRaw.replace(/^%40/, '').replace(/^@/, ''); // Strip @ if typed directly

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center">
      <PublicProfile username={username} />
    </div>
  );
}
