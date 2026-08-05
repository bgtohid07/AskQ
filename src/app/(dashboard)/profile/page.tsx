"use client";
import React from "react";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { QRCodeCard } from "@/components/profile/QRCodeCard";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-[var(--secondary)] mt-1">Update your personal details.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] glass">
          <ProfileEditor />
        </div>
        <div className="w-full lg:w-72 flex flex-col items-center">
          <QRCodeCard url="https://askq.app/johndoe" />
        </div>
      </div>
    </div>
  );
}
