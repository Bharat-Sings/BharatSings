"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTrainerAuth } from "../context/TrainerAuthContext";

import landingPageTopSection from "../Images/landingPageTopSection.png";
import landingPageSinger from "../Images/landingPageSinger.jpg";
import landingPageMusicSign from "../Images/landingPageMusicSign.png";
import landingPageGuitar from "../Images/landingPageGuitar.png";

/* Scroll-reveal hook: fades/slides a section in once it enters the
   viewport. No extra dependency — plain IntersectionObserver. */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(node);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
}

const FEATURES = [
    {
        title: "Guided singing feedback",
        desc: "Structured ratings on melody, rhythm, pitch, and voice help you see exactly where to improve next.",
    },
    {
        title: "Courses from real trainers",
        desc: "Learn technique and repertoire from working singers and musicians, at a pace that fits your schedule.",
    },
    {
        title: "A community of artists",
        desc: "Share your recordings, discover new genres, and connect with people who take music as seriously as you do.",
    },
    {
        title: "A place to be discovered",
        desc: "Build a public profile that showcases your best work to collaborators, trainers, and listeners.",
    },
];

const STEPS = [
    { label: "Create your profile", desc: "Set up your artist page in minutes." },
    { label: "Upload your music", desc: "Share songs and get them heard." },
    { label: "Learn and improve", desc: "Take feedback and courses to grow." },
    { label: "Connect and perform", desc: "Collaborate with artists across India." },
];

function SoundwaveRings() {
    // The page's signature visual: soft concentric soundwave arcs behind
    // the hero image, gently animating — a nod to the product itself
    // (singing/performance) rather than a generic decorative blob.
    return (
        <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full -z-10 soundwave-rings"
            aria-hidden="true"
        >
            <circle cx="200" cy="200" r="120" fill="none" stroke="#7e22ce" strokeOpacity="0.15" strokeWidth="2" />
            <circle cx="200" cy="200" r="155" fill="none" stroke="#7e22ce" strokeOpacity="0.10" strokeWidth="2" />
            <circle cx="200" cy="200" r="190" fill="none" stroke="#7e22ce" strokeOpacity="0.06" strokeWidth="2" />
        </svg>
    );
}

