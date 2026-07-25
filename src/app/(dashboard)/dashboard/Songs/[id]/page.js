"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE = "http://localhost:5000";

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

  // --- Likes (UI only, not wired up yet) ---
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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

  const toggleLike = useCallback(() => {
    // UI-only for now — no request is sent yet.
    setLiked((prev) => {
      setLikeCount((c) => c + (prev ? -1 : 1));
      return !prev;
    });
  }, []);

  const progress = duration > 0 ? currentTime / duration : 0;
  const activeBars = Math.round(progress * BAR_HEIGHTS.length);

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

                {/* Like button — UI only, no backend call yet */}
                <button
                  onClick={toggleLike}
                  className={`focus-ring shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                    liked
                      ? "bg-[#E3A542]/15 border-[#E3A542] text-[#E3A542]"
                      : "bg-[#15161D] border-[#272A35] text-[#8B8FA0] hover:text-white hover:border-[#3A3E4D]"
                  }`}
                  aria-pressed={liked}
                >
                  <HeartIcon filled={liked} />
                  <span className="text-sm font-semibold">{likeCount}</span>
                </button>
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