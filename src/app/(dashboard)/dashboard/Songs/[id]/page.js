"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URI;

const genreWithId = {
  1: "Classical",
  2: "Pop",
  3: "Folk",
  4: "Instrumental",
  5: "Fusion",
};

const BAR_HEIGHTS = [40, 70, 50, 90, 60, 75, 45, 80, 55, 30, 65, 85, 40, 95, 70, 50, 80, 60, 40, 75, 50, 90, 65, 40, 30, 55, 70, 45, 80];

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function MusicImage({ className }) {
  return (
    <div className={`${className} bg-[#15161D] flex items-center justify-center`}>
      <svg viewBox="0 0 24 24" className="w-1/3 h-1/3 text-[#5B5F6E]" fill="none">
        <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.5-4.6-9.9-9.1C.5 8 2 4.5 5.6 4c2-.3 3.7.6 4.9 2.3l1.5 2 1.5-2C14.7 4.6 16.4 3.7 18.4 4c3.6.5 5.1 4 3.5 7.4C19.5 15.9 12 20.5 12 20.5z"
      />
    </svg>
  );
}

function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className="focus-ring text-lg leading-none transition-transform hover:scale-110"
        >
          <span className={n <= value ? "text-[#E3A542]" : "text-[#3A3E4D]"}>★</span>
        </button>
      ))}
    </div>
  );
}

