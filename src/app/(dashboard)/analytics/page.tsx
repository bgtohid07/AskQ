"use client";
import React from "react";
import { Card } from "@/components/ui/Card";
import { Eye, MessageSquare, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-[var(--secondary)] mt-1">Track your profile views and engagement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--secondary)]">
            <Eye className="w-4 h-4" /> Views
          </div>
          <div className="text-3xl font-bold">1,245</div>
          <div className="text-sm text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </div>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--secondary)]">
            <MessageSquare className="w-4 h-4" /> Questions
          </div>
          <div className="text-3xl font-bold">84</div>
          <div className="text-sm text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% this week
          </div>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--secondary)]">
            <TrendingUp className="w-4 h-4" /> Engagement
          </div>
          <div className="text-3xl font-bold">12.5%</div>
          <div className="text-sm text-[var(--secondary)] flex items-center gap-1">
            vs 10.2% last week
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Activity (Last 7 Days)</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[40, 70, 30, 85, 50, 95, 60].map((height, i) => (
            <div key={i} className="w-full bg-[var(--accent)]/20 rounded-t-md relative group hover:bg-[var(--accent)] transition-colors" style={{ height: `${height}%` }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--card)] border border-[var(--border)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {height}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-[var(--secondary)]">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </Card>
    </div>
  );
}
