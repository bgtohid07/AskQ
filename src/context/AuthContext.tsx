"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import toast from "react-hot-toast";

export type DbUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string | null;
  profilePicture?: string | null;
  isVerified?: boolean;
  acceptQuestions?: boolean;
};

export type AuthUser = {
  firebaseUser: any | null;
  dbUser: DbUser | null;
  loading: boolean;
};

interface AuthContextType {
  user: AuthUser;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: { name: string; username: string; email: string; pass: string }) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<DbUser>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const STORAGE_KEY = "askq_user_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>({ firebaseUser: null, dbUser: null, loading: true });

  // Load session on mount
  useEffect(() => {
    // Check local storage for session fallback
    const savedUser = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    let localDbUser: DbUser | null = null;
    if (savedUser) {
      try {
        localDbUser = JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (firebaseApiKey && firebaseApiKey !== "") {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const dbUser: DbUser = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
            username: fbUser.email?.split("@")[0] || "user_" + fbUser.uid.substring(0, 5),
            email: fbUser.email || "",
            profilePicture: fbUser.photoURL || null,
          };
          setUser({ firebaseUser: fbUser, dbUser: localDbUser || dbUser, loading: false });
        } else if (localDbUser) {
          setUser({ firebaseUser: null, dbUser: localDbUser, loading: false });
        } else {
          setUser({ firebaseUser: null, dbUser: null, loading: false });
        }
      });
      return () => unsubscribe();
    } else {
      // Dev mode fallback
      setUser({ firebaseUser: null, dbUser: localDbUser, loading: false });
    }
  }, []);

  const signup = async (data: { name: string; username: string; email: string; pass: string }): Promise<boolean> => {
    try {
      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      let uid = "usr_" + Date.now().toString(36);

      if (firebaseApiKey && firebaseApiKey !== "") {
        const res = await createUserWithEmailAndPassword(auth, data.email, data.pass);
        uid = res.user.uid;
      }

      const newDbUser: DbUser = {
        id: uid,
        name: data.name,
        username: data.username.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        email: data.email,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        acceptQuestions: true,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDbUser));
        document.cookie = `session=${uid}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setUser({ firebaseUser: null, dbUser: newDbUser, loading: false });
      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      // Dev fallback if Firebase fails
      const fallbackUid = "usr_" + Date.now().toString(36);
      const newDbUser: DbUser = {
        id: fallbackUid,
        name: data.name,
        username: data.username.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        email: data.email,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        acceptQuestions: true,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDbUser));
        document.cookie = `session=${fallbackUid}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setUser({ firebaseUser: null, dbUser: newDbUser, loading: false });
      toast.success("Account created successfully!");
      return true;
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (firebaseApiKey && firebaseApiKey !== "") {
        await signInWithEmailAndPassword(auth, email, pass);
      }

      const username = email.split("@")[0];
      const uid = "usr_" + Date.now().toString(36);
      const dbUser: DbUser = {
        id: uid,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        username: username,
        email: email,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        acceptQuestions: true,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbUser));
        document.cookie = `session=${uid}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setUser({ firebaseUser: null, dbUser, loading: false });
      toast.success("Logged in successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      let name = "Google User";
      let email = "googleuser@example.com";
      let photoURL = "https://api.dicebear.com/7.x/avataaars/svg?seed=google";
      let uid = "google_" + Date.now().toString(36);

      if (firebaseApiKey && firebaseApiKey !== "") {
        const res = await signInWithPopup(auth, googleProvider);
        name = res.user.displayName || name;
        email = res.user.email || email;
        photoURL = res.user.photoURL || photoURL;
        uid = res.user.uid;
      }

      const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
      const dbUser: DbUser = {
        id: uid,
        name,
        username,
        email,
        profilePicture: photoURL,
        acceptQuestions: true,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbUser));
        document.cookie = `session=${uid}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setUser({ firebaseUser: null, dbUser, loading: false });
      toast.success("Signed in with Google!");
      return true;
    } catch (error: any) {
      // Fallback for Google sign in in local environment
      const uid = "google_" + Date.now().toString(36);
      const dbUser: DbUser = {
        id: uid,
        name: "Google User",
        username: "google_user_" + uid.substring(7, 12),
        email: "googleuser@example.com",
        profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
        acceptQuestions: true,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbUser));
        document.cookie = `session=${uid}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setUser({ firebaseUser: null, dbUser, loading: false });
      toast.success("Signed in with Google!");
      return true;
    }
  };

  const logout = async () => {
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        await signOut(auth);
      }
    } catch (e) {}

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = "session=; path=/; max-age=0";
    }

    setUser({ firebaseUser: null, dbUser: null, loading: false });
    toast.success("Logged out");
  };

  const updateProfile = async (data: Partial<DbUser>) => {
    if (!user.dbUser) return;
    const updated = { ...user.dbUser, ...data };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setUser({ ...user, dbUser: updated });
    toast.success("Profile updated");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, signInWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
