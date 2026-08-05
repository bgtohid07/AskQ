"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Mail, Lock, User, AtSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      const success = await signup({ name, username, email, pass: password });
      if (success) {
        router.push("/inbox");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User className="w-4 h-4 text-[var(--secondary)]" />}
        required
      />
      <Input
        label="Username"
        type="text"
        placeholder="johndoe"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={<AtSign className="w-4 h-4 text-[var(--secondary)]" />}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4 text-[var(--secondary)]" />}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4 text-[var(--secondary)]" />}
        required
      />
      <Button type="submit" className="w-full mt-2" loading={loading}>
        Create Account
      </Button>
    </form>
  );
}
