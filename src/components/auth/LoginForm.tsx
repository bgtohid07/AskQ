"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/inbox");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      <div className="flex justify-end">
        <Link href="/signup" className="text-sm text-[var(--accent)] hover:underline">
          Need an account?
        </Link>
      </div>
      <Button type="submit" className="w-full mt-2" loading={loading}>
        Sign In
      </Button>
    </form>
  );
}
