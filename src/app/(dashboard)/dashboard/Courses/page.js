"use client";

import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "All", label: "All", icon: "▦" },
  { id: "Production", label: "Production", icon: "🎛️" },
  { id: "Vocals", label: "Vocals", icon: "🎤" },
  { id: "Instruments", label: "Instruments", icon: "🎸" },
  { id: "Composition", label: "Composition", icon: "✏️" },
  { id: "Business", label: "Business", icon: "💼" },
  { id: "Mixing & Mastering", label: "Mixing & Mastering", icon: "🎚️" },
];

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState([]);

  const { user, loading } = useAuth();
  
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/Login");
    }
  }, [user, loading, router]);

  const getCourses = async () => {
    try {
      const foundCourses = await axios.get(
        `${API_BASE}/api/v1/courses/findCourses`
      );

      setCourses(foundCourses.data.data.courses);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!loading && user) {
      getCourses();
    }
  }, [loading, user]);

  const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();

      return courses.filter((course) => {
          const matchesCategory =
              category === "All" ||
              course.category === category;

          const matchesQuery =
              !q ||
              course.title.toLowerCase().includes(q);

          return matchesCategory && matchesQuery;
      });
  }, [courses, query, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white p-5 sm:p-8"
      style={{
        background:
          "linear-gradient(135deg, #1E1338 0%, #1A1730 45%, #0E241C 100%)",
      }}
    >
      {/* Search */}
      <div className="relative max-w-3xl mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music courses, skills, instructors..."
          className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm placeholder:text-gray-400 outline-none focus:border-[#8B6EF2] transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-3 flex-wrap mb-8">
        {CATEGORIES.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-colors ${
                active
                  ? "bg-[#2FBF8F] border-[#2FBF8F] text-[#04231A]"
                  : "bg-black/30 border-white/10 text-gray-300 hover:border-white/25"
              }`}
            >
              <span aria-hidden="true">{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

<div className="grid grid-cols-1 gap-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {filtered.map((course) => (
      <div
        key={course.id}
        className="bg-[#171426]/80 border border-white/10 rounded-2xl p-4 flex flex-col hover:border-white/25 transition-colors"
      >
        <h3 className="font-bold text-lg mb-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mb-1">
          Trainer: {course.trainer.name}
        </p>

        <p className="text-sm text-gray-400 mb-3 line-clamp-3">
          {course.description}
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Category: {course.category}
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Language: {course.language.name}
        </p>

        <p className="text-lg font-semibold text-green-400 mb-4">
          ₹{course.price}
        </p>

        <div className="flex gap-2 mt-auto">
          <button
          onClick = {() => {
            router.push(`/Courses/${course.id}/Details`);
          }}
          className="flex-1 text-xs font-semibold border border-white/20 rounded-lg py-2 hover:bg-white/5">
            View Details
          </button>

          <button
            onClick = {() => {
              router.push(`/Courses/${course.id}/Enroll`);
            }}
            className="flex-1 text-xs font-semibold rounded-lg py-2 text-white"
            style={{
              background: "linear-gradient(90deg, #8B6EF2, #6C4FE0)",
            }}
          >
            Enroll
          </button>
        </div>
      </div>
    ))}
  </div>

    {filtered.length === 0 && (
      <p className="text-sm text-gray-400 py-12 text-center">
        No courses match your search.
      </p>
    )}
  </div>

  </div>
  );
}