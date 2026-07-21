import React from "react";
import Image from "next/image";
import logo from "../Images/logo.jpg";

function Navbar() {
    return (
        <div className="flex items-center">
            <Image alt = 'logo' src = {logo} className="w-60 h-30 ml-10" />
            <ul className="flex font-[Inter] text-2xl ml-55 gap-10 text-gray">
                <li className="cursor-pointer">Home</li>
                <li className="cursor-pointer">Features</li>
                <li className="cursor-pointer">About</li>
                <li className="cursor-pointer">Contact</li>
            </ul>
            <button className="bg-white text-purple-700 font-bold ml-60 rounded-[41px] p-2 w-40 text-2xl
            font-[Inter] border-2 border-purple-700 cursor-pointer hover:text-white hover:bg-purple-700">
                Get Started
            </button>
        </div>
    );
}

export default Navbar;