"use client";

import React, { useMemo, useState } from "react";

/* ---------------------------------------------------------------
   Design tokens (see inline <style> block for fonts + keyframes)
   bg        #121319   base ink
   panel     #1B1D26   card surface
   panel-2   #15161D   recessed surface (rows, input tracks)
   border    #272A35   hairline
   accent    #E3A542   VU-meter amber (the one signature color)
   live      #4FD1C5   teal, reserved for "now playing" state only
----------------------------------------------------------------- */

const TABS = ["Packs", "Tracks", "Compositions"];

const ITEMS = [
  { id: 1, cat: "Packs", title: "Synthwave 808s", creator: "Komam Sorvena", price: 29.99, img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d", dur: "02:14" },
  { id: 2, cat: "Compositions", title: "Lofi Chords Vol 2", creator: "Ahmom Singer", price: 45, img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b", dur: "03:41" },
  { id: 3, cat: "Compositions", title: "Lofi Chords Vol 1", creator: "Ahmom Singer", price: 45, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", dur: "03:22" },
  { id: 4, cat: "Tracks", title: "Lom Chords Vol 2", creator: "Komam Sorvena", price: 45, img: "https://images.unsplash.com/photo-1506157786151-b8491531f063", dur: "01:58" },
  { id: 5, cat: "Packs", title: "Synthwave 808s", creator: "Komam Sorvena", price: 29.99, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819", dur: "02:14" },
  { id: 6, cat: "Tracks", title: "Synthwave 808s", creator: "Komam Sorvena", price: 29.99, img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b", dur: "02:09" },
  { id: 7, cat: "Compositions", title: "Lofi Chords Vol 2", creator: "Ahmom Singer", price: 45, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", dur: "03:41" },
  { id: 8, cat: "Packs", title: "Synthwave Volt", creator: "Ahmom Singer", price: 45, img: "https://images.unsplash.com/photo-1506157786151-b8491531f063", dur: "02:47" },
  { id: 9, cat: "Tracks", title: "Lofi Chords Vol 2", creator: "Ahmom Singer", price: 45, img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d", dur: "03:41" },
  { id: 10, cat: "Packs", title: "Synthwave 808s", creator: "Komam Sorvena", price: 29.99, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819", dur: "02:14" },
];

const SELLERS = [
  { id: 1, name: "Ahmom Singer", badge: "Top Seller", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" },
  { id: 2, name: "Dhama Sunaker", badge: "Top Seller", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
  { id: 3, name: "Miosh Ploares", badge: "Top Seller", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
  { id: 4, name: "Jiom Malas", badge: "Top Seller", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df" },
];

const SALES = [
  { id: 1, title: "Neon Bassline", handle: "@AlexProducer", value: 19.99, img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d" },
  { id: 2, title: "Neon Bassline", handle: "@AlexProducer", value: 19.99, img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b" },
  { id: 3, title: "Neon Bassline", handle: "@AlexProducer", value: 19.99, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f" },
  { id: 4, title: "Neon Bassline", handle: "@AlexProducer", value: 19.99, img: "https://images.unsplash.com/photo-1506157786151-b8491531f063" },
];

const BAR_HEIGHTS = [38, 62, 45, 80, 55, 68, 40, 72, 50, 28, 58, 76, 36, 85, 62, 44, 70, 54, 36, 66, 46, 80, 58, 36, 26, 50, 62, 40, 72, 48];

const CAT_PREFIX = { Packs: "PK", Tracks: "TR", Compositions: "CM" };

function money(n) {
  return `$${n.toFixed(2)}`;
}

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState("Packs");
  const [currentTrack, setCurrentTrack] = useState(ITEMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);

  const filtered = useMemo(() => ITEMS.filter((i) => i.cat === activeTab), [activeTab]);

  function handleListen(item) {
    if (currentTrack.id === item.id) {
      setIsPlaying((p) => !p);
    } else {
      setCurrentTrack(item);
      setIsPlaying(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#121319] text-[#F2F1ED] pb-40 md:pb-28" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
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
        input[type="range"].amber-range {
          accent-color: #E3A542;
        }
        .focus-ring:focus-visible {
          outline: 2px solid #E3A542;
          outline-offset: 2px;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#272A35] px-5 sm:px-8 py-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          Marketplace
        </h1>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#8B8FA0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5]" />
          {ITEMS.length} listings live
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 bg-[#1B1D26] p-1 rounded-full border border-[#272A35] w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`focus-ring px-4 sm:px-5 py-2 text-[11px] sm:text-xs rounded-full font-semibold uppercase tracking-wide transition-colors ${
                    activeTab === tab
                      ? "bg-[#E3A542] text-[#121319]"
                      : "text-[#8B8FA0] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] text-[#5B5F6E]">
              {filtered.length} results
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((item, index) => {
              const catalogNo = `${CAT_PREFIX[item.cat]}-${String(index + 1).padStart(3, "0")}`;
              const isCurrent = currentTrack.id === item.id;
              const listening = isCurrent && isPlaying;
              return (
                <div
                  key={item.id}
                  className={`bg-[#1B1D26] rounded-2xl p-3 border transition-colors flex flex-col ${
                    isCurrent ? "border-[#E3A542]" : "border-[#272A35] hover:border-[#3A3E4D]"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                    <span className="absolute top-2 left-2 font-mono text-[10px] tracking-wide bg-black/60 backdrop-blur-sm text-[#E3A542] px-2 py-0.5 rounded-md">
                      {catalogNo}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm mt-3 truncate">{item.title}</h3>
                  <p className="text-xs text-[#8B8FA0] truncate">{item.creator}</p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-mono font-semibold text-[#E3A542]">
                      {money(item.price)}
                    </span>
                    <button className="focus-ring bg-[#E3A542] hover:brightness-110 text-[#121319] px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition">
                      Buy
                    </button>
                  </div>

                  <button
                    onClick={() => handleListen(item)}
                    className="focus-ring w-full mt-2 bg-[#15161D] border border-[#272A35] hover:border-[#E3A542] text-[#8B8FA0] hover:text-white py-1.5 rounded-lg text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{listening ? "❚❚" : "▶"}</span>
                    {listening ? "Playing" : "Listen"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 xl:sticky xl:top-8">
          {/* Sell banner */}
          <div className="bg-[#1B1D26] p-5 rounded-2xl border border-[#272A35] space-y-3">
            <p className="font-mono text-[10px] tracking-widest text-[#E3A542] uppercase">
              Open a stall
            </p>
            <h2 className="font-display text-lg font-semibold">Sell your sounds</h2>
            <p className="text-xs text-[#8B8FA0]">
              List packs, tracks, or full compositions and get paid on every sale.
            </p>
            <button className="focus-ring w-full bg-[#E3A542] hover:brightness-110 text-[#121319] py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition">
              Create new listing
            </button>
          </div>

          {/* Featured sellers */}
          <div className="bg-[#1B1D26] p-5 rounded-2xl border border-[#272A35]">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8B8FA0] mb-4">
              Featured sellers
            </h2>
            <div className="space-y-4">
              {SELLERS.map((seller, index) => (
                <div
                  key={seller.id}
                  className="flex items-center justify-between gap-3 border-b border-[#272A35] pb-3 last:border-none last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-[#5B5F6E] w-4 shrink-0">
                      {index + 1}
                    </span>
                    <img
                      src={seller.img}
                      alt={seller.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#272A35]"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold truncate">{seller.name}</h4>
                      <p className="text-[10px] text-[#E3A542]">{seller.badge}</p>
                    </div>
                  </div>
                  <button className="focus-ring text-[10px] shrink-0 bg-[#15161D] border border-[#272A35] hover:border-[#3A3E4D] px-2.5 py-1.5 rounded-md text-[#8B8FA0] hover:text-white transition-colors">
                    View profile
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent sales */}
          <div className="bg-[#1B1D26] p-5 rounded-2xl border border-[#272A35]">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8B8FA0] mb-4">
              Recent sales
            </h2>
            <div className="space-y-3">
              {SALES.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between gap-3 bg-[#15161D] p-2.5 rounded-xl border border-[#272A35]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={sale.img}
                      alt={sale.title}
                      className="w-8 h-8 rounded-md object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold truncate">{sale.title}</h4>
                      <p className="font-mono text-[10px] text-[#5B5F6E] truncate">
                        {sale.handle}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#4FD1C5] shrink-0">
                    {money(sale.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom player */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#15161D]/95 backdrop-blur-sm border-t border-[#272A35] px-4 sm:px-8 py-3 z-50">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-6">
          {/* Track info */}
          <div className="flex items-center gap-3 w-full md:w-64 shrink-0 min-w-0">
            <img
              src={currentTrack.img}
              alt={currentTrack.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold truncate">{currentTrack.title}</h4>
              <p className="text-[10px] text-[#8B8FA0] truncate">{currentTrack.creator}</p>
            </div>
          </div>

          {/* Transport + waveform */}
          <div className="flex-1 w-full flex flex-col items-center gap-2 min-w-0">
            <div className="flex items-center gap-5 text-[#8B8FA0]">
              <button className="focus-ring hover:text-white transition-colors" aria-label="Previous track">
                ⏮
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="focus-ring bg-[#E3A542] hover:brightness-110 text-[#121319] rounded-full w-9 h-9 flex items-center justify-center transition"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button className="focus-ring hover:text-white transition-colors" aria-label="Next track">
                ⏭
              </button>
            </div>

            <div className="w-full flex items-center gap-3 font-mono text-[10px] text-[#5B5F6E]">
              <span className="w-9 text-right shrink-0">01:01</span>
              <div className="flex-1 h-6 flex items-end justify-center gap-[3px] overflow-hidden">
                {BAR_HEIGHTS.map((height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className={`w-[3px] rounded-full origin-bottom ${
                      isPlaying && index < 14 ? "bar-anim" : ""
                    } ${index < 14 ? "bg-[#E3A542]" : "bg-[#272A35]"}`}
                  />
                ))}
              </div>
              <span className="w-9 shrink-0">{currentTrack.dur}</span>
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
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
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
