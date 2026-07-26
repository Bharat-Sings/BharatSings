"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/* Shared design system with Marketplace.jsx
   bg #121319 · panel #1B1D26 · panel-2 #15161D · border #272A35
   accent #E3A542 (amber) · live #4FD1C5 (teal, reserved for ratings/status) */

const API_BASE = process.env.BACKEND_URI;

// Same mapping used on the upload page.
const genreWithId = {
  1: "Classical",
  2: "Pop",
  3: "Folk",
  4: "Instrumental",
  5: "Fusion",
};

// Single shared placeholder used for every song (no per-song artwork
// exists in the schema). Swap this for a real <img src="..."> if you
// have a hosted cover image you'd like to use instead.
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

const CHIPS = ["All", "Singer/Musicians", "Band", "Composers"];

const BAR_HEIGHTS = [40, 70, 50, 90, 60, 75, 45, 80, 55, 30, 65, 85, 40, 95, 70, 50, 80, 60, 40, 75, 50, 90, 65, 40, 30, 55, 70, 45, 80];

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SongsPage() {
  const router = useRouter();

  // No fake persons — leaderboard stays empty until you wire it to a real endpoint.
  const LEADERS = [];

  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("All");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);

  const audioRef = useRef(null);

  // Fetch real songs, then resolve each song's audio URL via its audioFileId
  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      setLoadingTracks(true);
      setFetchError(null);
      try {
        const res = await axios.get(`${API_BASE}/api/v1/songs/findSongs`);
        const songs = res.data?.data?.songs || [];

        const withAudio = await Promise.all(
          songs.map(async (song) => {
            try {
              const audioRes = await axios.get(
                `${API_BASE}/api/v1/audiofiles/findAudioFileById`,
                { params: { audioFileId: song.audio_file_id } }
              );
              const url = audioRes.data?.data?.audioFile?.url || null;

              return {
                id: song.id,
                title: song.title,
                genre: genreWithId[song.genreId] || "Unknown",
                uploader: song.user?.display_name || "Unknown Artist",
                url,
              };
            } catch (err) {
              console.log(err);
              return null;
            }
          })
        );

        const validTracks = withAudio.filter((t) => t && t.url);

        if (!cancelled) {
          setTracks(validTracks);
          if (validTracks.length > 0) setCurrentTrack(validTracks[0]);
        }
      } catch (err) {
        console.log(err);
        if (!cancelled) setFetchError(err.message || "Could not load songs.");
      } finally {
        if (!cancelled) setLoadingTracks(false);
      }
    }

    loadSongs();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter((t) => t.title.toLowerCase().includes(q));
  }, [query, tracks]);

  const filteredLeaders = useMemo(() => {
    if (chip === "All") return LEADERS;
    return LEADERS.filter((l) => l.tag === chip);
  }, [chip]);

  // Load new src whenever the current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setPlaybackError(null);
    setCurrentTime(0);
    setDuration(0);
    audio.src = currentTrack.url;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log(err);
        setPlaybackError("Couldn't play this track.");
        setIsPlaying(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // Play / pause in response to isPlaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log(err);
        setPlaybackError("Couldn't play this track.");
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Keep loop mode in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.loop = loop;
  }, [loop]);

  const goToTrack = useCallback((track, autoplay = true) => {
    setCurrentTrack(track);
    setIsPlaying(autoplay);
  }, []);

  const handleListen = useCallback(
    (track) => {
      if (currentTrack && currentTrack.id === track.id) {
        setIsPlaying((p) => !p);
      } else {
        goToTrack(track, true);
      }
    },
    [currentTrack, goToTrack]
  );

  // Navigates to /dashboard/Songs/[id] — used when the card itself
  // (not the Listen button) is clicked.
  const openSongPage = useCallback(
    (track) => {
      router.push(`/dashboard/Songs/${track.id}`);
    },
    [router]
  );

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying((p) => !p);
  }, [currentTrack]);

  const playAdjacent = useCallback(
    (direction) => {
      if (filteredTracks.length === 0 || !currentTrack) return;

      if (shuffle) {
        const others = filteredTracks.filter((t) => t.id !== currentTrack.id);
        const next = others.length
          ? others[Math.floor(Math.random() * others.length)]
          : currentTrack;
        goToTrack(next, true);
        return;
      }

      const idx = filteredTracks.findIndex((t) => t.id === currentTrack.id);
      const nextIdx =
        idx === -1
          ? 0
          : (idx + direction + filteredTracks.length) % filteredTracks.length;
      goToTrack(filteredTracks[nextIdx], true);
    },
    [filteredTracks, currentTrack, shuffle, goToTrack]
  );

  const handleVolumeChange = useCallback((e) => {
    const audio = audioRef.current;
    if (audio) audio.volume = Number(e.target.value) / 100;
  }, []);

  const progress = duration > 0 ? currentTime / duration : 0;
  const activeBars = Math.round(progress * BAR_HEIGHTS.length);

  const staffPicks = tracks.slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-[#121319] text-[#F2F1ED] pb-40 md:pb-28" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
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
        input[type="range"].amber-range { accent-color: #E3A542; }
        .focus-ring:focus-visible { outline: 2px solid #E3A542; outline-offset: 2px; }
      `}</style>

      {/* Hidden audio element driving real playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          if (!loop) playAdjacent(1);
        }}
        onError={() => {
          setPlaybackError("Couldn't load this track's audio.");
          setIsPlaying(false);
        }}
      />

      <div className="max-w-[1400px] mx-auto p-5 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Songs
            </h1>

            {fetchError && (
              <div className="bg-[#1B1D26] rounded-xl p-4 border border-[#272A35] text-sm text-[#8B8FA0]">
                {fetchError} — check that your backend is running at {API_BASE}.
              </div>
            )}

            {/* Staff picks */}
            {staffPicks.length > 0 && (
              <div className="bg-[#1B1D26] rounded-2xl p-5 sm:p-6 border border-[#272A35] flex flex-col md:flex-row gap-5 items-center">
                <div className="flex gap-3 shrink-0">
                  {staffPicks.map((t) => (
                    <MusicImage
                      key={t.id}
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg"
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] tracking-widest text-[#E3A542] uppercase">
                    Staff picks of the week
                  </p>
                  <h2 className="font-display text-xl font-semibold mt-1">Editor's choice</h2>
                  <div className="flex items-center gap-2 my-2 text-[#E3A542]">
                    <span aria-hidden="true">★★★★★</span>
                    <span className="font-mono text-xs text-[#8B8FA0]">4.5</span>
                  </div>
                  <p className="text-xs text-[#8B8FA0]">
                    Summarized review of the selected songs based on emotion, rhythm,
                    voice quality and audience response.
                  </p>
                </div>
              </div>
            )}

            {/* Songs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {loadingTracks && (
                <p className="col-span-full text-sm text-[#5B5F6E] py-8 text-center">
                  Loading songs...
                </p>
              )}

              {!loadingTracks &&
                filteredTracks.map((track) => {
                  const isCurrent = currentTrack && currentTrack.id === track.id;
                  const listening = isCurrent && isPlaying;
                  return (
                    <div
                      key={track.id}
                      onClick={() => openSongPage(track)}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") openSongPage(track);
                      }}
                      className={`cursor-pointer bg-[#1B1D26] rounded-xl p-3 border transition-colors flex flex-col ${
                        isCurrent ? "border-[#E3A542]" : "border-[#272A35] hover:border-[#3A3E4D]"
                      }`}
                    >
                      <MusicImage className="w-full aspect-square rounded-lg mb-3" />

                      <h3 className="text-sm font-semibold truncate">{track.title}</h3>
                      <p className="text-xs text-[#8B8FA0] truncate">{track.uploader}</p>

                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] bg-[#15161D] border border-[#272A35] text-[#8B8FA0] px-2 py-0.5 rounded-full">
                          {track.genre}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          // Don't let the click bubble up to the card
                          // and trigger navigation — just play/pause.
                          e.stopPropagation();
                          handleListen(track);
                        }}
                        className={`focus-ring w-full mt-3 text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                          listening
                            ? "bg-[#E3A542] text-[#121319]"
                            : "bg-[#F2F1ED] text-[#121319] hover:brightness-95"
                        }`}
                      >
                        <span aria-hidden="true">{listening ? "❚❚" : "▶"}</span>
                        {listening ? "Playing" : "Listen"}
                      </button>
                    </div>
                  );
                })}

              {!loadingTracks && filteredTracks.length === 0 && !fetchError && (
                <p className="col-span-full text-sm text-[#5B5F6E] py-8 text-center">
                  {tracks.length === 0 ? "No songs uploaded yet." : "No songs match your search."}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Search and filters */}
            <div className="bg-[#1B1D26] p-4 rounded-xl border border-[#272A35] space-y-3">
              <div className="relative">
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-[#5B5F6E]"
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
                  placeholder="Search for songs"
                  className="focus-ring w-full bg-[#15161D] border border-[#272A35] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#E3A542] placeholder:text-[#5B5F6E]"
                />
              </div>

              <div className="flex gap-2">
                <select className="focus-ring flex-1 min-w-0 bg-[#15161D] border border-[#272A35] rounded px-2 py-1.5 text-xs">
                  <option>Genre</option>
                </select>
                <select className="focus-ring flex-1 min-w-0 bg-[#15161D] border border-[#272A35] rounded px-2 py-1.5 text-xs">
                  <option>Mood</option>
                </select>
                <select className="focus-ring flex-1 min-w-0 bg-[#15161D] border border-[#272A35] rounded px-2 py-1.5 text-xs">
                  <option>Rhythm</option>
                </select>
              </div>
            </div>

            {/* Genre leaderboard */}
            <div className="bg-[#1B1D26] p-4 rounded-xl border border-[#272A35] space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8B8FA0]">
                Genre leaderboard
              </h2>

              <div className="flex gap-2 flex-wrap text-[11px]">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setChip(c)}
                    className={`focus-ring px-3 py-1 rounded-full font-medium transition-colors ${
                      chip === c
                        ? "bg-[#E3A542] text-[#121319]"
                        : "bg-[#15161D] border border-[#272A35] text-[#8B8FA0] hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredLeaders.map((leader, index) => (
                  <div
                    key={leader.id}
                    className="flex items-center justify-between gap-3 bg-[#15161D] p-2.5 rounded-lg border border-[#272A35]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs w-5 text-center shrink-0">
                        {index === 0 ? "👑" : index + 1}
                      </span>
                      <MusicImage className="w-9 h-9 rounded-full shrink-0 ring-1 ring-[#272A35]" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold truncate">{leader.name}</h4>
                        <p className="font-mono text-[10px] text-[#E3A542]">★ {leader.rating}</p>
                      </div>
                    </div>

                    <button
                      className={`focus-ring shrink-0 text-[11px] px-3 py-1.5 rounded-md font-semibold transition ${
                        leader.activeBtn === "Hire"
                          ? "bg-[#F2F1ED] text-[#121319] hover:brightness-95"
                          : "bg-[#15161D] text-[#E3A542] border border-[#E3A542]/50 hover:border-[#E3A542]"
                      }`}
                    >
                      {leader.activeBtn}
                    </button>
                  </div>
                ))}
                {filteredLeaders.length === 0 && (
                  <p className="text-xs text-[#5B5F6E] py-2 text-center">
                    No one in this category yet.
                  </p>
                )}
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              <button className="focus-ring bg-[#1B1D26] p-4 rounded-xl border border-[#272A35] hover:border-[#3A3E4D] min-h-[110px] flex flex-col justify-between text-left transition-colors">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8FA0]">
                  Top rated by users
                </span>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-8 h-8 rounded-full bg-[#E3A542]/15 flex items-center justify-center text-[#E3A542] shrink-0">
                    ↗
                  </div>
                  <span className="text-xs">View leaderboard</span>
                </div>
              </button>

              <button className="focus-ring bg-[#1B1D26] p-4 rounded-xl border border-[#272A35] hover:border-[#3A3E4D] min-h-[110px] flex flex-col justify-between text-left transition-colors">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8FA0]">
                  Featured collaborations
                </span>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-8 h-8 rounded-full bg-[#4FD1C5]/15 flex items-center justify-center text-[#4FD1C5] shrink-0">
                    ⇄
                  </div>
                  <span className="text-xs">Explore requests</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom player */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#15161D]/95 backdrop-blur-sm border-t border-[#272A35] px-4 sm:px-8 py-3 z-50">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-6">
          {/* Current song */}
          <div className="flex items-center gap-3 w-full md:w-64 shrink-0 min-w-0">
            <MusicImage className="w-10 h-10 rounded-lg shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold truncate">
                {currentTrack ? currentTrack.title : "Nothing playing"}
              </h4>
              <p className="text-[10px] text-[#8B8FA0] truncate">
                {playbackError || (currentTrack ? currentTrack.uploader : "Pick a song to start")}
              </p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex-1 w-full flex flex-col items-center gap-2 min-w-0">
            <div className="flex items-center gap-5 text-[#8B8FA0]">
              <button
                onClick={() => playAdjacent(-1)}
                disabled={!currentTrack}
                className="focus-ring hover:text-white transition-colors disabled:opacity-40"
                aria-label="Previous track"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                disabled={!currentTrack}
                className="focus-ring w-9 h-9 rounded-full bg-[#E3A542] hover:brightness-110 text-[#121319] flex items-center justify-center transition disabled:opacity-40"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button
                onClick={() => playAdjacent(1)}
                disabled={!currentTrack}
                className="focus-ring hover:text-white transition-colors disabled:opacity-40"
                aria-label="Next track"
              >
                ⏭
              </button>
            </div>

            <div className="w-full flex items-center gap-3 font-mono text-[10px] text-[#5B5F6E]">
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

          {/* Right controls */}
          <div className="w-full md:w-56 shrink-0 flex items-center justify-center md:justify-end gap-4 text-[#8B8FA0]">
            <button
              onClick={() => setLoop((l) => !l)}
              className={`focus-ring text-[11px] uppercase tracking-wide transition-colors ${
                loop ? "text-[#E3A542]" : "hover:text-white"
              }`}
            >
              Loop
            </button>
            <button
              onClick={() => setShuffle((s) => !s)}
              className={`focus-ring text-[11px] uppercase tracking-wide transition-colors ${
                shuffle ? "text-[#E3A542]" : "hover:text-white"
              }`}
            >
              Shuffle
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                onChange={handleVolumeChange}
                className="amber-range w-20"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}