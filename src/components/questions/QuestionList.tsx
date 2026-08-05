"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { Input } from "../ui/Input";
import toast from "react-hot-toast";

const INITIAL_QUESTIONS = [
  {
    id: "q1",
    content: "What inspired you to build AskQ and what features are coming next?",
    createdAt: new Date().toISOString(),
    isRead: false,
    senderName: "Alex Rivera",
    reply: null,
  },
  {
    id: "q2",
    content: "If you could travel anywhere right now, which country would you pick?",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    senderName: "Sophia Chen",
    reply: {
      content: "Definitely Japan! Would love to explore Kyoto during cherry blossom season.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  },
];

export function QuestionList() {
  const [questions, setQuestions] = useState<any[]>(INITIAL_QUESTIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  // Load dynamically saved questions from localStorage (for guest submit simulation / api integration)
  useEffect(() => {
    // In a real app this would fetch from /api/questions
    try {
      const saved = localStorage.getItem("askq_questions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions((prev) => {
            const ids = new Set(parsed.map((q: any) => q.id));
            const filteredPrev = prev.filter((q) => !ids.has(q.id));
            return [...parsed, ...filteredPrev];
          });
        }
      }
    } catch (e) {}
  }, []);

  const handleReply = (id: string, replyText: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              isRead: true,
              reply: { content: replyText, createdAt: new Date().toISOString() },
            }
          : q
      )
    );
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    try {
      const saved = JSON.parse(localStorage.getItem("askq_questions") || "[]");
      const updated = saved.filter((q: any) => q.id !== id);
      localStorage.setItem("askq_questions", JSON.stringify(updated));
    } catch (e) {}
    toast.success("Question deleted");
  };

  const filtered = questions.filter((q) => {
    if (filter === "unread" && q.isRead) return false;
    if (search && !q.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-64">
          <Input
            variant="search"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)]">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[var(--card)] shadow text-[var(--foreground)]"
                : "text-[var(--secondary)]"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
              filter === "unread"
                ? "bg-[var(--card)] shadow text-[var(--foreground)]"
                : "text-[var(--secondary)]"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread ({questions.filter((q) => !q.isRead).length})
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <QuestionCard question={q} onReply={handleReply} onDelete={handleDelete} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-[var(--secondary)]"
            >
              <div className="text-6xl mb-4">📭</div>
              <p>No questions found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
