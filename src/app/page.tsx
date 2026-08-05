"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Shield, Zap, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 flex flex-col items-center text-center px-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C5CE7]/20 blur-[120px] rounded-full -z-10" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
          >
            Ask Anything, <br className="hidden sm:block" />
            <span className="text-gradient">Know Everything.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-[var(--secondary)] mb-10 max-w-2xl"
          >
            The completely anonymous Q&A platform built for absolute transparency. Share your link and let the world ask.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">Get Started</Button>
            </Link>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">Learn More</Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[var(--card)]/50 border-y border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -5 }} className="bg-[var(--background)] p-8 rounded-3xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Identity Transparency</h3>
                <p className="text-[var(--secondary)]">Ask anonymously, but know that safety is our priority. We employ advanced moderation.</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-[var(--background)] p-8 rounded-3xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Replies</h3>
                <p className="text-[var(--secondary)]">Reply directly from your inbox and instantly share to your story.</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-[var(--background)] p-8 rounded-3xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Share Everywhere</h3>
                <p className="text-[var(--secondary)]">Beautifully crafted share cards that look perfect on Instagram, Snapchat, or Twitter.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
