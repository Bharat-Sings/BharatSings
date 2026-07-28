"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTrainerAuth } from "@/app/context/TrainerAuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    BookOpen,
    FileText,
    Tag,
    IndianRupee,
    Languages,
    Smartphone,
    UploadCloud,
    Video,
    CheckCircle2,
    XCircle,
    Loader2,
    Plus,
    Trash2,
    Rocket,
} from "lucide-react";

const MAX_VIDEOS = 5;
const MIN_VIDEOS_TO_PUBLISH = 2;
const MAX_VIDEO_SIZE = 300 * 1024 * 1024; // 300MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];

const LANGUAGES_WITH_ID = {
    Hindi: 1,
    English: 2,
    Punjabi: 3,
    Maithili: 4,
    Bhojpuri: 5,
    Haryanvi: 6,
    Telugu: 7,
    Malayalam: 8,
    Kannada: 9,
    Marathi: 10,
};

let localIdCounter = 0;
function nextLocalId() {
    localIdCounter += 1;
    return `v-${localIdCounter}`;
}

function emptyVideoSlot() {
    return {
        localId: nextLocalId(),
        name: "",
        file: null,
        status: "idle", // idle | uploading | done | error
        error: null,
    };
}

function FieldShell({ icon, label, children }) {
    return (
        <div className="relative rounded-xl bg-[#1C1C24] border border-gray-800 focus-within:border-[#7F56D9] transition-all p-3 text-left">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {icon}
            </span>
            <div className="pl-8 flex flex-col">
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    {label}
                </label>
                {children}
            </div>
        </div>
    );
}

