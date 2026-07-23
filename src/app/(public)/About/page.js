import React from "react";
import Navbar from "../../Components/Navbar";
import Image from "next/image";
import aboutPageGuitarPerson from "../../Images/aboutPageGuitarPerson.png";
import aboutPageFlutePerson from "../../Images/aboutPageFlutePerson.png";
import aboutPagePiano from "../../Images/aboutPagePiano.png";

function About() {
    return (
        <div className="bg-white min-h-screen w-full overflow-x-hidden">
            <div className = "flex">
                <div className="">
                    <div className = "md:ml-40 md:mt-20 ml-5 font-bold text-[15px] md:text-2xl lg:text-3xl font-[Verdana]">
                        Our Mission
                    </div>
                    <div className="md:ml-40 md:mt-5 w-40 ml-5 font-bold text-[10px] font-serif md:text-xl lg:text-2xl w-30 md:w-80 lg:w-120">
                        Bharat Sings is a community-driven platform built to empower singers, musicians, and music creators. Our mission is to help talented artists showcase their work, receive valuable feedback, connect with fellow creators, and grow their musical journey.
                    </div>
                </div>
                <Image alt = "aboutPageGuitarPerson" src = {aboutPageGuitarPerson}
                className="md:w-170 md:h-100 md:mt-5 w-70 h-40" />
            </div>
            <div className = "flex">
                <Image alt = "aboutPageFlutePerson" src = {aboutPageFlutePerson}
                className="md:w-170 md:h-100 md:mt-5 w-70 h-40" />
                <div className="">
                    <div className = "md:ml-20 md:mt-20 font-bold text-[15px] md:text-2xl lg:text-3xl font-[Verdana]">
                        Our Vision
                    </div>
                    <div className="md:ml-20 md:mt-5 w-30 font-bold text-[10px] font-serif md:text-xl lg:text-2xl md:w-80 lg:w-120">
                        We envision Bharat Sings as a platform where every aspiring artist can learn, collaborate, and find opportunities, regardless of their background or experience.
                    </div>
                </div>
            </div>
            <div className = "flex md:mt-0 mt-10">
                <div className="">
                    <div className = "md:ml-40 ml-5 md:mt-20 font-bold text-[15px] md:text-2xl lg:text-3xl font-[Verdana]">
                        What We Offer
                    </div>
                    <div className="md:ml-40 ml-5 md:mt-5 w-40 font-bold text-[10px] font-serif md:text-xl lg:text-2xl w-30 md:w-80 lg:w-120">
                        🎤 Showcase Your Talent<br />
                        💬 Community Reviews<br />
                        🤝 Collaborate with Artists<br />
                        🎓 Learn from Trainers<br />
                        🏆 Leaderboards<br />
                        🎼 Music Marketplace
                    </div>
                </div>
                <Image alt = "aboutPagePiano" src = {aboutPagePiano}
                className="md:w-170 md:h-100 md:mt-5 w-60 h-30" />
            </div>
        </div>
    )
}

export default About;