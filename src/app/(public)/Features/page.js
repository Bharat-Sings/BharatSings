import React from "react";
import Navbar from "../../Components/Navbar";
import featuresPageHeroSection from "../../Images/featuresPageHeroSection.png";
import Image from "next/image";

function Features() {
    const featuresList = [
        {
            title: "Showcase Your Talent",
            description: "Upload your singing performances and share your unique voice with a global community.",
            icon: "🎙️",
        },
        {
            title: "Explore Songs",
            description: "Discover tracks from various genres and immerse yourself in performances by talented artists.",
            icon: "🎵",
        },
        {
            title: "Learn from Trainers",
            description: "Accelerate your growth with live and recorded courses crafted by elite industry professionals.",
            icon: "🎓",
        },
        {
            title: "Community Reviews",
            description: "Get constructive feedback and build connections with fellow passionate musicians.",
            icon: "💬",
        },
        {
            title: "Seamless Collaboration",
            description: "Connect instantly with singers, lyricists, instrumentalists, and producers to co-create magic.",
            icon: "🤝",
        },
        {
            title: "Competitive Leaderboards",
            description: "Rise through the ranks and get featured based on real, community-driven ratings.",
            icon: "🏆",
        },
        {
            title: "Music Marketplace",
            description: "Monetize your craft. Buy and sell original songs, custom music tracks, and full compositions.",
            icon: "🛒",
        },
        {
            title: "AI Song Review",
            description: "Get instant, advanced AI-powered acoustic analysis and metrics on your singing performance.",
            icon: "🤖",
        },
    ];

    return (
        <div className="bg-slate-50 min-h-screen w-full overflow-x-hidden antialiased text-slate-800">
            {/* Navbar (Included based on your import statement) */}
            <Navbar />

            {/* Hero Header Section */}
            <div className="relative w-full overflow-hidden bg-slate-900 aspect-[16/6] max-h-[500px]">
                <Image 
                    alt="Features Hero Banner" 
                    src={featuresPageHeroSection}
                    priority
                    fill
                    className="object-cover opacity-80 select-none pointer-events-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                
                {/* Section Title */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        Experience Our Platform Features
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-500 font-medium">
                        Everything you need to showcase, learn, collaborate, and scale your musical journey in one powerful space.
                    </p>
                </div>

                {/* Features Layout: Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresList.map((feature, index) => (
                        <div 
                            key={index}
                            className="group relative bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col items-start"
                        >
                            {/* Decorative background glow on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-violet-50/0 group-hover:from-indigo-50/30 group-hover:to-violet-50/30 transition-all duration-300 -z-10" />
                            
                            {/* Feature Icon Badge */}
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                {feature.icon}
                            </div>

                            {/* Feature Text Info */}
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-slate-600 leading-relaxed text-sm md:text-base">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Features;
