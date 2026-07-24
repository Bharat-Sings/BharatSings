"use client";

import React, { useMemo, useState } from "react";

/* Shared design system with Marketplace.jsx
   bg #121319 · panel #1B1D26 · panel-2 #15161D · border #272A35
   accent #E3A542 (amber) · live #4FD1C5 (teal, reserved for ratings/status) */

const TRACKS = [
  { id: 1, title: "The of the Yaong", artist: "Artist Sing", genre: "Ambient", mood: "Frowom", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063" },
  { id: 2, title: "Bawkanna", artist: "Komam Sorvena", genre: "Synthwave", mood: "Mood", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d" },
  { id: 3, title: "Death Mona", artist: "Resior", genre: "Downtempo", mood: "Rhythm", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b" },
  { id: 4, title: "Niasaria", artist: "Jaati Absara", genre: "Lofi", mood: "Mood", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f" },
  { id: 5, title: "The Monn Kindr...", artist: "Artist Sing", genre: "Ambient", mood: "Emotion", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819" },
];

const LEADERS = [
  { id: 1, name: "Ahmom Singer", type: "Singer", tag: "Singer/Musicians", rating: 4.0, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", activeBtn: "Hire" },
  { id: 2, name: "Deltall Musician", type: "Musician", tag: "Singer/Musicians", rating: 4.0, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", activeBtn: "Hire" },
  { id: 3, name: "Dhama Sunaker", type: "Singer", tag: "Band", rating: 4.5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", activeBtn: "Collaborate" },
  { id: 4, name: "Sharar Shara", type: "Singer", tag: "Composers", rating: 4.0, img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df", activeBtn: "Collaborate" },
];

const CHIPS = ["All", "Singer/Musicians", "Band", "Composers"];

const BAR_HEIGHTS = [40, 70, 50, 90, 60, 75, 45, 80, 55, 30, 65, 85, 40, 95, 70, 50, 80, 60, 40, 75, 50, 90, 65, 40, 30, 55, 70, 45, 80];

export default function SongsPage() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("All");
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRACKS;
    return TRACKS.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredLeaders = useMemo(() => {
    if (chip === "All") return LEADERS;
    return LEADERS.filter((l) => l.tag === chip);
  }, [chip]);

  function handleListen(track) {
    if (currentTrack.id === track.id) {
      setIsPlaying((p) => !p);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#121319] text-[#F2F1ED] pb-40 md:pb-28" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .bar-anim { animation: barPulse 1.1s ease-in-out infinite; }
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

      <div className="max-w-[1400px] mx-auto p-5 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Songs
            </h1>

            {/* Staff picks */}
            <div className="bg-[#1B1D26] rounded-2xl p-5 sm:p-6 border border-[#272A35] flex flex-col md:flex-row gap-5 items-center">
              <div className="flex gap-3 shrink-0">
                {TRACKS.slice(0, 3).map((t) => (
                  <img
                    key={t.id}
                    src={t.img}
                    alt={t.title}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover"
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

            {/* Songs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredTracks.map((track) => {
                const isCurrent = currentTrack.id === track.id;
                const listening = isCurrent && isPlaying;
                return (
                  <div
                    key={track.id}
                    className={`bg-[#1B1D26] rounded-xl p-3 border transition-colors flex flex-col ${
                      isCurrent ? "border-[#E3A542]" : "border-[#272A35] hover:border-[#3A3E4D]"
                    }`}
                  >
                    <img
                      src={track.img}
                      alt={track.title}
                      className="w-full aspect-square rounded-lg object-cover mb-3"
                    />

                    <h3 className="text-sm font-semibold truncate">{track.title}</h3>
                    <p className="text-xs text-[#8B8FA0] truncate">{track.artist}</p>

                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] bg-[#15161D] border border-[#272A35] text-[#8B8FA0] px-2 py-0.5 rounded-full">
                        {track.genre}
                      </span>
                      <span className="text-[10px] bg-[#15161D] border border-[#272A35] text-[#8B8FA0] px-2 py-0.5 rounded-full">
                        {track.mood}
                      </span>
                    </div>

                    <button
                      onClick={() => handleListen(track)}
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
              {filteredTracks.length === 0 && (
                <p className="col-span-full text-sm text-[#5B5F6E] py-8 text-center">
                  No songs match your search.
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
                  placeholder="Search for artists or songs"
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
                      <img
                        src={leader.img}
                        alt={leader.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#272A35]"
                      />
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
            <img
              src={currentTrack.img}
              alt={currentTrack.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold truncate">{currentTrack.title}</h4>
              <p className="text-[10px] text-[#8B8FA0] truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex-1 w-full flex flex-col items-center gap-2 min-w-0">
            <div className="flex items-center gap-5 text-[#8B8FA0]">
              <button className="focus-ring hover:text-white transition-colors" aria-label="Previous track">
                ⏮
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="focus-ring w-9 h-9 rounded-full bg-[#E3A542] hover:brightness-110 text-[#121319] flex items-center justify-center transition"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button className="focus-ring hover:text-white transition-colors" aria-label="Next track">
                ⏭
              </button>
            </div>

            <div className="w-full flex items-center gap-3 font-mono text-[10px] text-[#5B5F6E]">
              <span className="shrink-0 w-9 text-right">00:00</span>
              <div className="flex-1 h-6 flex items-end justify-center gap-[3px] overflow-hidden">
                {BAR_HEIGHTS.map((height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className={`w-[3px] rounded-full origin-bottom ${
                      isPlaying && index < 12 ? "bar-anim" : ""
                    } ${index < 12 ? "bg-[#E3A542]" : "bg-[#272A35]"}`}
                  />
                ))}
              </div>
              <span className="shrink-0 w-9">-0:33</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="w-full md:w-56 shrink-0 flex items-center justify-center md:justify-end gap-4 text-[#8B8FA0]">
            <button className="focus-ring hover:text-white text-[11px] uppercase tracking-wide transition-colors">
              Loop
            </button>
            <button className="focus-ring hover:text-white text-[11px] uppercase tracking-wide transition-colors">
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