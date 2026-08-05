"use client";
import React from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Share2, QrCode, CheckCircle } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  bio?: string | null;
  profilePicture?: string | null;
  isVerified?: boolean;
  onShare?: () => void;
  onShowQR?: () => void;
}

export function ProfileHeader({ name, username, bio, profilePicture, isVerified, onShare, onShowQR }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative">
        <Avatar src={profilePicture} initials={name.charAt(0)} size="xl" isVerified={isVerified} />
        {isVerified && (
          <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 border-2 border-[var(--background)]">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-[var(--secondary)] font-medium">@{username}</p>
      </div>
      
      {bio && <p className="max-w-md text-[var(--foreground)]">{bio}</p>}
      
      <div className="flex gap-3 mt-4">
        <Button variant="primary" onClick={onShare} className="gap-2 rounded-full px-6">
          <Share2 className="w-4 h-4" /> Share Profile
        </Button>
        <Button variant="secondary" onClick={onShowQR} className="gap-2 rounded-full px-6">
          <QrCode className="w-4 h-4" /> QR Code
        </Button>
      </div>
    </div>
  );
}
