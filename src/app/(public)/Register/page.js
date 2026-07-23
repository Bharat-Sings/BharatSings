"use client";

import React from "react";
// Using lucide-react for clean, modern interface icons
import { User, Mail, Lock, UserPlus } from "lucide-react";

function Register() {
  // Individual field states as requested
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here using individual values
    console.log("Form submitted with:", { fullName, email, password, confirmPassword });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4">
      {/* --- CARD CONTAINER --- */}
      <div className="w-full max-w-md rounded-[24px] bg-[#13131A] p-8 shadow-2xl text-center">
        
        {/* --- TOP AVATAR / ICON HEADER --- */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1A2E] border border-[#3A2570]">
          <UserPlus className="h-6 w-6 text-[#7F56D9]" />
        </div>

        {/* --- HEADER TEXT --- */}
        <h2 className="text-2xl font-semibold text-white tracking-wide">
          Create Your Account
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Join Bharat Sings and start your musical journey
        </p>

        {/* --- REGISTRATION FORM --- */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* 1. FULL NAME INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <User size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 2. EMAIL INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 3. PASSWORD INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* 4. CONFIRM PASSWORD INPUT */}
          <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock size={18} />
            </span>
            <div className="pl-8 flex flex-col">
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                required
              />
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#6366F1] py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-200 hover:bg-[#5356E2] active:scale-[0.99] focus:outline-none mt-6 shadow-lg shadow-indigo-600/20"
          >
            Register
          </button>
        </form>

        {/* --- FOOTER REDIRECT --- */}
        <p className="mt-8 text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#6366F1] hover:underline font-medium ml-1">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;
