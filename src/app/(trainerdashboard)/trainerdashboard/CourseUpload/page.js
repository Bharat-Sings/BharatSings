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
  UploadCloud,
  Video,
  FileAudio,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Trash2,
  Rocket,
  QrCode,
  Film,
} from "lucide-react";

const MAX_MEDIA_SLOTS = 5;
const MIN_MEDIA_TO_PUBLISH = 2;
const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB

const ALLOWED_MEDIA_TYPES = [
  // Video
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/aac",
  "audio/ogg",
  "audio/m4a",
  "audio/x-m4a",
];

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
  return `m-${localIdCounter}`;
}

function emptyMediaSlot() {
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
  const [QRFile, setQRFile] = useState(null);
  const [QRFilePath, setQRFilePath] = useState("");
  const [uploadingQR, setUploadingQR] = useState(false);
  const [QRError, setQRError] = useState(null);

  // --- Course lifecycle ---
  const [courseId, setCourseId] = useState(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [courseError, setCourseError] = useState(null);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // --- Lessons (Audio / Video) ---
  const [mediaSlots, setMediaSlots] = useState([emptyMediaSlot()]);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;
  const router = useRouter();
  const { trainer, accessToken, loading } = useTrainerAuth();

  // Refs so the unload/unmount cleanup reads the latest state
  const courseIdRef = useRef(null);
  const publishedRef = useRef(false);
  const tokenRef = useRef(null);

  useEffect(() => {
    courseIdRef.current = courseId;
  }, [courseId]);

  useEffect(() => {
    publishedRef.current = published;
  }, [published]);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  // Auth Protection
  useEffect(() => {
    if (!trainer && !loading) {
      router.push("/trainerLogin");
    }
  }, [trainer, loading, router]);

  // Handle cleanup of unpublished/orphaned course on browser refresh/close or component unmount
  useEffect(() => {
    const cleanupOrphanedCourse = () => {
      const activeId = courseIdRef.current;
      const isPub = publishedRef.current;
      const token = tokenRef.current;

      if (activeId && !isPub && API_BASE && token) {
        fetch(`${API_BASE}/api/v1/courses/deleteCourse`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ course_id: activeId }),
          keepalive: true,
        }).catch((err) => console.error("Cleanup failed:", err));
      }
    };

    const handleBeforeUnload = () => {
      cleanupOrphanedCourse();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanupOrphanedCourse();
    };
  }, [API_BASE]);

  const uploadedCount = mediaSlots.filter((m) => m.status === "done").length;
  const pendingCount = mediaSlots.filter(
    (m) => m.status === "idle" && m.file && m.name.trim()
  ).length;
  const canAddMoreSlots = mediaSlots.length < MAX_MEDIA_SLOTS;

  // --- Media slot management ---
  const addMediaSlot = () => {
    if (!canAddMoreSlots) return;
    setMediaSlots((prev) => [...prev, emptyMediaSlot()]);
  };

  const removeMediaSlot = (localId) => {
    setMediaSlots((prev) => prev.filter((m) => m.localId !== localId));
  };

  const updateMediaField = (localId, patch) => {
    setMediaSlots((prev) =>
      prev.map((m) => (m.localId === localId ? { ...m, ...patch } : m))
    );
  };

  const uploadOneMedia = useCallback(
    async (item) => {
      if (!item.file || !item.name.trim()) {
        updateMediaField(item.localId, {
          status: "error",
          error: "Add a title and choose a file first.",
        });
        return;
      }
      if (!ALLOWED_MEDIA_TYPES.includes(item.file.type)) {
        updateMediaField(item.localId, {
          status: "error",
          error: "Unsupported format. Use MP4, WebM, MOV, MKV, MP3, WAV, or AAC.",
        });
        return;
      }
      if (item.file.size > MAX_FILE_SIZE) {
        updateMediaField(item.localId, {
          status: "error",
          error: "Maximum size is 300MB.",
        });
        return;
      }

      updateMediaField(item.localId, { status: "uploading", error: null });

      try {
        const uploadData = new FormData();
        uploadData.append("file", item.file);
        uploadData.append("upload_preset", "course_video");

        // Determine Cloudinary resource endpoint based on file type
        const isAudio = item.file.type.startsWith("audio/");
        const cloudinaryEndpoint = isAudio
          ? "https://api.cloudinary.com/v1_1/otg38vo5/video/upload" // Cloudinary handles audio via video endpoint
          : "https://api.cloudinary.com/v1_1/otg38vo5/video/upload";

        const res = await fetch(cloudinaryEndpoint, {
          method: "POST",
          body: uploadData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || "Cloudinary upload failed.");
        }

        const data = await res.json();

        const createdRecord = await axios.post(
          `${API_BASE}/api/v1/videos/createvideo`,
          {
            course_id: courseIdRef.current,
            name: item.name.trim(),
            file_path: data.secure_url,
          }
        );

        if (!createdRecord.data?.data?.video?.id) {
          throw new Error("Lesson record could not be created.");
        }

        updateMediaField(item.localId, { status: "done", error: null });
      } catch (err) {
        console.error(err);
        updateMediaField(item.localId, {
          status: "error",
          error: err.message || "Upload failed.",
        });
      }
    },
    [API_BASE]
  );

  const createQR = async (file) => {
    setQRError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setQRError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setQRError("QR image must be under 5MB.");
      return;
    }

    setQRFile(file);
    setUploadingQR(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "Course_QR");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/otg38vo5/image/upload",
        { method: "POST", body: uploadData }
      );

      if (!res.ok) {
        setQRError("Cloudinary upload failed. Try again.");
        return;
      }

      const data = await res.json();
      setQRFilePath(data.secure_url);
    } catch (err) {
      console.error(err);
      setQRError("Couldn't upload the QR image. Try again.");
    } finally {
      setUploadingQR(false);
    }
  };

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

    if (!QRFilePath) {
      setCourseError("Please upload your payment QR code screenshot.");
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
          QR_file_path: QRFilePath,
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
      console.error(err);
      setCourseError(
        err.response?.data?.message || "Couldn't create the course. Try again."
      );
    } finally {
      setCreatingCourse(false);
    }
  };

  const publishCourse = async () => {
    try {
      const updatedCourse = await axios.patch(
        `${API_BASE}/api/v1/courses/publishCourse`,
        {
          course_id: courseId,
        }
      );

      if (!updatedCourse.data?.data?.updatedCourse?.is_published) {
        alert("Error Publishing Course!");
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      alert("Error Publishing Course!");
      return false;
    }
  };

  const uploadAllPending = async () => {
    const toUpload = mediaSlots.filter(
      (m) => m.status === "idle" && m.file && m.name.trim()
    );
    await Promise.all(toUpload.map((m) => uploadOneMedia(m)));
  };

  // --- Publish ---
  const handlePublish = async () => {
    const uploaded = mediaSlots.filter((m) => m.status === "done").length;

    if (uploaded < MIN_MEDIA_TO_PUBLISH) {
      alert(`Please upload at least ${MIN_MEDIA_TO_PUBLISH} lessons (audio or video).`);
      return;
    }

    if (uploaded > MAX_MEDIA_SLOTS) {
      alert(`Maximum ${MAX_MEDIA_SLOTS} lessons are allowed.`);
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
      setQRFile(null);
      setQRFilePath("");
      setCourseId(null);
      setMediaSlots([emptyMediaSlot()]);
      setCourseError(null);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B10]">
        <h1 className="text-lg font-semibold text-gray-400 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B10] py-12 px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1A2E] border border-[#3A2570]">
            <BookOpen className="h-6 w-6 text-[#7F56D9]" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            {courseId ? "Upload Your Course Lessons" : "Create a New Course"}
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            {courseId
              ? "Add at least 2 audio or video lessons, then publish when ready."
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

            <FieldShell icon={<QrCode size={18} />} label="Payment QR Code">
              <label
                className={`mt-1 flex items-center gap-2 rounded-lg border border-dashed border-gray-700 px-3 py-2.5 text-xs text-gray-400 transition-colors ${
                  uploadingQR
                    ? "opacity-50"
                    : "cursor-pointer hover:border-[#7F56D9] hover:text-[#7F56D9]"
                }`}
              >
                {uploadingQR ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : QRFilePath ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <UploadCloud size={16} />
                )}
                {uploadingQR
                  ? "Uploading QR..."
                  : QRFile
                  ? QRFile.name
                  : "Browse QR code screenshot"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingQR}
                  onChange={(e) => createQR(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {QRFilePath && (
                <img
                  src={QRFilePath}
                  alt="Payment QR code preview"
                  className="mt-3 h-28 w-28 rounded-lg border border-gray-800 object-contain bg-white p-1"
                />
              )}

              {QRError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                  <XCircle size={13} /> {QRError}
                </p>
              )}
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

        {/* --- PHASE 2: AUDIO / VIDEO UPLOAD --- */}
        {courseId && (
          <div className="rounded-[24px] bg-[#13131A] p-8 shadow-2xl space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-gray-400 font-medium">
                  {uploadedCount} of {MAX_MEDIA_SLOTS} lessons uploaded
                </span>
                <span
                  className={
                    uploadedCount >= MIN_MEDIA_TO_PUBLISH
                      ? "text-emerald-400 font-medium"
                      : "text-gray-500"
                  }
                >
                  {uploadedCount >= MIN_MEDIA_TO_PUBLISH
                    ? "Ready to publish"
                    : `${MIN_MEDIA_TO_PUBLISH - uploadedCount} more needed to publish`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7F56D9] transition-all duration-500"
                  style={{ width: `${(uploadedCount / MAX_MEDIA_SLOTS) * 100}%` }}
                />
              </div>
            </div>

            {/* Media Slots List */}
            <div className="space-y-3">
              {mediaSlots.map((item, index) => {
                const isAudio = item.file?.type?.startsWith("audio/");
                const isVideo = item.file?.type?.startsWith("video/");

                return (
                  <div
                    key={item.localId}
                    className="rounded-xl bg-[#1C1C24] border border-gray-800 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        {isAudio ? (
                          <FileAudio size={14} className="text-amber-400" />
                        ) : isVideo ? (
                          <Video size={14} className="text-indigo-400" />
                        ) : (
                          <Film size={14} />
                        )}
                        Lesson {index + 1}
                      </span>

                      {item.status === "done" && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 size={14} /> Uploaded
                        </span>
                      )}
                      {item.status === "uploading" && (
                        <span className="flex items-center gap-1 text-xs text-[#7F56D9]">
                          <Loader2 size={14} className="animate-spin" /> Uploading...
                        </span>
                      )}
                      {item.status === "idle" && mediaSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMediaSlot(item.localId)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                          aria-label="Remove lesson slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {item.status !== "done" && (
                      <>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateMediaField(item.localId, { name: e.target.value })
                          }
                          placeholder="Lesson title (e.g. Lesson 1: Vocal Warmups)"
                          disabled={item.status === "uploading"}
                          className="w-full bg-[#0F0F14] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7F56D9] transition-all disabled:opacity-50"
                        />

                        <label
                          className={`flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 py-3 text-xs text-gray-400 transition-colors ${
                            item.status === "uploading"
                              ? "opacity-50"
                              : "cursor-pointer hover:border-[#7F56D9] hover:text-[#7F56D9]"
                          }`}
                        >
                          <UploadCloud size={16} />
                          {item.file ? item.file.name : "Choose audio or video file"}
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,audio/mpeg,audio/mp3,audio/wav,audio/aac,audio/ogg,audio/m4a"
                            disabled={item.status === "uploading"}
                            onChange={(e) =>
                              updateMediaField(item.localId, {
                                file: e.target.files?.[0] || null,
                                status: "idle",
                                error: null,
                              })
                            }
                            className="hidden"
                          />
                        </label>

                        {item.error && (
                          <p className="flex items-center gap-1.5 text-xs text-red-400">
                            <XCircle size={13} /> {item.error}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() => uploadOneMedia(item)}
                          disabled={
                            item.status === "uploading" ||
                            !item.file ||
                            !item.name.trim()
                          }
                          className="w-full text-xs font-semibold text-[#7F56D9] border border-[#7F56D9]/40 rounded-lg py-2 hover:bg-[#7F56D9]/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                          Upload this lesson
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Bar for Adding Slots & Bulk Uploading */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {canAddMoreSlots && (
                <button
                  type="button"
                  onClick={addMediaSlot}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 border border-gray-800 bg-[#1C1C24] hover:bg-gray-800/60 text-xs font-medium text-gray-300 py-2.5 rounded-xl transition-all"
                >
                  <Plus size={14} /> Add Lesson Slot
                </button>
              )}

              {pendingCount > 1 && (
                <button
                  type="button"
                  onClick={uploadAllPending}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 border border-[#7F56D9]/40 bg-[#7F56D9]/10 hover:bg-[#7F56D9]/20 text-xs font-medium text-[#7F56D9] py-2.5 rounded-xl transition-all"
                >
                  <UploadCloud size={14} /> Upload All Ready ({pendingCount})
                </button>
              )}
            </div>

            {/* Final Publish Button */}
            <div className="pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handlePublish}
                disabled={
                  publishing ||
                  uploadedCount < MIN_MEDIA_TO_PUBLISH ||
                  mediaSlots.some((m) => m.status === "uploading")
                }
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#7F56D9] py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-200 hover:bg-[#6C47C2] active:scale-[0.99] focus:outline-none shadow-lg shadow-purple-600/20 disabled:opacity-40"
              >
                {publishing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Rocket size={16} /> Publish Course
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}