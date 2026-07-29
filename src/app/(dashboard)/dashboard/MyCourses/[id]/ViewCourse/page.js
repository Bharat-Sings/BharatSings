"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import {
  Play,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Search,
  Sparkles,
  Film,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Clock,
  Layers
} from "lucide-react";

export default function ViewCourse() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedVideos, setCompletedVideos] = useState(new Set());

  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

  // Auth Protection
  useEffect(() => {
    if (!user && !loading) {
      router.replace("/Login");
    }
  }, [user, loading, router]);

  // Fetch Videos
  const getVideos = useCallback(async () => {
    if (!courseId) return;
    try {
      setFetching(true);
      const response = await axios.get(
        `${API_BASE}/api/v1/videos/findVideosByCourseId`,
        {
          params: {
            course_id: courseId,
          },
        }
      );

      const videoList = response.data?.data?.videos || [];
      setVideos(videoList);

      // Auto-select the first lesson
      if (videoList.length > 0) {
        setActiveVideo(videoList[0]);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setFetching(false);
    }
  }, [courseId, API_BASE]);

  useEffect(() => {
    if (!loading && user) {
      getVideos();
    }
  }, [user, loading, getVideos]);

  // Filter lessons by search term
  const filteredVideos = useMemo(() => {
    return videos.filter((video) =>
      (video?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [videos, searchQuery]);

  // Toggle lesson completion
  const toggleCompletion = (videoId, e) => {
    e.stopPropagation();
    setCompletedVideos((prev) => {
      const updated = new Set(prev);
      if (updated.has(videoId)) {
        updated.delete(videoId);
      } else {
        updated.add(videoId);
      }
      return updated;
    });
  };

  // Next & Previous Lesson Navigation
  const currentIndex = useMemo(() => {
    if (!activeVideo) return -1;
    return videos.findIndex((v) => (v._id || v.id) === (activeVideo._id || activeVideo.id));
  }, [videos, activeVideo]);

  const handleNextLesson = () => {
    if (currentIndex >= 0 && currentIndex < videos.length - 1) {
      setActiveVideo(videos[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setActiveVideo(videos[currentIndex - 1]);
    }
  };

  // Calculate percentage complete
  const progressPercent = useMemo(() => {
    if (videos.length === 0) return 0;
    return Math.round((completedVideos.size / videos.length) * 100);
  }, [videos, completedVideos]);

  // Loading state
  if (loading || fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B10] text-gray-300">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-400 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-400">Loading course player...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B10] text-gray-100 flex flex-col">
      
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0B0B10]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-900/80 hover:bg-gray-800 px-3 py-2 rounded-xl border border-gray-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="hidden sm:block h-5 w-[1px] bg-gray-800" />

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Course Viewer
                </span>
              </div>
              <h1 className="text-base font-semibold text-white truncate max-w-md mt-0.5">
                {activeVideo?.name || "Course Lessons"}
              </h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-3 bg-[#13131A] px-4 py-2 rounded-xl border border-gray-800/80">
            <div className="text-right">
              <p className="text-[11px] font-medium text-gray-400">Course Progress</p>
              <p className="text-xs font-bold text-indigo-400">{progressPercent}% Completed</p>
            </div>
            <div className="w-28 bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {videos.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <Film className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Lessons Found</h2>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            There are currently no video lessons published for this course. Please check back later.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        /* Video Player + Playlist Grid */
        <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video Section (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-5">
            
            {/* Player Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800/80 shadow-2xl group">
              {activeVideo?.file_path ? (
                <video
                  key={activeVideo._id || activeVideo.id || activeVideo.file_path}
                  src={activeVideo.file_path}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  autoPlay={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Select a lesson to begin watching
                </div>
              )}
            </div>

            {/* Video Meta & Controls */}
            <div className="bg-[#13131A] border border-gray-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Lesson {currentIndex + 1} of {videos.length}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {activeVideo?.name || "Untitled Lesson"}
                  </h2>
                </div>

                {/* Prev / Next Action Controls */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={handlePrevLesson}
                    disabled={currentIndex <= 0}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:hover:bg-gray-800/80 disabled:cursor-not-allowed transition-all border border-gray-700/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={handleNextLesson}
                    disabled={currentIndex >= videos.length - 1}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description Placeholder / Additional Info */}
              <div className="pt-2 text-sm text-gray-400 leading-relaxed">
                <p>
                  Welcome to this lesson. Make sure to watch through to completion and test your understanding of the core concepts covered.
                </p>
              </div>
            </div>
          </div>

          {/* Lessons Sidebar (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col bg-[#13131A] border border-gray-800/80 rounded-2xl overflow-hidden h-[600px] lg:h-auto">
            
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800/80 space-y-3 bg-[#13131A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">Course Content</h3>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700/50">
                  {videos.length} {videos.length === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>

              {/* Search Bar inside Sidebar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0B10] border border-gray-800 text-xs text-gray-200 pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500/60 transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Scrollable Playlist */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-10 px-4 text-gray-500 text-xs">
                  No matching lessons found.
                </div>
              ) : (
                filteredVideos.map((video, index) => {
                  const videoId = video._id || video.id || index;
                  const isActive = (activeVideo?._id || activeVideo?.id) === videoId;
                  const isCompleted = completedVideos.has(videoId);

                  return (
                    <div
                      key={videoId}
                      onClick={() => setActiveVideo(video)}
                      className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                          : "bg-transparent hover:bg-gray-800/40 border-transparent text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* Play / Active Icon */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "bg-gray-800/80 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
                          }`}
                        >
                          <Play className={`w-3.5 h-3.5 ${isActive ? "fill-white" : ""}`} />
                        </div>

                        {/* Lesson Title */}
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isActive ? "text-indigo-300" : "text-gray-200"
                            }`}
                          >
                            {index + 1}. {video.name || `Lesson ${index + 1}`}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Video</span>
                          </p>
                        </div>
                      </div>

                      {/* Completion Checkbox */}
                      <button
                        onClick={(e) => toggleCompletion(videoId, e)}
                        title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
                        className="shrink-0 p-1 hover:scale-110 transition-transform text-gray-500 hover:text-indigo-400"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 hover:text-gray-400" />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}