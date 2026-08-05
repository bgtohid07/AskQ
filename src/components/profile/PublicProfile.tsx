"use client";
import React from "react";
import { ProfileHeader } from "./ProfileHeader";
import { AskQuestionForm } from "../questions/AskQuestionForm";

interface PublicProfileProps {
  username: string;
}

export function PublicProfile({ username }: PublicProfileProps) {
  // In a real app, you'd fetch the user's name/bio here based on the username.
  // We'll pass the username down to the form.
  
  return (
    <div className="max-w-2xl mx-auto w-full pt-12 pb-24 px-4 flex flex-col gap-10">
      <ProfileHeader 
        name={username} // Using username as name fallback for now
        username={username} 
        bio="Ask me a question! You'll only need to provide your name." 
        isVerified 
      />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00B894]/20 blur-3xl -z-10 rounded-[3rem]" />
        <AskQuestionForm receiverUsername={username} />
      </div>
    </div>
  );
}
