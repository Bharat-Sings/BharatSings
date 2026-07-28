import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import aboutPageGuitarPerson from "../../Images/aboutPageGuitarPerson.png";
import aboutPageFlutePerson from "../../Images/aboutPageFlutePerson.png";
import aboutPagePiano from "../../Images/aboutPagePiano.png";

function About() {
    // Animation configuration presets for cleaner code structure
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const keyOfferings = [
        { icon: "🎤", text: "Showcase Your Talent" },
        { icon: "💬", text: "Community Reviews" },
        { icon: "🤝", text: "Collaborate with Artists" },
        { icon: "🎓", text: "Learn from Trainers" },
        { icon: "🏆", text: "Leaderboards" },
        { icon: "🎼", text: "Music Marketplace" }
    ];

    return (
        <div className="bg-slate-50 min-h-screen w-full overflow-x-hidden antialiased text-slate-800">
            {/* Title / Intro Banner Section */}
            <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 py-16 md:py-24 text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_100%)]" />
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4"
                >
                    About Bharat Sings
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                >
                    Empowering the voice of a billion creators, one melody at a time.
                </motion.p>
            </div>

            {/* Core Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 md:space-y-40">
                
                {/* 1. Our Mission Section (Text Left, Image Right) */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                    <motion.div variants={fadeInRight} className="md:col-span-7 space-y-4">
                        <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 block">Our Purpose</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Mission</h2>
                        <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">
                            Bharat Sings is a community-driven platform built to empower singers, musicians, and music creators. Our mission is to help talented artists showcase their work, receive valuable feedback, connect with fellow creators, and grow their musical journey.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeInLeft} className="md:col-span-5 relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                        <Image 
                            alt="About Bharat Sings - Guitar performance" 
                            src={aboutPageGuitarPerson}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </motion.div>
                </motion.div>

                {/* 2. Our Vision Section (Image Left, Text Right) */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                    <motion.div variants={fadeInRight} className="md:col-span-5 md:order-1 order-2 relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                        <Image 
                            alt="About Bharat Sings - Flute player" 
                            src={aboutPageFlutePerson}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </motion.div>
                    <motion.div variants={fadeInLeft} className="md:col-span-7 md:order-2 order-1 space-y-4">
                        <span className="text-xs uppercase font-bold tracking-widest text-violet-600 block">Future Framework</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Vision</h2>
                        <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">
                            We envision Bharat Sings as a platform where every aspiring artist can learn, collaborate, and find opportunities, regardless of their background or experience. We aim to democratize the music industry.
                        </p>
                    </motion.div>
                </motion.div>

                {/* 3. What We Offer Section (Text Left, Image Right) */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                    <motion.div variants={fadeInRight} className="md:col-span-7 space-y-6">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block">Features</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">What We Offer</h2>
                        </div>
                        
                        {/* Interactive List Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {keyOfferings.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center space-x-3 bg-white border border-slate-100 p-3 rounded-xl shadow-sm"
                                >
                                    <span className="text-xl bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                                        {item.icon}
                                    </span>
                                    <span className="font-semibold text-slate-700 text-sm md:text-base">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div variants={fadeInLeft} className="md:col-span-5 relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                        <Image 
                            alt="About Bharat Sings - Piano Keys" 
                            src={aboutPagePiano}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
}

export default About;