export default function CourseUpload() {
    // --- Course detail fields ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [language, setLanguage] = useState("");
    const [paytmPhoneNumber, setPaytmPhoneNumber] = useState("");

    // --- Course lifecycle ---
    const [courseId, setCourseId] = useState(null);
    const [creatingCourse, setCreatingCourse] = useState(false);
    const [courseError, setCourseError] = useState(null);
    const [published, setPublished] = useState(false);
    const [publishing, setPublishing] = useState(false);

    // --- Videos ---
    const [videos, setVideos] = useState([emptyVideoSlot()]);

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;
    const router = useRouter();
    const { trainer, accessToken, loading } = useTrainerAuth();

    // Refs so the unload/unmount cleanup always reads the *latest* values,
    // not whatever was captured when the effect first ran.
    const courseIdRef = useRef(null);
    const publishedRef = useRef(false);
    useEffect(() => {
        courseIdRef.current = courseId;
    }, [courseId]);
    useEffect(() => {
        publishedRef.current = published;
    }, [published]);

    useEffect(() => {
        if (!trainer && !loading) {
            router.push("/trainerLogin");
        }
    }, [trainer, loading, router]);

    // If the trainer created a course but leaves without publishing it,
    // delete the orphaned course. Covers both in-app unmount (back button,
    // navigating away) and closing/refreshing the tab (best-effort only —
    // browsers don't guarantee async requests finish on unload).
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B10]">
                <h1 className="text-lg font-semibold text-gray-400">Loading....</h1>
            </div>
        );
    }

    const uploadedCount = videos.filter((v) => v.status === "done").length;
    const pendingCount = videos.filter((v) => v.status === "idle" && v.file).length;
    const canAddMoreSlots = videos.length < MAX_VIDEOS;

    // --- Course creation ---
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setCourseError(null);

        if (!title.trim() || !description.trim() || !category.trim() || !language) {
            setCourseError("Please fill in all course details.");
            return;
        }
        if (!price || Number(price) <= 0) {
            setCourseError("Please enter a valid price.");
            return;
        }
        if (!/^\d{10}$/.test(paytmPhoneNumber.trim())) {
            setCourseError("Enter a valid 10-digit Paytm phone number.");
            return;
        }

        setCreatingCourse(true);
        try {
            const res = await axios.post(
                `${API_BASE}/api/v1/courses/createCourse`,
                {
                    title,
                    description,
                    category,
                    language_id: LANGUAGES_WITH_ID[language],
                    price: Number(price),
                    paytm_phone_number: paytmPhoneNumber.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const createdId = res.data?.data?.createdCourse?.id;
            if (!createdId) {
                setCourseError("Something went wrong creating the course.");
                return;
            }

            setCourseId(createdId);
        } catch (err) {
            console.log(err);
            setCourseError(
                err.response?.data?.message || "Couldn't create the course. Try again."
            );
        } finally {
            setCreatingCourse(false);
        }
    };

    // --- Video slot management ---
    const addVideoSlot = () => {
        if (!canAddMoreSlots) return;
        setVideos((prev) => [...prev, emptyVideoSlot()]);
    };

    const removeVideoSlot = (localId) => {
        setVideos((prev) => prev.filter((v) => v.localId !== localId));
    };

    const updateVideoField = (localId, patch) => {
        setVideos((prev) =>
            prev.map((v) => (v.localId === localId ? { ...v, ...patch } : v))
        );
    };

    const uploadOneVideo = useCallback(
        async (video) => {
            if (!video.file || !video.name.trim()) {
                updateVideoField(video.localId, {
                    status: "error",
                    error: "Add a name and choose a file first.",
                });
                return;
            }
            if (!ALLOWED_VIDEO_TYPES.includes(video.file.type)) {
                updateVideoField(video.localId, {
                    status: "error",
                    error: "Unsupported file type. Use MP4, WebM, MOV, or MKV.",
                });
                return;
            }
            if (video.file.size > MAX_VIDEO_SIZE) {
                updateVideoField(video.localId, {
                    status: "error",
                    error: "Maximum size is 300MB.",
                });
                return;
            }

            updateVideoField(video.localId, { status: "uploading", error: null });

            try {
                const uploadData = new FormData();
                uploadData.append("file", video.file);
                uploadData.append("upload_preset", "course_video");

                const res = await fetch(
                    "https://api.cloudinary.com/v1_1/otg38vo5/video/upload",
                    { method: "POST", body: uploadData }
                );

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error?.message || "Cloudinary upload failed.");
                }

                const data = await res.json();

                const createdVideo = await axios.post(
                    `${API_BASE}/api/v1/videos/createvideo`,
                    {
                        course_id: courseIdRef.current,
                        name: video.name.trim(),
                        file_path: data.secure_url,
                    }
                );

                if (!createdVideo.data?.data?.video?.id) {
                    throw new Error("Video record could not be created.");
                }

                updateVideoField(video.localId, { status: "done", error: null });
            } catch (err) {
                console.log(err);
                updateVideoField(video.localId, {
                    status: "error",
                    error: err.message || "Upload failed.",
                });
            }
        },
        [API_BASE]
    );

    const publishCourse = async () => {
        try {
            const updatedCourse = await axios.patch(
                `${API_BASE}/api/v1/courses/publishCourse`,
                {
                    course_id: courseId
                }
            );

            if (!updatedCourse.data?.data?.updatedCourse?.is_published) {
                alert("Error Publishing Course!");
                return false;
            }

            return true;
        } catch (err) {
            console.log(err);
            alert("Error Publishing Course!");
            return false;
        }
    };

    const uploadAllPending = async () => {
        const toUpload = videos.filter((v) => v.status === "idle" && v.file);
        await Promise.all(toUpload.map((v) => uploadOneVideo(v)));
    };

    // --- Publish ---
    const handlePublish = async () => {
        const uploadedCount = videos.filter(
            (video) => video.status === "done"
        ).length;

        if (uploadedCount < MIN_VIDEOS_TO_PUBLISH) {
            alert(`Please upload at least ${MIN_VIDEOS_TO_PUBLISH} videos.`);
            return;
        }

        if (uploadedCount > MAX_VIDEOS) {
            alert(`Maximum ${MAX_VIDEOS} videos are allowed.`);
            return;
        }

        setPublishing(true);

        try {
            const success = await publishCourse();

            if (!success) return;

            setPublished(true);

            alert("Course published successfully!");

            // Reset form
            setTitle("");
            setDescription("");
            setCategory("");
            setPrice("");
            setLanguage("");
            setPaytmPhoneNumber("");
            setCourseId(null);
            setVideos([emptyVideoSlot()]);
            setCourseError(null);

        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B10] py-12 px-4">
            <div className="mx-auto w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1A2E] border border-[#3A2570]">
                        <BookOpen className="h-6 w-6 text-[#7F56D9]" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-wide">
                        {courseId ? "Upload Your Course Videos" : "Create a New Course"}
                    </h1>
                    <p className="mt-1 text-xs text-gray-400">
                        {courseId
                            ? "Add at least 2 videos, then publish when you're ready."
                            : "Fill in your course details to get started."}
                    </p>
                </div>

                {/* --- PHASE 1: COURSE DETAILS --- */}
                {!courseId && (
                    <form
                        onSubmit={handleCreateCourse}
                        className="rounded-[24px] bg-[#13131A] p-8 shadow-2xl space-y-4"
                    >
                        <FieldShell icon={<BookOpen size={18} />} label="Course Title">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Foundations of Hindustani Vocals"
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                                required
                            />
                        </FieldShell>

                        <FieldShell icon={<FileText size={18} />} label="Description">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What will students learn in this course?"
                                rows={3}
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-1 resize-none min-h-[60px]"
                                required
                            />
                        </FieldShell>

                        <FieldShell icon={<Tag size={18} />} label="Category">
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Vocal Training, Guitar, Piano"
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                                required
                            />
                        </FieldShell>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldShell icon={<IndianRupee size={18} />} label="Price">
                                <input
                                    type="number"
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="e.g. 999"
                                    className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                                    required
                                />
                            </FieldShell>

                            <FieldShell icon={<Languages size={18} />} label="Language">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-transparent text-sm text-white focus:outline-none mt-0.5 cursor-pointer appearance-none"
                                    required
                                >
                                    <option value="" disabled className="bg-[#1C1C24]">
                                        Select language
                                    </option>
                                    {Object.keys(LANGUAGES_WITH_ID).map((lang) => (
                                        <option key={lang} value={lang} className="bg-[#1C1C24]">
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </FieldShell>
                        </div>

                        <FieldShell icon={<Smartphone size={18} />} label="Paytm Phone Number">
                            <input
                                type="tel"
                                value={paytmPhoneNumber}
                                onChange={(e) =>
                                    setPaytmPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                                }
                                placeholder="10-digit number for receiving payments"
                                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none mt-0.5"
                                required
                            />
                        </FieldShell>

                        {courseError && (
                            <p className="text-xs text-red-400 text-center">{courseError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={creatingCourse}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-200 hover:bg-[#5356E2] active:scale-[0.99] focus:outline-none mt-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {creatingCourse ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Creating...
                                </>
                            ) : (
                                "Create Course"
                            )}
                        </button>
                    </form>
                )}

                {/* --- PHASE 2: VIDEO UPLOAD --- */}
                {courseId && (
                    <div className="rounded-[24px] bg-[#13131A] p-8 shadow-2xl space-y-6">
                        {/* Progress toward the 2-video minimum */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-gray-400 font-medium">
                                    {uploadedCount} of {MAX_VIDEOS} videos uploaded
                                </span>
                                <span
                                    className={
                                        uploadedCount >= MIN_VIDEOS_TO_PUBLISH
                                            ? "text-emerald-400 font-medium"
                                            : "text-gray-500"
                                    }
                                >
                                    {uploadedCount >= MIN_VIDEOS_TO_PUBLISH
                                        ? "Ready to publish"
                                        : `${MIN_VIDEOS_TO_PUBLISH - uploadedCount} more to publish`}
                                </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#7F56D9] transition-all duration-500"
                                    style={{ width: `${(uploadedCount / MAX_VIDEOS) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Video slots */}
                        <div className="space-y-3">
                            {videos.map((video, index) => (
                                <div
                                    key={video.localId}
                                    className="rounded-xl bg-[#1C1C24] border border-gray-800 p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Video size={14} /> Video {index + 1}
                                        </span>

                                        {video.status === "done" && (
                                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                                <CheckCircle2 size={14} /> Uploaded
                                            </span>
                                        )}
                                        {video.status === "uploading" && (
                                            <span className="flex items-center gap-1 text-xs text-[#7F56D9]">
                                                <Loader2 size={14} className="animate-spin" /> Uploading...
                                            </span>
                                        )}
                                        {video.status === "idle" && videos.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVideoSlot(video.localId)}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                                aria-label="Remove video slot"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {video.status !== "done" && (
                                        <>
                                            <input
                                                type="text"
                                                value={video.name}
                                                onChange={(e) =>
                                                    updateVideoField(video.localId, { name: e.target.value })
                                                }
                                                placeholder="Video title (e.g. Lesson 1: Breath Control)"
                                                disabled={video.status === "uploading"}
                                                className="w-full bg-[#0F0F14] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7F56D9] transition-all disabled:opacity-50"
                                            />

                                            <label
                                                className={`flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 py-3 text-xs text-gray-400 transition-colors ${
                                                    video.status === "uploading"
                                                        ? "opacity-50"
                                                        : "cursor-pointer hover:border-[#7F56D9] hover:text-[#7F56D9]"
                                                }`}
                                            >
                                                <UploadCloud size={16} />
                                                {video.file ? video.file.name : "Choose a video file"}
                                                <input
                                                    type="file"
                                                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                                                    disabled={video.status === "uploading"}
                                                    onChange={(e) =>
                                                        updateVideoField(video.localId, {
                                                            file: e.target.files?.[0] || null,
                                                            status: "idle",
                                                            error: null,
                                                        })
                                                    }
                                                    className="hidden"
                                                />
                                            </label>

                                            {video.error && (
                                                <p className="flex items-center gap-1.5 text-xs text-red-400">
                                                    <XCircle size={13} /> {video.error}
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => uploadOneVideo(video)}
                                                disabled={
                                                    video.status === "uploading" ||
                                                    !video.file ||
                                                    !video.name.trim()
                                                }
                                                className="w-full text-xs font-semibold text-[#7F56D9] border border-[#7F56D9]/40 rounded-lg py-2 hover:bg-[#7F56D9]/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                                            >
                                                Upload this video
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Slot / bulk actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={addVideoSlot}
                                disabled={!canAddMoreSlots}
                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-300 border border-gray-700 rounded-lg py-2.5 hover:border-gray-500 transition-colors disabled:opacity-40"
                            >
                                <Plus size={14} /> Add another video
                            </button>

                            <button
                                type="button"
                                onClick={uploadAllPending}
                                disabled={pendingCount === 0}
                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#1C1C24] border border-gray-700 rounded-lg py-2.5 hover:border-[#7F56D9] transition-colors disabled:opacity-40"
                            >
                                <UploadCloud size={14} /> Upload all pending
                            </button>
                        </div>

                        {!canAddMoreSlots && (
                            <p className="text-[11px] text-gray-500 text-center">
                                Maximum of {MAX_VIDEOS} videos per course.
                            </p>
                        )}

                        {/* Publish */}
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={publishing}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-200 hover:bg-emerald-500 active:scale-[0.99] focus:outline-none shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                            <Rocket size={16} />
                            Publish Course
                        </button>

                        <p className="text-[11px] text-gray-500 text-center">
                            Leaving this page before publishing will delete this course draft.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}