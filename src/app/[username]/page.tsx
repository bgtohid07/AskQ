import React from "react";
import { PublicProfile } from "@/components/profile/PublicProfile";
import prisma from "@/lib/prisma";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username: usernameRaw } = await params;
  const username = usernameRaw.replace(/^%40/, '').replace(/^@/, ''); // Strip @ if typed directly

  let user = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      bio: true,
      profilePicture: true,
      isVerified: true
    }
  });

  // Fallback if case mismatch or user created with slight variance
  if (!user) {
    user = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: 'insensitive' }
      },
      select: {
        name: true,
        username: true,
        bio: true,
        profilePicture: true,
        isVerified: true
      }
    });
  }

  // Fallback to display object if user profile is accessed via URL before DB sync completes
  const activeUser = user || {
    name: username.charAt(0).toUpperCase() + username.slice(1),
    username: username,
    bio: "Ask me a question! You'll only need to provide your name.",
    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    isVerified: false
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center">
      <PublicProfile user={activeUser} />
    </div>
  );
}
