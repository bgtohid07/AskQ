"use client";
import React from "react";
import { useParams } from "next/navigation";
import { ReplyCard } from "@/components/questions/ReplyCard";
import { ShareReplyCard } from "@/components/questions/ShareReplyCard";

export default function PublicQuestionPage() {
  const params = useParams();
  // const questionId = params.questionId;
  
  const dummyData = {
    question: "What is your favorite book and why?",
    reply: "I really love 'The Alchemist'. It taught me to follow my dreams and listen to my heart.",
    username: "johndoe",
    avatarUrl: null
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-center font-bold text-xl mb-8">AskQ Public Reply</h1>
        
        <div className="mb-12">
          <ShareReplyCard 
            question={dummyData.question}
            reply={dummyData.reply}
            username={dummyData.username}
          />
        </div>

        <p className="text-center text-[var(--secondary)] text-sm mb-4">Want to ask a question too?</p>
        <a href={`/${dummyData.username}`} className="block w-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white text-center py-3 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity">
          Ask @{dummyData.username} a Question
        </a>
      </div>
    </div>
  );
}
