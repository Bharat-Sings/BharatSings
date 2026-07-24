"use client";

import React from "react";
// Using lucide-react for UI icons
import { Mail, Lock, LogIn } from "lucide-react";

function Login() {
  // Individual field states for the login page
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login verification logic here
    console.log("Login submitted with:", { email, password, rememberMe });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4">
      {/* --- CARD CONTAINER --- */}
      <div className="w-full max-w-md rounded-[24px] bg-[#13131A] p-8 shadow-2xl text-center">
        
        {/* --- TOP AVATAR / ICON HEADER --- */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1A2E] border border-[#3A2570]">
          <LogIn className="h-6 w-6 text-[#7F56D9]" />
        </div>

        {/* --- HEADER TEXT --- */}
        <h2 className="text-2xl font-semibold text-white tracking-wide">
          Welcome Back
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Login to continue your musical journey
        </p>

        {/* --- LOGIN FORM --- */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">

          {/* 1. EMAIL INPUT */}
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

          {/* 2. PASSWORD INPUT */}
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

          {/* --- REMEMBER ME & FORGOT PASSWORD ACTIONS --- */}
          <div className="flex items-center justify-between pt-1 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-800 bg-[#1C1C24] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-xs text-gray-400">Remember me</span>
            </label>
            <a 
              href="/forgot-password" 
              className="text-xs font-medium text-[#7F56D9] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* --- LOGIN BUTTON --- */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#6366F1] py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-200 hover:bg-[#5356E2] active:scale-[0.99] focus:outline-none mt-6 shadow-lg shadow-indigo-600/20"
          >
            Login
          </button>
        </form>

        {/* --- FOOTER REDIRECT --- */}
        <p className="mt-8 text-xs text-gray-500">
          Don't have an account?{" "}
          <a href="/Register" className="text-[#6366F1] hover:underline font-medium ml-1">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;
