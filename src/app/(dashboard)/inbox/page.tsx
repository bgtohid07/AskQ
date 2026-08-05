"use client";
import React from "react";
import { QuestionList } from "@/components/questions/QuestionList";

export default function InboxPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Inbox</h1>
        <p className="text-[var(--secondary)] mt-1">Read and reply to your anonymous questions.</p>
      </div>
      <QuestionList />
    </div>
  );
}
