import React from "react";
import Navbar from "../app/Components/Navbar.jsx";
import Image from "next/image.js";
import landingPageTopSection from "./Images/landingPageTopSection.png";
import landingPageSinger from "./Images/landingPageSinger.jpg";

function Home() {
    return (
        <div className="bg-white min-h-screen w-full">
            <Navbar />
            <Image alt = "landingPageTopSection" src = {landingPageTopSection}
            className="w-full" />
            <div className = "flex mt-10">
                <div className="w-100 ml-40 mt-15 text-2xl font-serif w-130">
                    One platform for singers and musicians to showcase their talent, connect with fellow artists, learn from expert trainers, and build their presence in the music community.
                </div>
                <Image alt = 'landingPageSinger' src = {landingPageSinger} 
                className="w-60 h-60 ml-20" />
            </div>
        </div>
    );
}

export default Home;