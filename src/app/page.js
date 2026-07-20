import React from "react";
import Navbar from "../app/Components/Navbar.jsx";
import Image from "next/image.js";
import landingPageTopSection from "./Images/landingPageTopSection.png";
import landingPageSinger from "./Images/landingPageSinger.jpg";
import landingPageMusicSign from "./Images/landingPageMusicSign.png";

function Home() {
    return (
        <div className="bg-white min-h-screen w-full">
            <Navbar />
            <Image alt = "landingPageTopSection" src = {landingPageTopSection}
            className="w-full" />
            <div className = "flex mt-10">
                <div className="w-130 mt-15 text-2xl font-serif">
                    <div className = "ml-40">
                        One platform for singers and musicians to showcase their talent, connect with fellow artists, learn from expert trainers, and build their presence in the music community.
                    </div>
                    <div className="flex gap-3 mt-5 ml-37">
                        <button className="bg-purple-700 text-white text-2xl p-2 w-60 font-[Inter] font-bold
                        rounded-[41px]">REGISTER</button>
                        <button className="bg-white text-purple-700 font-bold rounded-[41px] p-2 w-60 text-2xl
            font-[Inter] border-2 border-purple-700">LOGIN</button>
                    </div>
                </div>
                <Image alt = 'landingPageSinger' src = {landingPageSinger} 
                className="w-80 h-80 ml-20" />
            </div>
            <div className="flex mt-10">
                <Image alt = 'landingPageMusicSign' src = {landingPageMusicSign}
                className="w-80 h-40 ml-60 mt-15" />
                <div className="w-130 mt-15 text-2xl font-serif">
                    <div className="ml-40">
                        Explore a wide variety of songs and music of different genre. Find and listen to songs that fit your taste.
                    </div>
                    <div className="">
                        <button className="bg-purple-700 text-white text-2xl p-2 w-60 font-[Inter] font-bold
                        rounded-[41px] mt-5 ml-52">EXPLORE SONGS</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;