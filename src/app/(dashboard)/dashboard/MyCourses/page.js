"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { 
  BookOpen, 
  User, 
  Globe, 
  Tag, 
  ArrowRight, 
  GraduationCap, 
  Sparkles,
  Search
} from "lucide-react";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, accessToken, loading } = useAuth();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;
  const router = useRouter();

  console.log(accessToken);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!user && !loading) {
      router.replace("/Login");
    }
  }, [user, loading, router]);

  // Fetch enrolled courses
  const getMyEnrollments = useCallback(async () => {
    if (!accessToken) return;
    try {
      setFetching(true);
      const response = await axios.get(
        `${API_BASE}/api/v1/enrollments/findEnrollmentsByUserId`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const fetchedData = response.data?.data?.enrollments || [];
      setEnrollments(fetchedData);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    } finally {
      setFetching(false);
    }
  }, [accessToken, API_BASE]);

  // Trigger fetch once auth is ready
  useEffect(() => {
    if (!loading && user) {
      getMyEnrollments();
    }
  }, [user, loading]);

  // Filter courses based on search query
  const filteredEnrollments = enrollments.filter((item) => {
    const course = item?.course || {};
    const title = course?.title?.toLowerCase() || "";
    const category = course?.category?.toLowerCase() || "";
    const trainer = course?.trainer?.name?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    
    return title.includes(q) || category.includes(q) || trainer.includes(q);
  });

  // Auth Loading state
  if (loading || (fetching && enrollments.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B10] text-gray-300">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-400 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B10] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
              My Enrolled Courses
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Access and manage all the learning programs you are enrolled in.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13131A] border border-gray-800 text-sm text-gray-200 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Content Section */}
        {filteredEnrollments.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl bg-[#13131A]/60 border border-dashed border-gray-800 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? "No courses found" : "No enrollments yet"}
            </h3>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              {searchQuery
                ? `We couldn't find any enrolled courses matching "${searchQuery}".`
                : "You haven't enrolled in any courses yet. Explore available programs to start learning today."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push("/dashboard/Courses")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Course Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const course = enrollment?.course || {};
              const courseId = course?.id || course?.id || enrollment?.id;
              
              // Extract details safely
              const trainerName = course?.trainer?.name || course?.trainer || "Instructor";
              const languageName = course?.language?.name || course?.language || "English";
              const category = course?.category || "General";
              const title = course?.title || "Untitled Course";

              return (
                <div
                  key={enrollment._id || courseId}
                  className="group relative flex flex-col justify-between rounded-2xl bg-[#13131A] border border-gray-800/80 hover:border-indigo-500/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                >
                  {/* Subtle Card Background Accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    {/* Top Tags */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Tag className="w-3 h-3" />
                        {category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded-full border border-gray-700/50">
                        <Globe className="w-3 h-3 text-gray-400" />
                        {languageName}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h2>

                    {/* Trainer Info */}
                    <div className="flex items-center gap-2 pt-1 text-sm text-gray-400">
                      <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-indigo-400 font-semibold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">
                        Instructor: <strong className="text-gray-200 font-medium">{trainerName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Footer & Action Button */}
                  <div className="pt-6 mt-6 border-t border-gray-800/80 relative z-10">
                    <Link
                      href={`/dashboard/MyCourses/${courseId}/ViewCourse`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/15 transition-all duration-200 active:scale-[0.98]"
                    >
                      <span>View Course</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}