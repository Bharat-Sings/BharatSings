"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function RegisterUserOrTrainer() {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-50 to-orange-100 p-6 font-sans">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 text-center tracking-wide">
                Embark on Your Musical Journey
            </h1>

            {/* Container for Cards */}
            <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full justify-center items-stretch">
                
                {/* User Card */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-left transition-transform hover:scale-[1.01]">
                    {/* User Icon Placeholder */}
                    <div className="w-32 h-32 flex items-center justify-center mb-6">
                        <svg className="w-full h-full text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>

                    <div className="w-full flex-1">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">User:</h2>
                        <ul className="space-y-3 text-slate-700 text-sm md:text-base list-disc pl-5 mb-8">
                            <li>Upload songs and music and get recognized</li>
                            <li>Sell songs and music on marketplace</li>
                            <li>Learn through courses</li>
                        </ul>
                    </div>

                    <button 
                        onClick={() => router.push("/Register")}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors text-center"
                    >
                        Register as User
                    </button>
                </div>

                {/* Trainer Card */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-left transition-transform hover:scale-[1.01]">
                    {/* Trainer Icon Placeholder */}
                    <div className="w-32 h-32 flex items-center justify-center mb-6">
                        <svg className="w-full h-full text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                    </div>

                    <div className="w-full flex-1">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Trainer:</h2>
                        <ul className="space-y-3 text-slate-700 text-sm md:text-base list-disc pl-5 mb-8">
                            <li>Create song/music courses</li>
                            <li>Conduct live sessions and upload recorded classes</li>
                            <li>Earn money through sharing your talent</li>
                        </ul>
                    </div>

                    <button 
                        onClick={() => router.push("/RegisterTrainer")}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md transition-colors text-center"
                    >
                        Register as Trainer
                    </button>
                </div>

            </div>
        </div>
    );
}
