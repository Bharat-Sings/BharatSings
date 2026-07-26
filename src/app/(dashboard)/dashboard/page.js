"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" />
      <path d="M17 11a1 1 0 10-2 0 3 3 0 01-6 0 1 1 0 10-2 0 5 5 0 004 4.9V18H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.1A5 5 0 0017 11z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white/90" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
    </svg>
  );
}

// Shared glossy 3D pill-button style used for both actions.
function GlossyButton({ onClick, gradient, icon, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative inline-flex items-center gap-2.5
        px-7 py-3.5 rounded-2xl
        font-bold text-sm tracking-wide text-white
        cursor-pointer select-none
        transition-transform duration-150
        active:translate-y-0.5 active:shadow-inner
        ${gradient}
        ${className}
      `}
      style={{
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.35) inset, 0 -3px 6px rgba(0,0,0,0.25) inset, 0 10px 20px -6px rgba(0,0,0,0.45)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-x-1 top-1 h-1/3 rounded-xl bg-white/25 blur-[2px]"
        aria-hidden="true"
      />
      <span className="relative flex items-center gap-2.5">
        {icon}
        {children}
      </span>
    </button>
  );
}

function Dashboard() {
  const { user, loading, logout: authLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const NEXT_PUBLIC_API_BASE = process.env.BACKEND_URI;

  const logout = async () => {
    try {
      await axios.post(
        `${NEXT_PUBLIC_API_BASE}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );

      // Remove user and access token
      // from localStorage + AuthContext
      authLogout();

      // Redirect to login page
      router.push("/Login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-4 sm:p-8">
      <div
        className="
          relative w-full max-w-5xl overflow-hidden
          rounded-3xl border border-black/5
          bg-[#F4F5F7]
        "
      >
        {/* Dark vignette on the left, fading into the light panel */}
        <div
          className="absolute inset-y-0 left-0 w-full sm:w-2/3"
          style={{
            background:
              "radial-gradient(130% 160% at 0% 50%, #05040A 0%, #100C1C 45%, rgba(16,12,28,0) 85%)",
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 px-6 sm:px-10 py-10 sm:py-12">
          {/* Left: avatar + greeting */}
          <div className="flex items-center gap-5 min-w-0">
            <div
              className="
                w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full
                flex items-center justify-center
                bg-[#15121F]
              "
              style={{
                padding: 3,
                backgroundImage:
                  "linear-gradient(#15121F, #15121F), conic-gradient(from 180deg, #E9C77B, #B9862F, #E9C77B, #F5E1A4, #E9C77B)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              <UserIcon />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Hi, {user.display_name}!
            </h1>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-4 shrink-0">
            <GlossyButton
              onClick={() => router.push("/dashboard/SongUpload")}
              gradient="bg-gradient-to-br from-[#7A3FE0] via-[#6B4CDB] to-[#3F8FE0]"
              icon={<MicIcon />}
            >
              UPLOAD SONG
            </GlossyButton>

            <GlossyButton
              onClick={logout}
              gradient="bg-gradient-to-br from-[#3A3540] via-[#2A2630] to-[#171319]"
              icon={<LogoutIcon />}
            >
              LOGOUT
            </GlossyButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;