function Reveal({ children, className = "", delay = 0 }) {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { trainer, loading: trainerLoading } = useTrainerAuth();
    const [heroLoaded, setHeroLoaded] = useState(false);

    useEffect(() => {
        if (loading || trainerLoading) return;
        if (user) {
            router.replace("/dashboard");
        } else if (trainer) {
            router.replace("/trainerdashboard");
        }
    }, [user, loading, trainerLoading, trainer, router]);

    useEffect(() => {
        // Trigger the hero's entrance sequence shortly after mount.
        const t = setTimeout(() => setHeroLoaded(true), 60);
        return () => clearTimeout(t);
    }, []);

    if (loading || trainerLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
                <h1 className="text-lg font-medium text-[#6b21a8]">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="bg-[#FBF9F6] min-h-screen w-full overflow-x-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

                .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
                .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

                .reveal {
                    opacity: 0;
                    transform: translateY(28px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .reveal-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                @keyframes floatY {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .float-chip { animation: floatY 4.5s ease-in-out infinite; }
                .float-chip-delay { animation: floatY 5.5s ease-in-out infinite; animation-delay: 0.8s; }

                @keyframes ringPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.04); opacity: 0.85; }
                }
                .soundwave-rings { animation: ringPulse 6s ease-in-out infinite; transform-origin: center; }

                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hero-item {
                    opacity: 0;
                    animation: heroFadeUp 0.7s ease forwards;
                }

                .cta-btn { transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease, color 0.25s ease; }
                .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(126,34,206,0.35); }

                .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
                .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px -12px rgba(107,33,168,0.18); border-color: #d8b4fe; }

                @media (prefers-reduced-motion: reduce) {
                    .reveal, .hero-item { opacity: 1 !important; transform: none !important; animation: none !important; transition: none !important; }
                    .float-chip, .float-chip-delay, .soundwave-rings { animation: none !important; }
                    .cta-btn:hover, .feature-card:hover { transform: none !important; }
                }
            `}</style>

            {/* HERO */}
            <section className="relative max-w-7xl mx-auto px-6 lg:px-16 pt-14 pb-20 lg:pt-20 lg:pb-28">
                {/* Faint backdrop using the existing top-section artwork, for depth without duplicating the singer image */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] -z-20 overflow-hidden">
                    <Image
                        src={landingPageTopSection}
                        alt=""
                        className="w-full h-full object-cover opacity-[0.06]"
                        priority
                    />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-14">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <span
                            className="hero-item inline-block font-body text-xs font-semibold tracking-widest uppercase text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5"
                            style={{ animationDelay: heroLoaded ? "0ms" : "0ms" }}
                        >
                            For singers &amp; musicians
                        </span>

                        <h1
                            className="hero-item font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] font-semibold text-[#1A1523] mt-5"
                            style={{ animationDelay: "120ms" }}
                        >
                            Your music,{" "}
                            <span className="text-purple-700">heard by the right people.</span>
                        </h1>

                        <p
                            className="hero-item font-body text-lg text-[#4B4657] leading-relaxed mt-6 max-w-xl mx-auto lg:mx-0"
                            style={{ animationDelay: "240ms" }}
                        >
                            One platform for singers and musicians to showcase their talent,
                            connect with fellow artists, learn from expert trainers, and
                            build a lasting presence in the music community.
                        </p>

                        <div
                            className="hero-item flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-9"
                            style={{ animationDelay: "360ms" }}
                        >
                            <button
                                className="cta-btn bg-purple-700 text-white px-10 py-3 rounded-full font-semibold font-body text-base hover:bg-white hover:text-purple-700 border-2 border-purple-700"
                                onClick={() => {
                                    router.push("/RegisterUserOrTrainer");
                                }}
                            >
                                REGISTER
                            </button>

                            <button
                                className="cta-btn bg-white text-purple-700 px-10 py-3 rounded-full
                                font-semibold font-body text-base border-2 border-purple-700
                                hover:bg-purple-700 hover:text-white"
                                onClick={() => {
                                    router.push("/LoginUserOrTrainer");
                                }}
                            >
                                LOGIN
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-sm lg:max-w-md">
                            <SoundwaveRings />

                            <div className="hero-item" style={{ animationDelay: "180ms" }}>
                                <Image
                                    src={landingPageSinger}
                                    alt="Singer performing"
                                    className="rounded-2xl w-full h-auto shadow-[0_30px_60px_-20px_rgba(107,33,168,0.35)]"
                                />
                            </div>

                            {/* Decorative, non-numeric floating chips */}
                            <div className="hero-item float-chip absolute -left-5 top-8 hidden sm:flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-purple-100" style={{ animationDelay: "500ms" }}>
                                <span className="text-purple-700 text-lg" aria-hidden="true">🎤</span>
                                <span className="font-body text-xs font-semibold text-[#1A1523]">Live vocal feedback</span>
                            </div>

                            <div className="hero-item float-chip-delay absolute -right-4 bottom-10 hidden sm:flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-purple-100" style={{ animationDelay: "620ms" }}>
                                <span className="text-purple-700 text-lg" aria-hidden="true">🎸</span>
                                <span className="font-body text-xs font-semibold text-[#1A1523]">Built for musicians</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE GRID */}
            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
                <Reveal className="text-center mb-12">
                    <p className="font-body text-xs font-semibold tracking-widest uppercase text-purple-700 mb-3">
                        What you get
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1523]">
                        Everything you need to grow as an artist
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((f, i) => (
                        <Reveal key={f.title} delay={i * 90}>
                            <div className="feature-card h-full bg-white border border-purple-100 rounded-2xl p-6 text-left">
                                <h3 className="font-display text-lg font-semibold text-[#1A1523] mb-2">
                                    {f.title}
                                </h3>
                                <p className="font-body text-sm text-[#5C5768] leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* SECTION: EXPLORE SONGS */}
            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-14">
                    <Reveal className="lg:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-6 bg-purple-100/60 rounded-[2rem] -z-10 blur-2xl" aria-hidden="true" />
                            <Image
                                src={landingPageMusicSign}
                                alt="Music discovery"
                                className="w-full max-w-sm h-auto"
                            />
                        </div>
                    </Reveal>

                    <Reveal className="lg:w-1/2 text-center lg:text-left" delay={120}>
                        <p className="font-body text-xs font-semibold tracking-widest uppercase text-purple-700 mb-3">
                            Discover
                        </p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1523] leading-tight">
                            Explore songs from artists across every genre
                        </h2>
                        <p className="font-body text-lg text-[#4B4657] leading-relaxed mt-5 max-w-xl mx-auto lg:mx-0">
                            Browse a growing catalog of original music, find sounds that
                            match your taste, and support performances by talented
                            independent artists.
                        </p>

                        <button
                            className="cta-btn mt-9 bg-purple-700 text-white px-10 py-3
                            rounded-full font-semibold font-body text-base border-2 border-purple-700
                            hover:bg-white hover:text-purple-700"
                            onClick={() => {
                                router.push("/LoginUserOrTrainer");
                            }}
                        >
                            EXPLORE SONGS
                        </button>
                    </Reveal>
                </div>
            </section>

            {/* SECTION: FIND COURSES */}
            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20">
                <div className="flex flex-col lg:flex-row items-center gap-14">
                    <Reveal className="lg:w-1/2 text-center lg:text-left">
                        <p className="font-body text-xs font-semibold tracking-widest uppercase text-purple-700 mb-3">
                            Learn
                        </p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1523] leading-tight">
                            Learn from singers, musicians, and trainers who've done it
                        </h2>
                        <p className="font-body text-lg text-[#4B4657] leading-relaxed mt-5 max-w-xl mx-auto lg:mx-0">
                            Find structured courses that build real technique, from voice
                            control to stage presence, taught by working professionals.
                        </p>

                        <button
                            className="cta-btn mt-9 bg-purple-700 text-white px-10 py-3
                            rounded-full font-semibold font-body text-base border-2 border-purple-700
                            hover:bg-white hover:text-purple-700"
                            onClick={() => {
                                router.push("/LoginUserOrTrainer");
                            }}
                        >
                            FIND COURSES
                        </button>
                    </Reveal>

                    <Reveal className="lg:w-1/2 flex justify-center" delay={120}>
                        <div className="relative">
                            <div className="absolute -inset-6 bg-purple-100/60 rounded-[2rem] -z-10 blur-2xl" aria-hidden="true" />
                            <Image
                                src={landingPageGuitar}
                                alt="Learning guitar"
                                className="w-full max-w-lg h-auto"
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* HOW IT WORKS — a genuine sequence, so numbering earns its place */}
            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20">
                <Reveal className="text-center mb-14">
                    <p className="font-body text-xs font-semibold tracking-widest uppercase text-purple-700 mb-3">
                        Getting started
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1523]">
                        How BharatSings works
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map((step, i) => (
                        <Reveal key={step.label} delay={i * 100}>
                            <div className="text-center lg:text-left">
                                <div className="w-11 h-11 mx-auto lg:mx-0 rounded-full bg-purple-700 text-white font-display font-semibold flex items-center justify-center mb-4">
                                    {i + 1}
                                </div>
                                <h3 className="font-body font-semibold text-[#1A1523] mb-1.5">
                                    {step.label}
                                </h3>
                                <p className="font-body text-sm text-[#5C5768] leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>
        </div>
    );
}