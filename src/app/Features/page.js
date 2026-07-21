import React from "react";
import Navbar from "../Components/Navbar";
import featuresPageHeroSection from "../Images/featuresPageHeroSection.png";
import Image from "next/image";

function Features() {
    return (
        <div className="bg-white min-h-screen w-full overflow-x-hidden">
            <Navbar />
            <Image alt = "featuresPageHeroSection" src = {featuresPageHeroSection}
            className="w-full" />
            <div className="font-bold text-[25px] mt-5 md:text-[40px] lg:text-[50px]
            md:mt-10 md:w-150 md:ml-90 text-center">
                Experience The Exciting Features of Our Platform!
            </div>
            <div className="font-bold md:ml-70 md:w-200 text-[15px] w-70 ml-15 md:text-2xl lg:text-2xl md:mt-10 mt-5">
                🎤 Showcase Your Talent<br />
Upload your singing performances and share them with the community.
<br /><br />
🎼 Explore Songs<br />
Discover songs from various genres and enjoy performances by talented artists.
<br /><br />
🎓 Learn from Trainers<br />
Join live and recorded courses created by experienced trainers.
<br /><br />
⭐ Community Reviews<br />
Receive valuable feedback from fellow singers and musicians.
<br /><br />
🤝 Collaboration<br />
Find singers, lyricists, instrumentalists, and producers to work together.
<br /><br />
🏆 Leaderboards<br />
Top singers, musicians, and trainers based on community ratings.
<br /><br />
🎵 Music Marketplace<br />
Buy and sell original songs, music tracks, and compositions.
<br /><br />
🤖 AI Song Review<br />
Get AI-powered feedback on your singing performance.
            </div>
        </div>
    )
}

export default Features;