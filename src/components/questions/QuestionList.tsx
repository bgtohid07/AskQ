"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { Input } from "../ui/Input";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export function QuestionList() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  const fetchQuestions = useCallback(async () => {
    const activeUser = user.dbUser || user.firebaseUser;
    if (!activeUser) {
      setLoading(false);
      return;
    }

    const userIdentifier = activeUser.id || activeUser.firebaseUid || activeUser.username;

    try {
      const res = await fetch(`/api/questions?filter=${filter}`, {
        headers: {
          "x-user-id": userIdentifier,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  }, [user.dbUser, user.firebaseUser, filter]);

  useEffect(() => {
    fetchQuestions();
    
    // Auto-refresh inbox every 5 seconds to catch new incoming questions
    const interval = setInterval(fetchQuestions, 5000);
    return () => clearInterval(interval);
  }, [fetchQuestions]);

  const handleReply = async (id: string, replyText: string) => {
    const activeUser = user.dbUser || user.firebaseUser;
    const userIdentifier = activeUser?.id || activeUser?.firebaseUid || activeUser?.username;

    try {
      const res = await fetch(`/api/questions/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userIdentifier || "",
        },
        body: JSON.stringify({
          content: replyText,
          isPublic: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post reply");
      }

      toast.success("Reply posted!");
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.message || "Failed to post reply");
    }
  };

  const handleDelete = async (id: string) => {
    const activeUser = user.dbUser || user.firebaseUser;
    const userIdentifier = activeUser?.id || activeUser?.firebaseUid || activeUser?.username;

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": userIdentifier || "",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete question");
      }

      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete question");
    }
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
        {loading ? (
          <div className="text-center py-12 text-[var(--secondary)]">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading questions...</p>
          </div>
        ) : (
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
                <p>No questions in your inbox yet.</p>
                <p className="text-xs text-[var(--secondary)] mt-1">Share your profile link to receive questions!</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
