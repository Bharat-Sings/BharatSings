"use client";

import React from "react";
import { useTrainerAuth } from "@/app/context/TrainerAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TrainerDashboard() {
    const {  trainer, loading, logout: authLogout } = useTrainerAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !trainer) {
        router.push("/LoginTrainer");
        }
    }, [trainer, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
                <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
            </div>
        );
    }

    if (!trainer) {
        return null;
    }

    const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

    const logout = async () => {
        try {
        await axios.post(
            `${NEXT_PUBLIC_API_BASE}/api/v1/trainers/logout`,
            {},
            { withCredentials: true }
        );

        // Remove user and access token
        // from localStorage + AuthContext
        authLogout();

        // Redirect to login page
        router.push("/LoginTrainer");
        } catch (error) {
        console.log("Logout Error:", error);
        }
    };

    return (
        <div className="">
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
                Hi, {trainer.name}!
                </h1>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-4 shrink-0">
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
        </div>
    );
}