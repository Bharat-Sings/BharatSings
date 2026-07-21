import React from "react";
import Navbar from "./Components/Navbar";
import Image from "next/image";

import landingPageTopSection from "./Images/landingPageTopSection.png";
import landingPageSinger from "./Images/landingPageSinger.jpg";
import landingPageMusicSign from "./Images/landingPageMusicSign.png";
import landingPageGuitar from "./Images/landingPageGuitar.png";

export default function Home() {
    return (
        <div className="bg-white min-h-screen w-full overflow-x-hidden">

            <Navbar />

            <Image
                src={landingPageTopSection}
                alt="Hero"
                className="w-full h-auto"
                priority
            />

            {/* SECTION 1 */}

            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">

                <div className="flex flex-col lg:flex-row items-center gap-12">

                    <div className="lg:w-1/2 text-center lg:text-left">

                        <p className="text-xl md:text-2xl leading-relaxed font-serif">

                            One platform for singers and musicians to showcase
                            their talent, connect with fellow artists, learn
                            from expert trainers, and build their presence in
                            the music community.

                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mt-10">

                            <button
                                className="bg-purple-700 text-white px-10 py-3 rounded-full
                                font-bold text-lg hover:bg-white hover:text-purple-700
                                border-2 border-purple-700 transition">

                                REGISTER

                            </button>

                            <button
                                className="bg-white text-purple-700 px-10 py-3 rounded-full
                                font-bold text-lg border-2 border-purple-700
                                hover:bg-purple-700 hover:text-white transition">

                                LOGIN

                            </button>

                        </div>

                    </div>

                    <div className="lg:w-1/2 flex justify-center">

                        <Image
                            src={landingPageSinger}
                            alt="Singer"
                            className="rounded-xl w-full max-w-sm lg:max-w-md h-auto"
                        />

                    </div>

                </div>

            </section>

            {/* SECTION 2 */}

            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">

                <div className="flex flex-col-reverse lg:flex-row items-center gap-12">

                    <div className="lg:w-1/2 flex justify-center">

                        <Image
                            src={landingPageMusicSign}
                            alt="Music"
                            className="w-full max-w-sm h-auto"
                        />

                    </div>

                    <div className="lg:w-1/2 text-center lg:text-left">

                        <p className="text-xl md:text-2xl leading-relaxed font-serif">

                            Explore a wide variety of songs from different
                            genres. Discover music that matches your taste and
                            enjoy performances by talented artists.

                        </p>

                        <button
                            className="mt-10 bg-purple-700 text-white px-10 py-3
                            rounded-full font-bold text-lg border-2 border-purple-700
                            hover:bg-white hover:text-purple-700 transition">

                            EXPLORE SONGS

                        </button>

                    </div>

                </div>

            </section>

            {/* SECTION 3 */}

            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16">

                <div className="flex flex-col lg:flex-row items-center gap-12">

                    <div className="lg:w-1/2 text-center lg:text-left">

                        <p className="text-xl md:text-2xl leading-relaxed font-serif">

                            Find courses and learn from experienced singers,
                            musicians and trainers to improve your skills.

                        </p>

                        <button
                            className="mt-10 bg-purple-700 text-white px-10 py-3
                            rounded-full font-bold text-lg border-2 border-purple-700
                            hover:bg-white hover:text-purple-700 transition">

                            FIND COURSES

                        </button>

                    </div>

                    <div className="lg:w-1/2 flex justify-center">

                        <Image
                            src={landingPageGuitar}
                            alt="Guitar"
                            className="w-full max-w-lg h-auto"
                        />

                    </div>

                </div>

            </section>

        </div>
    );
}