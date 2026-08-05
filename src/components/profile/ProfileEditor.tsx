"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Camera, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import Image from "next/image";

export function ProfileEditor() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  // Initialize state when user data loads
  useEffect(() => {
    if (user.dbUser) {
      setName(user.dbUser.name || "");
      setUsername(user.dbUser.username || "");
      setBio(user.dbUser.bio || "");
      setProfilePicture(user.dbUser.profilePicture || null);
    }
  }, [user.dbUser]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setProfilePicture(objectUrl);

    // Upload immediately
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // We have the URL, now save it to the DB directly so it persists
      await updateProfileInDb({ profilePicture: data.url });
      setProfilePicture(data.url);
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
      // Revert preview
      setProfilePicture(user.dbUser?.profilePicture || null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setProfilePicture(null);
    setUploading(true);
    try {
      await updateProfileInDb({ profilePicture: null });
      toast.success("Profile picture removed");
    } catch (err: any) {
      toast.error("Failed to remove image");
      setProfilePicture(user.dbUser?.profilePicture || null);
    } finally {
      setUploading(false);
    }
  };

  const updateProfileInDb = async (data: any) => {
    const activeUser = user.dbUser || user.firebaseUser;
    if (!activeUser?.username) return;

    const res = await fetch(`/api/users/${activeUser.username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update profile");
    }
    
    await updateProfile(data); // Refresh the context so Avatars update instantly
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileInDb({ name, username, bio });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user.dbUser) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <div className="flex flex-col items-center gap-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp, image/jpg" 
          className="hidden" 
        />
        
        <div 
          onClick={handleImageClick}
          className={`relative w-28 h-28 rounded-full bg-[var(--border)] flex items-center justify-center overflow-hidden group cursor-pointer border-4 border-transparent hover:border-[var(--accent)] transition-all ${uploading ? 'opacity-50' : ''}`}
        >
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-[var(--secondary)]">👤</span>
          )}
          
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs font-medium">Change</span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button 
            type="button" 
            onClick={handleImageClick}
            disabled={uploading}
            className="text-sm text-[var(--accent)] hover:underline font-medium disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload New"}
          </button>
          
          {profilePicture && (
            <>
              <div className="w-1 h-1 bg-[var(--border)] rounded-full"></div>
              <button 
                type="button" 
                onClick={handleRemoveImage}
                disabled={uploading}
                className="text-sm text-red-500 hover:underline font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Input 
          label="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <Input 
          label="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          required 
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--secondary)]">Bio</label>
          <textarea 
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] h-28 resize-none transition-all shadow-sm"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself..."
            maxLength={160}
          />
          <span className="text-xs text-[var(--secondary)] text-right">{bio.length}/160</span>
        </div>
      </div>
      
      <Button type="submit" loading={loading} className="gap-2 mt-2">
        <CheckCircle2 className="w-4 h-4" /> Save Changes
      </Button>
    </form>
  );
}
