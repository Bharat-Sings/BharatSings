"use client";

import React, { useMemo, useState } from "react";

const CATEGORIES = [
  { id: "All", label: "All", icon: "▦" },
  { id: "Production", label: "Production", icon: "🎛️" },
  { id: "Vocals", label: "Vocals", icon: "🎤" },
  { id: "Instruments", label: "Instruments", icon: "🎸" },
  { id: "Composition", label: "Composition", icon: "✏️" },
  { id: "Business", label: "Business", icon: "💼" },
  { id: "Mixing & Mastering", label: "Mixing & Mastering", icon: "🎚️" },
];

const COURSES = [
  {
    id: 1,
    title: "Electronic Music Production Masterclass",
    instructor: "Alex Rivers",
    rating: 4.8,
    reviews: 520,
    desc: "Learn synthesizing, beat-making, arrangement, and mixing from the ground up.",
    modules: 15,
    hours: 40,
    category: "Production",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Vocal Techniques & Artistry",
    instructor: "Sarah Chen",
    rating: 4.9,
    reviews: 310,
    desc: "Develop your voice, breathing, pitch control, and stage presence.",
    modules: 10,
    hours: 25,
    category: "Vocals",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Beginner to Advanced Guitar",
    instructor: "Mike Davidson",
    rating: 4.6,
    reviews: 280,
    desc: "Master chords, scales, solos, and songwriting on guitar.",
    modules: 18,
    hours: 55,
    category: "Instruments",
    img: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Music Theory Fundamentals",
    instructor: "Dr. Elena Petrova",
    rating: 4.9,
    reviews: 410,
    desc: "Understand notes, rhythms, harmony, and how to apply them.",
    modules: 12,
    hours: 30,
    category: "Composition",
    img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Music Business Essentials",
    instructor: "Jordan Blake",
    rating: 4.7,
    reviews: 190,
    desc: "Contracts, royalties, marketing, and launching an independent career.",
    modules: 14,
    hours: 35,
    category: "Business",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Mixing & Mastering Bootcamp",
    instructor: "Priya Nair",
    rating: 4.8,
    reviews: 260,
    desc: "EQ, compression, loudness, and getting a final, polished mix.",
    modules: 16,
    hours: 45,
    category: "Mixing & Mastering",
    img: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "Songwriting & Composition Lab",
    instructor: "Marcus Webb",
    rating: 4.7,
    reviews: 150,
    desc: "Melody, structure, lyrics, and arrangement for original songs.",
    modules: 11,
    hours: 28,
    category: "Composition",
    img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    title: "Advanced Synth Sound Design",
    instructor: "Alex Rivers",
    rating: 4.8,
    reviews: 200,
    desc: "Wavetables, modulation, and building your own signature patches.",
    modules: 13,
    hours: 32,
    category: "Production",
    img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=600&q=80",
  },
];

const TRENDING = [COURSES[0], COURSES[2]];
const NEW_RELEASES = [COURSES[1], COURSES[2]];
const RECOMMENDED = [COURSES[0], COURSES[1], COURSES[3]];

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="text-[#F5B942]" aria-hidden="true">★</span>
      <span className="font-semibold text-white">{rating.toFixed(1)}</span>
    </span>
  );
}

function SidebarItem({ course }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={course.img}
        alt={course.title}
        className="w-11 h-11 rounded-lg object-cover shrink-0"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
          {course.title}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{course.instructor}</p>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSES.filter((c) => {
      const matchesCategory = category === "All" || c.category === category;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

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

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_280px] gap-8 items-start">
        {/* Course grid */}
        <div className="min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((course) => (
              <div
                key={course.id}
                className="bg-[#171426]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-white/25 transition-colors"
              >
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full aspect-[4/3] object-cover"
                />

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-1">{course.instructor}</p>

                  <div className="flex items-center gap-1.5 mb-2">
                    <Stars rating={course.rating} />
                    <span className="text-xs text-gray-400">
                      ({course.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {course.desc}
                  </p>

                  <p className="text-xs text-gray-500 mb-4 mt-auto">
                    {course.modules} modules &middot; {course.hours} hours
                  </p>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 text-xs font-semibold border border-white/20 rounded-lg py-2 hover:bg-white/5 transition-colors">
                      View details
                    </button>
                    <button
                      className="flex-1 text-xs font-semibold rounded-lg py-2 text-white transition-transform hover:scale-[1.02]"
                      style={{
                        background: "linear-gradient(90deg, #8B6EF2, #6C4FE0)",
                      }}
                    >
                      Enroll now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="col-span-full text-sm text-gray-400 py-12 text-center">
                No courses match your search.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 2xl:sticky 2xl:top-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-300 mb-3">
              Trending courses
            </h2>
            <div className="space-y-3">
              {TRENDING.map((c) => (
                <SidebarItem key={c.id} course={c} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-300 mb-3">
              New releases
            </h2>
            <div className="space-y-3">
              {NEW_RELEASES.map((c) => (
                <SidebarItem key={c.id} course={c} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-300 mb-3">
              Recommended for you
            </h2>
            <div className="space-y-3">
              {RECOMMENDED.map((c) => (
                <SidebarItem key={c.id} course={c} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}