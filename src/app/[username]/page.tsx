import React from "react";
import { PublicProfile } from "@/components/profile/PublicProfile";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username: usernameRaw } = await params;
  const username = usernameRaw.replace(/^%40/, '').replace(/^@/, ''); // Strip @ if typed directly

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      bio: true,
      profilePicture: true,
      isVerified: true
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center">
      <PublicProfile user={user as any} />
    </div>
  );
}
