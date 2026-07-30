"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  BookOpen,
  User,
  Globe,
  Tag,
  IndianRupee,
  Languages,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Details() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;
  
  // Correctly invoke useParams hook
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;

  const getCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Pass query parameters correctly as an object
      const res = await axios.get(`${API_BASE}/api/v1/courses/findCourseById`, {
        params: { course_id: courseId },
      });

      const courseData = res.data?.data?.course;
      if (courseData) {
        setCourse(courseData);
      } else {
        setError("Course details could not be found.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load course details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [API_BASE, courseId]);

  useEffect(() => {
    if (courseId) {
      getCourseDetails();
    }
  }, [courseId, getCourseDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B10] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#7F56D9] mb-3" />
        <p className="text-sm font-medium">Fetching course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#0B0B10] flex flex-col items-center justify-center p-4">
        <div className="bg-[#13131A] border border-gray-800 rounded-2xl p-8 max-w-md text-center space-y-4">
          <p className="text-red-400 text-sm">{error || "Course not found"}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#7F56D9] px-4 py-2.5 rounded-xl hover:bg-[#6C47C2] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#13131A] border border-gray-800/80 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#7F56D9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#7F56D9]/15 text-[#9E77ED] border border-[#7F56D9]/30">
              <Tag size={12} /> {course.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
              <Languages size={12} /> {course.language?.name || "English"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            {course.title}
          </h1>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Course Fee:</span>
              <span className="text-2xl font-bold text-emerald-400 flex items-center">
                <IndianRupee size={20} />
                {course.price?.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-[#7F56D9]" /> Verified Course Content
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT: About Course Specs */}
          <div className="md:col-span-2 rounded-[24px] bg-[#13131A] border border-gray-800/80 p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
              <BookOpen size={18} className="text-[#7F56D9]" />
              <h2 className="text-base font-semibold text-white tracking-wide uppercase">
                Course Highlights
              </h2>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Structured video modules for comprehensive learning.</span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Taught in <strong>{course.language?.name || "English"}</strong> for optimal comprehension.</span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct mentorship from an industry experienced trainer.</span>
              </li>
            </ul>

            <div className="rounded-xl bg-[#1C1C24] p-4 border border-gray-800 flex items-center gap-3">
              <Sparkles className="text-amber-400 shrink-0" size={20} />
              <p className="text-xs text-gray-400 leading-normal">
                Full lifetime access once enrolled. Stream modules on desktop or mobile seamlessly.
              </p>
            </div>
          </div>

          {/* RIGHT: About the Trainer */}
          <div className="rounded-[24px] bg-[#13131A] border border-gray-800/80 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
              <User size={18} className="text-[#7F56D9]" />
              <h2 className="text-base font-semibold text-white tracking-wide uppercase">
                About Trainer
              </h2>
            </div>

            <div className="space-y-4">
              {/* Trainer Name */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#1C1A2E] border border-[#3A2570] flex items-center justify-center font-bold text-[#7F56D9]">
                  {course.trainer?.name ? course.trainer.name[0].toUpperCase() : "T"}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {course.trainer?.name || "N/A"}
                  </h3>
                  <span className="text-[11px] text-gray-400">Instructor</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                {/* Category */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C1C24] border border-gray-800">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Tag size={13} /> Specialization
                  </span>
                  <span className="text-white font-medium">
                    {course.trainer?.category || "N/A"}
                  </span>
                </div>

                {/* Country */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C1C24] border border-gray-800">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Globe size={13} /> Location
                  </span>
                  <span className="text-white font-medium">
                    {course.trainer?.country || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}