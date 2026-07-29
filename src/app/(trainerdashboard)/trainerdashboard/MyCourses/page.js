"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTrainerAuth } from "@/app/context/TrainerAuthContext";
import { useRouter } from "next/navigation";
import { BookOpen, Tag, IndianRupee, Languages, Plus, Library } from "lucide-react";

const LANGUAGE_NAMES = {
    1: "Hindi",
    2: "English",
    3: "Punjabi",
    4: "Maithili",
    5: "Bhojpuri",
    6: "Haryanvi",
    7: "Telugu",
    8: "Malayalam",
    9: "Kannada",
    10: "Marathi",
};

function CourseCardSkeleton() {
    return (
        <div className="rounded-2xl bg-[#13131A] border border-gray-800 p-5 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-800 mb-4" />
            <div className="h-4 w-3/4 bg-gray-800 rounded mb-2.5" />
            <div className="h-3 w-full bg-gray-800/70 rounded mb-1.5" />
            <div className="h-3 w-5/6 bg-gray-800/70 rounded mb-4" />
            <div className="h-5 w-20 bg-gray-800 rounded-full" />
        </div>
    );
}

function CourseCard({ course, index }) {
    const languageName = LANGUAGE_NAMES[course.language_id];

    return (
        <div
            className="group rounded-2xl bg-[#13131A] border border-gray-800 p-5 flex flex-col transition-all duration-300 hover:border-[#7F56D9]/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(127,86,217,0.35)] card-reveal"
            style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-[#1C1A2E] border border-[#3A2570] flex items-center justify-center group-hover:border-[#7F56D9] transition-colors">
                    <BookOpen className="h-4.5 w-4.5 text-[#7F56D9]" />
                </div>

                {course.price !== undefined && course.price !== null && (
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                        <IndianRupee size={11} />
                        {course.price}
                    </span>
                )}
            </div>

            <h3 className="text-white font-semibold text-base leading-snug mb-1.5 line-clamp-2">
                {course.title}
            </h3>

            {course.description && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {course.description}
                </p>
            )}

            <div className="mt-auto flex items-center flex-wrap gap-2 pt-1">
                {course.category && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#B7A6F2] bg-[#7F56D9]/10 border border-[#7F56D9]/25 rounded-full px-2.5 py-1">
                        <Tag size={11} />
                        {course.category}
                    </span>
                )}
                {languageName && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-gray-800/60 border border-gray-700 rounded-full px-2.5 py-1">
                        <Languages size={11} />
                        {languageName}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState(null);

    const { trainer, accessToken, loading } = useTrainerAuth();
    const router = useRouter();

    useEffect(() => {
        if (!trainer && !loading) {
            router.replace("/loginTrainer");
        }
    }, [trainer, loading, router]);

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

    const findMyCourses = async () => {
        setCoursesLoading(true);
        setCoursesError(null);
        try {
            const response = await axios.get(
                `${API_BASE}/api/v1/courses/findCoursesByTrainerId`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setCourses(response.data?.data?.courses || []);
        } catch (err) {
            console.log(err);
            setCoursesError("Couldn't load your courses. Try refreshing the page.");
        } finally {
            setCoursesLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && trainer) {
            findMyCourses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, trainer]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B10]">
                <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B10] px-4 sm:px-8 py-10">
            <style>{`
                @keyframes cardReveal {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .card-reveal {
                    animation: cardReveal 0.5s ease forwards;
                    opacity: 0;
                }
                @media (prefers-reduced-motion: reduce) {
                    .card-reveal { animation: none; opacity: 1; }
                }
            `}</style>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-[#1C1A2E] border border-[#3A2570] flex items-center justify-center">
                            <Library className="h-5 w-5 text-[#7F56D9]" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
                                My Courses
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {coursesLoading
                                    ? "Loading your catalog..."
                                    : `${courses.length} course${courses.length === 1 ? "" : "s"} published`}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/CourseUpload")}
                        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#6366F1] rounded-full px-5 py-2.5 hover:bg-[#5356E2] transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto"
                    >
                        <Plus size={14} /> New Course
                    </button>
                </div>

                {/* Loading skeletons */}
                {coursesLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!coursesLoading && coursesError && (
                    <div className="rounded-2xl bg-[#13131A] border border-gray-800 p-8 text-center">
                        <p className="text-sm text-gray-400">{coursesError}</p>
                    </div>
                )}

                {/* Empty state */}
                {!coursesLoading && !coursesError && courses.length === 0 && (
                    <div className="rounded-2xl bg-[#13131A] border border-gray-800 p-12 text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#1C1A2E] border border-[#3A2570] flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-[#7F56D9]" />
                        </div>
                        <h2 className="text-white font-semibold mb-1.5">No courses yet</h2>
                        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                            Once you create and publish a course, it'll show up here.
                        </p>
                        <button
                            onClick={() => router.push("/CourseUpload")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#6366F1] rounded-full px-5 py-2.5 hover:bg-[#5356E2] transition-colors"
                        >
                            <Plus size={14} /> Create your first course
                        </button>
                    </div>
                )}

                {/* Course grid */}
                {!coursesLoading && !coursesError && courses.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}