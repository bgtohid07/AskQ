"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Send, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface AskQuestionFormProps {
  receiverUsername?: string;
}

export function AskQuestionForm({ receiverUsername = "user" }: AskQuestionFormProps) {
  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: senderName.trim(),
          content: content.trim(),
          receiverUsername,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send question");
      }

      setSuccess(true);
      toast.success(`Question sent to @${receiverUsername}!`);
      
      // We don't clear the form if we show a success message, 
      // but we could offer to send another.
    } catch (err: any) {
      toast.error(err.message || "Failed to send question.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 glass shadow-xl text-center"
      >
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Sent Successfully!</h3>
        <p className="text-[var(--secondary)] mb-6">
          Your question has been sent to @{receiverUsername}.
        </p>
        <Button onClick={() => {
          setSuccess(false);
          setContent("");
        }}>
          Ask Another Question
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 glass shadow-xl"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-xl font-bold">Ask @{receiverUsername} a question</h3>
          <p className="text-sm text-[var(--secondary)] mt-1">
            They will see your name, but no other personal info is shared.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="senderName" className="block text-sm font-medium mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="senderName"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="John Doe"
            maxLength={50}
            required
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl p-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Question <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Ask @${receiverUsername} anything...`}
              required
              className="w-full h-32 bg-[var(--background)] border border-[var(--border)] rounded-xl p-3 text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              maxLength={500}
            />
            <span className="absolute bottom-3 right-3 text-xs text-[var(--secondary)] bg-[var(--background)]/80 px-1 rounded">
              {content.length}/500
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={!senderName.trim() || !content.trim()} loading={loading} className="gap-2 w-full sm:w-auto">
          <Send className="w-4 h-4" /> Send Question
        </Button>
      </div>
    </motion.form>
  );
}
