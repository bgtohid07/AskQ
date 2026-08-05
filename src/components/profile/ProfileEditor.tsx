"use client";
import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Camera } from "lucide-react";

export function ProfileEditor() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 rounded-full bg-[var(--border)] flex items-center justify-center overflow-hidden group cursor-pointer">
          <span className="text-3xl">👤</span>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="text-sm text-[var(--accent)] cursor-pointer hover:underline">Change Picture</span>
      </div>

      <div className="flex flex-col gap-4">
        <Input label="Name" defaultValue="John Doe" />
        <Input label="Username" defaultValue="johndoe" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--secondary)]">Bio</label>
          <textarea 
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] h-24 resize-none"
            defaultValue="Ask me anything anonymously!"
          />
        </div>
      </div>
      
      <Button type="submit" loading={loading}>Save Changes</Button>
    </form>
  );
}
