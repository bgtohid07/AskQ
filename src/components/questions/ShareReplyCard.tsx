"use client";
import React, { useRef } from "react";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";
// In a real app we'd use html-to-image to download this ref
// import * as htmlToImage from 'html-to-image';

interface ShareReplyCardProps {
  question: string;
  reply: string;
  username: string;
}

export function ShareReplyCard({ question, reply, username }: ShareReplyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    alert("Downloading image functionality would go here using html-to-image");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        ref={cardRef}
        className="w-full max-w-sm aspect-[4/5] bg-gradient-to-br from-[#6C5CE7] to-[#00B894] p-6 rounded-3xl shadow-2xl flex flex-col justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 w-full bg-white/95 dark:bg-black/95 backdrop-blur rounded-2xl p-6 shadow-lg mb-4">
          <p className="text-sm font-bold text-[var(--secondary)] mb-2 uppercase">Someone Asked</p>
          <p className="text-lg font-medium text-black dark:text-white">"{question}"</p>
        </div>
        
        <div className="relative z-10 w-full pl-6 border-l-4 border-white/50">
          <p className="text-white text-xl font-medium drop-shadow-md">"{reply}"</p>
        </div>
        
        <div className="absolute bottom-6 right-6 text-white/50 font-bold tracking-widest text-sm z-10">
          @{username} • AskQ
        </div>
      </div>
      
      <Button onClick={handleDownload} className="gap-2">
        <Download className="w-4 h-4" /> Save to Photos
      </Button>
    </div>
  );
}
