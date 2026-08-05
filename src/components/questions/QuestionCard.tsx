"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { MessageSquare, Trash2, Share2, CornerDownRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface QuestionCardProps {
  question: {
    id: string;
    content: string;
    createdAt: string | Date;
    isRead: boolean;
    senderName?: string;
    reply?: {
      content: string;
      createdAt: string | Date;
    } | null;
  };
  onReply?: (id: string, replyText: string) => void;
  onDelete?: (id: string) => void;
}

export function QuestionCard({ question, onReply, onDelete }: QuestionCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const senderName = question.senderName || "Unknown Sender";

  // Format date correctly: "5 August 2026 • 7:15 PM"
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);
      
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const datePart = date.toLocaleDateString('en-US', options);
      
      const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
      const timePart = date.toLocaleTimeString('en-US', timeOptions);
      
      return `${datePart} • ${timePart}`;
    } catch (e) {
      return String(dateString);
    }
  };

  const formattedDate = formatDate(question.createdAt);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if (onReply) {
        onReply(question.id, replyText);
      }
      setIsSubmitting(false);
      setShowReplyForm(false);
      setReplyText("");
      toast.success("Reply posted!");
    }, 400);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Question from ${senderName}`,
          text: `"${question.content}"`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`"${question.content}" - asked by ${senderName}`);
      toast.success("Question copied to clipboard!");
    }
  };

  return (
    <Card hoverEffect className="relative overflow-hidden group">
      {!question.isRead && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      
      <div className="mb-4">
        <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">From: {senderName}</h4>
        <p className="text-[var(--foreground)] text-lg leading-relaxed font-medium mt-2 mb-3">
          "{question.content}"
        </p>
        <p className="text-xs text-[var(--secondary)]">Sent: {formattedDate}</p>
      </div>

      {/* Existing Reply Display */}
      {question.reply && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex gap-2 items-start mt-4">
          <CornerDownRight className="w-4 h-4 text-[var(--accent)] mt-1 flex-shrink-0" />
          <div>
            <span className="text-xs font-semibold text-[var(--accent)] block">Your Reply:</span>
            <p className="text-sm text-[var(--foreground)] mt-0.5">{question.reply.content}</p>
            <p className="text-xs text-[var(--secondary)] mt-1">{formatDate(question.reply.createdAt)}</p>
          </div>
        </div>
      )}

      {/* Inline Reply Form */}
      {showReplyForm && !question.reply && (
        <div className="mb-4 pt-3 border-t border-[var(--border)]">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a public reply..."
            className="w-full h-20 bg-[var(--background)] border border-[var(--border)] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button size="sm" variant="ghost" onClick={() => setShowReplyForm(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" loading={isSubmitting} onClick={handleSendReply}>
              Post Reply
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
        {!question.reply ? (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="gap-2 w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4" /> Reply
          </Button>
        ) : (
          <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Replied
          </span>
        )}

        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="ghost" onClick={handleShare} className="px-2 text-[var(--secondary)]">
            <Share2 className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(question.id)}
              className="px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
