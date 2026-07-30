"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  BookOpen,
  User,
  Tag,
  IndianRupee,
  Languages,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Star,
  MessageSquare,
  Send,
} from "lucide-react";

export default function Details() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;

  // Fetch Course Details
  const getCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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

  // Fetch Course Reviews
  const getCourseReviews = useCallback(async () => {
    if (!courseId) return;
    try {
      setReviewsLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/v1/coursereviews/findCourseReviewsByCourseId`,
        {
          params: { courseId: courseId },
        }
      );
      const reviewsList = res.data?.data?.courseReviews || [];
      setReviews(reviewsList);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [API_BASE, courseId]);

  useEffect(() => {
    if (courseId) {
      getCourseDetails();
      getCourseReviews();
    }
  }, [courseId, getCourseDetails, getCourseReviews]);

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      setReviewMessage({ type: "error", text: "Please enter a review message." });
      return;
    }

    if (!userId.trim()) {
      setReviewMessage({ type: "error", text: "User ID is required to post a review." });
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewMessage(null);

      const parsedUserId = isNaN(Number(userId)) ? userId : Number(userId);
      const parsedCourseId = isNaN(Number(courseId)) ? courseId : Number(courseId);

      await axios.post(`${API_BASE}/api/v1/coursereviews/createCourseReview`, {
        user_id: parsedUserId,
        course_id: parsedCourseId,
        review_text: reviewText,
        rating: Number(rating),
      });

      setReviewMessage({ type: "success", text: "Review submitted successfully!" });
      setReviewText("");
      setRating(5);

      // Refresh review list
      getCourseReviews();
    } catch (err) {
      console.error("Error creating review:", err);
      setReviewMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate Average Rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

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
                <span>
                  Taught in <strong>{course.language?.name || "English"}</strong> for optimal comprehension.
                </span>
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
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <div className="rounded-[24px] bg-[#13131A] border border-gray-800/80 p-6 sm:p-8 space-y-8">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#1C1A2E] border border-[#3A2570] text-[#7F56D9]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Course Reviews & Feedback
                </h2>
                <p className="text-xs text-gray-400">
                  See what other students think about this course
                </p>
              </div>
            </div>

            {/* Overall Rating Summary */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 bg-[#1C1C24] px-4 py-2 rounded-2xl border border-gray-800">
                <div className="text-right">
                  <span className="text-lg font-bold text-white block leading-none">
                    {averageRating} <span className="text-xs text-gray-400">/ 5</span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
                <div className="flex items-center text-amber-400">
                  <Star size={18} className="fill-amber-400" />
                </div>
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="space-y-4 bg-[#1C1C24] p-5 sm:p-6 rounded-2xl border border-gray-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Leave a Review
            </h3>

            {reviewMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  reviewMessage.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {reviewMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User ID input */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  User ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-[#13131A] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#7F56D9] transition-colors"
                />
              </div>

              {/* Star Rating Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Rating
                </label>
                <div className="flex items-center gap-1.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={`${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-700"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-gray-300 ml-2">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>
            </div>

            {/* Review Text Area */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Review Comments
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your feedback about the instructor, content quality, or pacing..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-[#13131A] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#7F56D9] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7F56D9] px-5 py-2.5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-[#6C47C2] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {submittingReview ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send size={14} /> Post Review
                </>
              )}
            </button>
          </form>

          {/* List of Previous Reviews */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Student Reviews ({reviews.length})
            </h3>

            {reviewsLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-6 justify-center">
                <Loader2 size={16} className="animate-spin text-[#7F56D9]" />
                Loading feedback...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 bg-[#1C1C24]/50 border border-dashed border-gray-800 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-medium">No reviews yet.</p>
                <p className="text-[11px] text-gray-600">Be the first student to leave feedback!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev, index) => (
                  <div
                    key={rev.id || index}
                    className="p-4 rounded-xl bg-[#1C1C24] border border-gray-800 space-y-2 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-[#1C1A2E] border border-[#3A2570] text-[#7F56D9] text-xs flex items-center justify-center font-bold">
                          U
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          User #{rev.user_id}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={`${
                              star <= Number(rev.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed pl-9">
                      {rev.review_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}