function LikesDropdown({ likes, onClose }) {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-64 max-h-72 overflow-y-auto bg-[#1B1D26] border border-[#272A35] rounded-xl shadow-xl z-20 p-2"
      onMouseLeave={onClose}
    >
      {likes.length === 0 ? (
        <p className="text-xs text-[#5B5F6E] text-center py-4">No likes yet.</p>
      ) : (
        <ul className="space-y-1">
          {likes.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#15161D] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#15161D] border border-[#272A35] flex items-center justify-center shrink-0 text-[10px] font-semibold text-[#E3A542]">
                {(l.user?.display_name || "?").charAt(0).toUpperCase()}
              </div>
              <span className="text-sm truncate">{l.user?.display_name || "Anonymous"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StarRatingDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`text-xs ${n <= rating ? "text-[#E3A542]" : "text-[#3A3E4D]"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function ScoreSlider({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#C9CAD1] font-medium">{label}</span>
        <span className="font-mono text-[#E3A542]">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[#272A35] accent-[#E3A542] cursor-pointer"
      />
    </div>
  );
}

function ScoreBar({ label, value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8B8FA0]">{label}</span>
        <span className="font-mono text-[#E3A542]">{pct.toFixed(0)}</span>
      </div>
      <div className="h-2 rounded-full bg-[#272A35] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E3A542] to-[#F5D28A] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();

  // Prisma's Song.id / song_review.song_id are Int columns, but
  // useParams() always returns the route segment as a string — so it
  // has to be converted before being sent in any request.
  const rawId = params?.id;
  const id = rawId !== undefined ? Number(rawId) : undefined;
  const idIsValid = id !== undefined && !Number.isNaN(id);

  // --- Song + audio ---
  const [song, setSong] = useState(null);
  const [loadingSong, setLoadingSong] = useState(true);
  const [songError, setSongError] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);
  const audioRef = useRef(null);

  // --- Likes ---
  const [likes, setLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [likeBusy, setLikeBusy] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);

  // --- Structured reviews (melody/rhythm/pitch/voice, 0-100) ---
  const [structuredReviews, setStructuredReviews] = useState([]);
  const [loadingStructured, setLoadingStructured] = useState(true);
  const [melody, setMelody] = useState(50);
  const [rhythm, setRhythm] = useState(50);
  const [pitch, setPitch] = useState(50);
  const [voice, setVoice] = useState(50);
  const [submittingStructured, setSubmittingStructured] = useState(false);
  const [structuredSubmitError, setStructuredSubmitError] = useState(null);

  // --- Comments ---
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const authHeaders = useMemo(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    [accessToken]
  );

  // Fetch song + resolve its audio URL
  useEffect(() => {
    if (!idIsValid) return;
    let cancelled = false;

    async function loadSong() {
      setLoadingSong(true);
      setSongError(null);
      try {
        const res = await axios.get(`${API_BASE}/api/v1/songs/findSongById`, {
          params: { songId: id },
          headers: authHeaders,
        });
        const songData = res.data?.data?.song;
        if (!songData) throw new Error("Song not found");

        const audioFileId = songData.audio_file_id ?? songData.audioFileId;
        const genreId = songData.genre_id ?? songData.genreId;

        let url = null;
        if (audioFileId) {
          try {
            const audioRes = await axios.get(
              `${API_BASE}/api/v1/audiofiles/findAudioFileById`,
              { params: { audioFileId }, headers: authHeaders }
            );
            url = audioRes.data?.data?.audioFile?.url || null;
          } catch (err) {
            console.log("Could not resolve audio URL:", err);
          }
        }

        if (!cancelled) {
          setSong({
            id: songData.id,
            title: songData.title,
            description: songData.description,
            genre: genreWithId[genreId] || "Unspecified",
            uploader: songData.user?.display_name || "Unknown Artist",
            url,
          });
        }
      } catch (err) {
        console.log(err);
        if (!cancelled) setSongError(err.message || "Could not load this song.");
      } finally {
        if (!cancelled) setLoadingSong(false);
      }
    }

    loadSong();
    return () => {
      cancelled = true;
    };
  }, [id, idIsValid, authHeaders]);

  // Wire up the <audio> element to the resolved URL
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.url) return;
    audio.src = song.url;
    audio.load();
  }, [song?.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.url) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log(err);
        setPlaybackError("Couldn't play this track.");
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, song?.url]);

  const togglePlay = useCallback(() => {
    if (!song?.url) return;
    setPlaybackError(null);
    setIsPlaying((p) => !p);
  }, [song?.url]);

  // Fetch likes for this song
  const loadLikes = useCallback(async () => {
    if (!idIsValid) return;
    setLoadingLikes(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/likes/findLikesBySongId`, {
        params: { song_id: id },
        headers: authHeaders,
      });
      setLikes(res.data?.data?.likes || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLikes(false);
    }
  }, [id, idIsValid, authHeaders]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  const liked = useMemo(
    () => !!user && likes.some((l) => l.user_id === user.id),
    [likes, user]
  );

  const toggleLike = useCallback(async () => {
    if (!user) return;
    if (!idIsValid || likeBusy) return;

    setLikeBusy(true);
    try {
      const endpoint = liked
        ? `${API_BASE}/api/v1/likes/deleteLikeForSong`
        : `${API_BASE}/api/v1/likes/createLikeForSong`;

      await axios.post(
        endpoint,
        { user_id: user.id, song_id: id },
        { headers: authHeaders }
      );

      await loadLikes();
    } catch (err) {
      console.log(err);
    } finally {
      setLikeBusy(false);
    }
  }, [user, liked, id, idIsValid, likeBusy, authHeaders, loadLikes]);

  const progress = duration > 0 ? currentTime / duration : 0;
  const activeBars = Math.round(progress * BAR_HEIGHTS.length);

  // Fetch structured reviews for this song
  const loadStructuredReviews = useCallback(async () => {
    if (!idIsValid) return;
    setLoadingStructured(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/v1/structuredreviews/findStructuredReviewsBySongId`,
        { params: { songId: id }, headers: authHeaders }
      );
      setStructuredReviews(res.data?.data?.structuredReviews || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStructured(false);
    }
  }, [id, idIsValid, authHeaders]);

  useEffect(() => {
    loadStructuredReviews();
  }, [loadStructuredReviews]);

  // A user can only submit one structured review per song (unique
  // constraint on the backend, no update endpoint) — so once they have
  // one, show it instead of the form.
  const myStructuredReview = useMemo(
    () => (user ? structuredReviews.find((r) => r.userId === user.id) : undefined),
    [structuredReviews, user]
  );

  const structuredAverages = useMemo(() => {
    if (structuredReviews.length === 0) return null;
    const sum = structuredReviews.reduce(
      (acc, r) => ({
        melody: acc.melody + r.melody,
        rhythm: acc.rhythm + r.rhythm,
        pitch: acc.pitch + r.pitch,
        voice: acc.voice + r.voice,
      }),
      { melody: 0, rhythm: 0, pitch: 0, voice: 0 }
    );
    const n = structuredReviews.length;
    return {
      melody: sum.melody / n,
      rhythm: sum.rhythm / n,
      pitch: sum.pitch / n,
      voice: sum.voice / n,
    };
  }, [structuredReviews]);

  const handleSubmitStructuredReview = async () => {
    if (!user || !idIsValid) return;

    setStructuredSubmitError(null);
    setSubmittingStructured(true);
    try {
      await axios.post(
        `${API_BASE}/api/v1/structuredreviews/createStructuredReview`,
        { songId: id, userId: user.id, melody, rhythm, pitch, voice },
        { headers: authHeaders }
      );
      await loadStructuredReviews();
    } catch (err) {
      console.log(err);
      setStructuredSubmitError(
        err.response?.data?.message || "Couldn't submit your rating. Try again."
      );
    } finally {
      setSubmittingStructured(false);
    }
  };

  // Fetch comments
  const loadComments = useCallback(async () => {
    if (!idIsValid) return;
    setLoadingComments(true);
    setCommentsError(null);
    try {
      const res = await axios.get(
        `${API_BASE}/api/v1/songreviews/findSongReviewsBySongId`,
        { params: { song_id: id }, headers: authHeaders }
      );
      const list = res.data?.data?.songReviews || [];
      setComments(list);
    } catch (err) {
      console.log(err);
      setCommentsError("Couldn't load comments.");
    } finally {
      setLoadingComments(false);
    }
  }, [id, idIsValid, authHeaders]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    setPostError(null);

    if (!user) {
      setPostError("Please log in to comment.");
      return;
    }
    if (!reviewText.trim()) {
      setPostError("Write something before posting.");
      return;
    }

    setPosting(true);
    try {
      await axios.post(
        `${API_BASE}/api/v1/songreviews/createSongReview`,
        {
          user_id: user.id,
          song_id: id,
          review_text: reviewText.trim(),
          rating,
        },
        { headers: authHeaders }
      );

      setReviewText("");
      setRating(5);
      await loadComments();
    } catch (err) {
      console.log(err);
      setPostError(
        err.response?.data?.message || "Couldn't post your comment. Try again."
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#121319] text-[#F2F1ED]" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .bar-anim { animation: barPulse 1.1s ease-in-out infinite; will-change: transform; }
        @keyframes barPulse {
          0%, 100% { transform: scaleY(0.55); }
          50% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bar-anim { animation: none; }
        }
        .focus-ring:focus-visible { outline: 2px solid #E3A542; outline-offset: 2px; }
      `}</style>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setPlaybackError("Couldn't load this track's audio.");
          setIsPlaying(false);
        }}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-8">
        <button
          onClick={() => router.back()}
          className="focus-ring text-xs text-[#8B8FA0] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to songs
        </button>

        {loadingSong && (
          <p className="text-sm text-[#5B5F6E] py-12 text-center">Loading song...</p>
        )}

        {!loadingSong && songError && (
          <div className="bg-[#1B1D26] rounded-xl p-6 border border-[#272A35] text-sm text-[#8B8FA0]">
            {songError}
          </div>
        )}

        {!loadingSong && song && (
          <>
            {/* Song hero card */}
            <div className="bg-[#1B1D26] rounded-2xl p-5 sm:p-8 border border-[#272A35] space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <MusicImage className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl shrink-0" />

                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight truncate">
                    {song.title}
                  </h1>
                  <p className="text-sm text-[#8B8FA0] mt-1">{song.uploader}</p>
                  <span className="inline-block mt-2 text-[11px] bg-[#15161D] border border-[#272A35] text-[#8B8FA0] px-2.5 py-1 rounded-full">
                    {song.genre}
                  </span>
                  {song.description && (
                    <p className="text-sm text-[#8B8FA0] mt-3 leading-relaxed">
                      {song.description}
                    </p>
                  )}
                </div>

                {/* Like button + likers dropdown */}
                <div className="relative shrink-0">
                  <div
                    className={`flex items-center rounded-full border overflow-hidden ${
                      liked
                        ? "bg-[#E3A542]/15 border-[#E3A542] text-[#E3A542]"
                        : "bg-[#15161D] border-[#272A35] text-[#8B8FA0]"
                    }`}
                  >
                    <button
                      onClick={toggleLike}
                      disabled={!user || likeBusy}
                      title={!user ? "Log in to like this song" : undefined}
                      className="focus-ring flex items-center gap-2 pl-4 pr-3 py-2 hover:text-white transition disabled:opacity-50 disabled:hover:text-inherit"
                      aria-pressed={liked}
                    >
                      <HeartIcon filled={liked} />
                    </button>
                    <button
                      onClick={() => setLikesOpen((o) => !o)}
                      className="focus-ring pr-4 pl-1 py-2 text-sm font-semibold hover:text-white transition border-l border-[#272A35]"
                    >
                      {loadingLikes ? "…" : likes.length}
                    </button>
                  </div>

                  {likesOpen && (
                    <LikesDropdown likes={likes} onClose={() => setLikesOpen(false)} />
                  )}
                </div>
              </div>

              {/* Player */}
              <div className="border-t border-[#272A35] pt-5 space-y-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    disabled={!song.url}
                    className="focus-ring w-12 h-12 rounded-full bg-[#E3A542] hover:brightness-110 text-[#121319] flex items-center justify-center transition disabled:opacity-40 shrink-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <span className="text-lg">{isPlaying ? "❚❚" : "▶"}</span>
                  </button>

                  <div className="flex-1 flex items-center gap-3 font-mono text-[10px] text-[#5B5F6E] min-w-0">
                    <span className="shrink-0 w-9 text-right">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-6 flex items-end justify-center gap-[3px] overflow-hidden">
                      {BAR_HEIGHTS.map((height, index) => (
                        <div
                          key={index}
                          style={{ height: `${height}%` }}
                          className={`w-[3px] rounded-full origin-bottom ${
                            isPlaying && index < activeBars ? "bar-anim" : ""
                          } ${index < activeBars ? "bg-[#E3A542]" : "bg-[#272A35]"}`}
                        />
                      ))}
                    </div>
                    <span className="shrink-0 w-9">
                      -{formatTime(Math.max(duration - currentTime, 0))}
                    </span>
                  </div>
                </div>

                {!song.url && (
                  <p className="text-xs text-[#5B5F6E]">Audio isn't available for this song yet.</p>
                )}
                {playbackError && (
                  <p className="text-xs text-[#8B8FA0]">{playbackError}</p>
                )}
              </div>
            </div>

            {/* Structured review card */}
            <div className="bg-[#1B1D26] rounded-2xl p-5 sm:p-8 border border-[#272A35] space-y-6">
              <div>
                <h2 className="font-display text-lg font-semibold">Structured Rating</h2>
                <p className="text-xs text-[#8B8FA0] mt-1">
                  Rate melody, rhythm, pitch, and voice from 0–100. Optional — you can also just leave a comment below, or both.
                </p>
              </div>

              {/* Community averages */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5B5F6E] mb-3">
                  Community average
                  {structuredReviews.length > 0 &&
                    ` · ${structuredReviews.length} rating${structuredReviews.length === 1 ? "" : "s"}`}
                </p>

                {loadingStructured ? (
                  <p className="text-xs text-[#5B5F6E]">Loading ratings...</p>
                ) : structuredAverages ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <ScoreBar label="Melody" value={structuredAverages.melody} />
                    <ScoreBar label="Rhythm" value={structuredAverages.rhythm} />
                    <ScoreBar label="Pitch" value={structuredAverages.pitch} />
                    <ScoreBar label="Voice" value={structuredAverages.voice} />
                  </div>
                ) : (
                  <p className="text-xs text-[#5B5F6E]">No ratings yet — be the first to rate this song.</p>
                )}
              </div>

              {/* Your rating: form, or your submitted scores */}
              <div className="border-t border-[#272A35] pt-5">
                {!user ? (
                  <p className="text-sm text-[#8B8FA0]">Log in to rate this song.</p>
                ) : myStructuredReview ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#5B5F6E] mb-3">
                      Your rating
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      <ScoreBar label="Melody" value={myStructuredReview.melody} />
                      <ScoreBar label="Rhythm" value={myStructuredReview.rhythm} />
                      <ScoreBar label="Pitch" value={myStructuredReview.pitch} />
                      <ScoreBar label="Voice" value={myStructuredReview.voice} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <p className="text-[10px] uppercase tracking-widest text-[#5B5F6E]">
                      Your rating
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                      <ScoreSlider label="Melody" value={melody} onChange={setMelody} />
                      <ScoreSlider label="Rhythm" value={rhythm} onChange={setRhythm} />
                      <ScoreSlider label="Pitch" value={pitch} onChange={setPitch} />
                      <ScoreSlider label="Voice" value={voice} onChange={setVoice} />
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      {structuredSubmitError && (
                        <p className="text-xs text-[#E3A542]">{structuredSubmitError}</p>
                      )}
                      <button
                        onClick={handleSubmitStructuredReview}
                        disabled={submittingStructured}
                        className="focus-ring ml-auto px-5 py-2 bg-[#E3A542] text-[#121319] text-xs font-semibold rounded-full hover:brightness-110 transition disabled:opacity-50"
                      >
                        {submittingStructured ? "Submitting..." : "Submit Rating"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments section */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold">
                Comments {comments.length > 0 && `(${comments.length})`}
              </h2>

              {/* Post a comment */}
              <div className="bg-[#1B1D26] rounded-xl p-4 sm:p-5 border border-[#272A35] space-y-3">
                {!user ? (
                  <p className="text-sm text-[#8B8FA0]">
                    Log in to leave a comment.
                  </p>
                ) : (
                  <form onSubmit={handlePostComment} className="space-y-3">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts on this song..."
                      rows={3}
                      className="focus-ring w-full bg-[#15161D] border border-[#272A35] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E3A542] placeholder:text-[#5B5F6E] resize-none"
                    />

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-xs text-[#8B8FA0]">
                        <span>Rating:</span>
                        <StarRatingInput value={rating} onChange={setRating} />
                      </div>

                      <button
                        type="submit"
                        disabled={posting}
                        className="focus-ring px-5 py-2 bg-[#E3A542] text-[#121319] text-xs font-semibold rounded-full hover:brightness-110 transition disabled:opacity-50"
                      >
                        {posting ? "Posting..." : "Post Comment"}
                      </button>
                    </div>

                    {postError && (
                      <p className="text-xs text-[#E3A542]">{postError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Comments list */}
              {loadingComments && (
                <p className="text-sm text-[#5B5F6E] py-6 text-center">Loading comments...</p>
              )}

              {!loadingComments && commentsError && (
                <p className="text-sm text-[#8B8FA0] py-4 text-center">{commentsError}</p>
              )}

              {!loadingComments && !commentsError && comments.length === 0 && (
                <p className="text-sm text-[#5B5F6E] py-6 text-center">
                  No comments yet — be the first to share your thoughts.
                </p>
              )}

              {!loadingComments && comments.length > 0 && (
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#1B1D26] rounded-xl p-4 border border-[#272A35] flex gap-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#15161D] border border-[#272A35] flex items-center justify-center shrink-0 text-xs font-semibold text-[#E3A542]">
                        {(c.user?.display_name || "?").charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold truncate">
                            {c.user?.display_name || "Anonymous"}
                          </span>
                          <StarRatingDisplay rating={c.rating} />
                        </div>
                        <p className="text-sm text-[#C9CAD1] mt-1 whitespace-pre-wrap break-words">
                          {c.review_text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}