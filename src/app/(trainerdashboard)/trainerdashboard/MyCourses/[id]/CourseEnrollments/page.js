"use client";

import React, { useState, useEffect } from "react";
import { useTrainerAuth } from "@/app/context/TrainerAuthContext";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import {
  Users,
  UserCheck,
  Globe,
  Receipt,
  AlertTriangle,
  Loader2,
  Mail,
  ChevronLeft,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function CourseEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { trainer, accessToken, loading: authLoading } = useTrainerAuth();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;
  const params = useParams();
  const courseId = params?.id;

  // Protect route
  useEffect(() => {
    if (!trainer && !authLoading) {
      router.replace("/trainerLogin");
    }
  }, [trainer, router, authLoading]);

  // Fetch enrollments
  useEffect(() => {
    const getEnrollments = async () => {
      if (!courseId || !accessToken) return;

      try {
        setLoadingData(true);
        setError(null);

        const response = await axios.get(
          `${API_BASE}/api/v1/enrollments/findEnrollmentsByCourseId`,
          {
            params: { course_id: courseId },
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const data = response.data?.data?.enrollments || response.data?.enrollments || [];
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError("Failed to load course enrollments. Please try again.");
      } finally {
        setLoadingData(false);
      }
    };

    if (!authLoading && trainer) {
      getEnrollments();
    }
  }, [trainer, authLoading, courseId, accessToken, API_BASE]);

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B10] text-gray-400">
        <Loader2 className="h-8 w-[#7F56D9] animate-spin mb-3" />
        <h1 className="text-sm font-medium tracking-wide">Loading course enrollments...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-3"
            >
              <ChevronLeft size={16} /> Back to dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7F56D9]/10 border border-[#7F56D9]/30 text-[#7F56D9]">
                <Users size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Course Enrollments</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage registered students and verify payment receipts
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#13131A] border border-gray-800 px-4 py-2.5 self-start sm:self-auto">
            <UserCheck size={18} className="text-[#7F56D9]" />
            <span className="text-xs text-gray-400">Total Enrolled:</span>
            <span className="text-sm font-semibold text-white">{enrollments.length}</span>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400 flex items-center gap-3">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Reporting Guidance Notice */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300/90 flex items-start sm:items-center gap-3">
          <ShieldAlert size={18} className="shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <span className="font-semibold text-amber-300">Verification Policy: </span>
            If you identify a fake or fraudulent payment screenshot, report it to our audit team immediately at{" "}
            <a
              href="mailto:helloayush135@gmail.com"
              className="font-semibold underline hover:text-white inline-flex items-center gap-1"
            >
              helloayush135@gmail.com <Mail size={12} />
            </a>
          </div>
        </div>

        {/* Enrollments Grid */}
        {enrollments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-800 bg-[#13131A] py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-500">
              <Users size={24} />
            </div>
            <h3 className="text-base font-medium text-white">No enrollments found yet</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Students who enroll in this course will appear here with their profile and payment proof.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enrollment, index) => {
              const studentName = enrollment?.user?.display_name || "Anonymous Student";
              const studentCountry = enrollment?.user?.country || "Not Specified";
              const screenshotUrl = enrollment?.screenshot?.file_path;

              return (
                <div
                  key={enrollment.id || index}
                  className="group rounded-2xl bg-[#13131A] border border-gray-800/80 hover:border-gray-700 p-5 transition-all duration-200 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-4">
                    {/* User Info Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1C1C24] border border-gray-700 flex items-center justify-center font-medium text-sm text-[#7F56D9]">
                          {studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{studentName}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                            <Globe size={13} className="text-gray-500" />
                            <span>{studentCountry}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 bg-[#1C1C24] px-2 py-1 rounded-md border border-gray-800">
                        #{enrollment.id ? String(enrollment.id).slice(-4) : index + 1}
                      </span>
                    </div>

                    {/* Screenshot Container */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Receipt size={14} className="text-[#7F56D9]" /> Payment Receipt
                        </span>
                        {screenshotUrl && (
                          <button
                            onClick={() => setSelectedImage(screenshotUrl)}
                            className="text-[11px] text-[#7F56D9] hover:underline flex items-center gap-1"
                          >
                            Expand <ExternalLink size={11} />
                          </button>
                        )}
                      </div>

                      <div className="relative h-48 w-full rounded-xl bg-[#1C1C24] border border-gray-800 overflow-hidden flex items-center justify-center group/img">
                        {screenshotUrl ? (
                          <>
                            <Image
                              src={screenshotUrl}
                              alt={`Payment screenshot for ${studentName}`}
                              fill
                              className="object-contain p-2 transition-transform duration-300 group-hover/img:scale-105"
                            />
                            <div
                              onClick={() => setSelectedImage(screenshotUrl)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                              <span className="text-xs font-medium bg-black/70 px-3 py-1.5 rounded-lg border border-white/20">
                                Click to Inspect
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 text-gray-500">
                            <Receipt size={28} className="mx-auto mb-1 opacity-40" />
                            <p className="text-xs">No screenshot provided</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Warning */}
                  <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Status: Enrolled</span>
                    <a
                      href={`mailto:helloayush135@gmail.com?subject=Fraudulent%20Receipt%20Report%20-%20Enrollment%20${enrollment.id}`}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <AlertTriangle size={12} /> Report Issue
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-[#13131A] rounded-2xl border border-gray-800 overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-800">
              <h4 className="text-xs font-medium text-gray-300">Payment Receipt Inspection</h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white text-xs bg-[#1C1C24] px-2.5 py-1 rounded-lg border border-gray-700"
              >
                Close (ESC)
              </button>
            </div>
            <div className="relative h-[70vh] w-full bg-[#0B0B10]">
              <Image
                src={selectedImage}
                alt="Enlarged payment screenshot"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}