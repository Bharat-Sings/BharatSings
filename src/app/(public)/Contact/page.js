"use client";

import React, { useState } from "react";
import {
  Mail,
  Instagram,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Contact() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const emailAddress = "helloayush135@gmail.com";
  const instagramUrl = "https://www.instagram.com/bharatsings123";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#13131A] border border-gray-800/80 p-8 sm:p-10 text-center shadow-2xl">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-12 w-80 h-80 bg-[#7F56D9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1A2E] border border-[#3A2570]">
            <MessageSquare className="h-6 w-6 text-[#7F56D9]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Get in Touch
          </h1>

          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Have questions about our courses or need assistance? Reach out to us directly through any of the channels below.
          </p>
        </div>

        {/* DIRECT CONTACT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Email Card */}
          <div className="rounded-[20px] bg-[#13131A] border border-gray-800/80 p-6 space-y-4 hover:border-[#7F56D9]/50 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-xl bg-[#1C1A2E] border border-[#3A2570] text-[#7F56D9]">
                <Mail size={20} />
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#1C1C24] hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy
                  </>
                )}
              </button>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Email Us
              </h3>
              <a
                href={`mailto:${emailAddress}`}
                className="text-sm font-medium text-white hover:text-[#9E77ED] transition-colors break-all"
              >
                {emailAddress}
              </a>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="rounded-[20px] bg-[#13131A] border border-gray-800/80 p-6 space-y-4 hover:border-pink-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-xl bg-[#2A1A2E] border border-[#502570] text-pink-400">
                <Instagram size={20} />
              </span>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#1C1C24] hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
              >
                Visit <ExternalLink size={13} />
              </a>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Instagram
              </h3>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white hover:text-pink-400 transition-colors"
              >
                @bharatsings123
              </a>
            </div>
          </div>

        </div>

        {/* Quick Response Banner */}
        <div className="rounded-[20px] bg-[#13131A] border border-gray-800 p-4 flex items-center justify-center gap-3 text-center">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <p className="text-xs text-gray-400">
            We typically respond within <strong className="text-gray-200">24 hours</strong> on business days.
          </p>
        </div>

      </div>
    </div>
  );
}