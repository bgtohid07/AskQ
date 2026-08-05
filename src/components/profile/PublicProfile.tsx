"use client";
import React from "react";
import { ProfileHeader } from "./ProfileHeader";
import { AskQuestionForm } from "../questions/AskQuestionForm";

interface PublicProfileProps {
  user: {
    name: string;
    username: string;
    bio: string | null;
    profilePicture: string | null;
    isVerified: boolean;
  };
}

export function PublicProfile({ user }: PublicProfileProps) {
  return (
    <div className="max-w-2xl mx-auto w-full pt-12 pb-24 px-4 flex flex-col gap-10">
      <ProfileHeader 
        name={user.name}
        username={user.username} 
        bio={user.bio || "Ask me a question! You'll only need to provide your name."} 
        isVerified={user.isVerified}
        profilePicture={user.profilePicture}
      />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00B894]/20 blur-3xl -z-10 rounded-[3rem]" />
        <AskQuestionForm receiverUsername={user.username} />
      </div>
    </div>
  );
}
