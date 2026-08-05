"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [accepting, setAccepting] = useState(true);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--secondary)] mt-1">Manage your account preferences.</p>
      </div>

      <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] glass flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Accepting Questions</h3>
            <p className="text-sm text-[var(--secondary)]">Allow users to send you anonymous messages.</p>
          </div>
          <button 
            onClick={() => setAccepting(!accepting)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${accepting ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${accepting ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        
        <div className="border-t border-[var(--border)] pt-6">
          <h3 className="font-semibold text-lg mb-4">Blocked Users</h3>
          <p className="text-sm text-[var(--secondary)] mb-4">You have 0 blocked users.</p>
          <Button variant="secondary" size="sm">Manage Blocked Users</Button>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <h3 className="font-semibold text-lg text-red-500 mb-2">Danger Zone</h3>
          <p className="text-sm text-[var(--secondary)] mb-4">Permanently delete your account and all data.</p>
          <Button variant="danger" size="sm">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
