"use client";

import React from "react";
import { UserPlus, Mail, Lock, FileText, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

function RegisterTrainer() {
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");

  const router = useRouter();
  const { login } = useAuth();

  const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_BASE}/api/v1/trainers/registerTrainer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: displayName,
          email,
          password,
          category,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      login(data.trainer, data.accessToken);

      router.push("/trainerdashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl">
        {/* --- TOP ICON HEADER --- */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#6366F1]/20">
          <UserPlus className="text-[#6366F1]" size={28} />
        </div>

        {/* --- HEADER TEXT --- */}
        <h2 className="text-center text-2xl font-bold text-white">Create Your Account</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join Bharat Sings and start your musical journey
        </p>

        {/* --- REGISTRATION FORM --- */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* 1. DISPLAY NAME INPUT */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Display Name</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/50">
              <UserPlus size={18} className="text-gray-500" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* 2. EMAIL INPUT */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Email</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/50">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* 3. PASSWORD INPUT */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Password</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/50">
              <Lock size={18} className="text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* 4. DESCRIPTION INPUT */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Description</label>
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/50">
              <FileText size={18} className="mt-0.5 text-gray-500" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your musical journey..."
                rows={3}
                className="w-full resize-none bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                maxLength={250}
              />
            </div>
          </div>

          {/* 5. CATEGORY INPUT */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Category</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/50">
              <Tag size={18} className="text-gray-500" />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Vocal Coach, Guitar Instructor"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#6366F1] py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-[#5356E2] focus:outline-none active:scale-[0.99]"
          >
            Register
          </button>
        </form>

        {/* --- FOOTER REDIRECT --- */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/Login" className="ml-1 font-medium text-[#6366F1] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterTrainer;
