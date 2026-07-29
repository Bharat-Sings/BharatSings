"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

export default function Enroll() {
  const { user, accessToken, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/Login");
    }
  }, [user, loading, router]);

  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const [course, setCourse] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [screenshotId, setScreenshotId] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/courses/findCourseById?course_id=${courseId}`
        );
        setCourse(res.data?.data?.course || null);
      } catch (err) {
        console.error(err);
        alert("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "course_payment_screenshot");

      const cloud = await axios.post(
        "https://api.cloudinary.com/v1_1/otg38vo5/image/upload",
        uploadData
      );

      const saved = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/screenshots/createScreenshot`,
        { file_path: cloud.data.secure_url },
        { headers: { "Content-Type": "application/json" } }
      );

      const id = saved.data?.data?.screenshot?.id;
      if (!id) throw new Error("No screenshot id returned");

      setScreenshotId(id);
      alert("Screenshot uploaded successfully!");
    } catch (err) {
      console.error(err);
      setPreview("");
      alert("Screenshot upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEnroll = async () => {
    if (!screenshotId) return;
    setEnrolling(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/enrollments/createEnrollment`,
        { course_id: courseId, screenshot_id: screenshotId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.data?.data?.createdEnrollment?.id) throw new Error("Enrollment failed");
      setEnrolled(true);
      alert("Successfully enrolled in the course!");
    } catch (err) {
      console.error(err);
      alert("Course enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (Loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading course…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Course not found.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <h1 className="text-lg font-semibold text-gray-500">Loading....</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Course details */}
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {course.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-4 leading-relaxed text-gray-600">{course.description}</p>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <Detail label="Trainer" value={course.trainer?.name} />
            <Detail label="Language" value={course.language?.name} />
            <Detail label="Category" value={course.category} />
            <Detail label="Course fee" value={`₹${course.price}`} />
          </dl>

          {enrolled && (
            <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-5">
              <p className="font-semibold text-green-800">You&apos;re enrolled in this course</p>
              <p className="mt-1 text-sm text-green-700">
                Your payment is verified and your seat is confirmed.
              </p>
            </div>
          )}

          <div className="mt-8">
            {enrolled ? (
              <button
                disabled
                className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white opacity-90"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Enrolled
              </button>
            ) : (
              <>
                <button
                  onClick={handleEnroll}
                  disabled={!screenshotId || enrolling}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {enrolling ? "Enrolling…" : "Enroll now"}
                </button>
                {!screenshotId && (
                  <p className="mt-3 text-xs text-gray-500">
                    Upload your payment screenshot to unlock enrollment.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* Payment panel — hidden after enrollment */}
        {!enrolled && (
          <aside className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-blue-600 uppercase">Step 1 · Pay</h2>
            <p className="mt-2 text-sm text-gray-600">
              Scan the QR code and pay{" "}
              <span className="font-semibold text-gray-900">₹{course.price}</span> to reserve your seat.
            </p>

            {course.QR_file_path && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <img
                  src={course.QR_file_path}
                  alt={`Payment QR code for ${course.title}`}
                  className="mx-auto aspect-square w-full max-w-[240px] rounded-lg object-contain"
                />
              </div>
            )}

            <hr className="my-7 border-gray-200" />

            <h2 className="text-sm font-bold tracking-wide text-blue-600 uppercase">
              Step 2 · Upload
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Upload the payment screenshot so we can verify your transaction.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            {preview ? (
              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-3">
                <img
                  src={preview}
                  alt="Uploaded payment screenshot preview"
                  className="max-h-44 w-full rounded-lg object-cover"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-700">✓ Screenshot uploaded</span>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-xs font-medium text-gray-600 underline"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-5 w-full rounded-xl border-2 border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 transition hover:border-blue-400 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading…" : "Click to upload screenshot"}
              </button>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-gray-500 uppercase">{label}</dt>
      <dd className="mt-1 font-semibold text-gray-900">{value || "—"}</dd>
    </div>
  );
}
