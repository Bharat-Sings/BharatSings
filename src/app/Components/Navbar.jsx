'use client'; 

import React, { useState } from "react"; // Added useState for mobile menu toggle
import Image from "next/image";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 
import logo from "../Images/logo.jpg";

function Navbar() {
    const pathname = usePathname(); 
    const [isOpen, setIsOpen] = useState(false); // State to track mobile menu visibility

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/Features" },
        { name: "About", href: "/About" },
        { name: "Contact", href: "/Contact" },
    ];

    return (
        <nav className="relative w-full bg-white shadow-sm">
            {/* Desktop Navbar container */}
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-10">
                
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <Image 
                        alt="logo" 
                        src={logo} 
                        priority 
                        className="w-40 h-auto md:w-60" 
                    />
                </div>
                
                {/* Desktop Navigation Menu (hidden on mobile, visible on md screens) */}
                <ul className="hidden md:flex items-center gap-10 text-gray-600 text-xl lg:text-2xl">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name}>
                                <Link 
                                    href={link.href} 
                                    className={`cursor-pointer transition-colors ${
                                        isActive 
                                            ? "text-purple-700 font-bold" 
                                            : "hover:text-purple-500"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Desktop "Get Started" Button (hidden on mobile) */}
                <div className="hidden md:block">
                    <button className="bg-white text-purple-700 font-bold rounded-[41px] p-2 w-40 text-xl lg:text-2xl border-2 border-purple-700 cursor-pointer hover:text-white hover:bg-purple-700 transition-colors">
                        Get Started
                    </button>
                </div>

                {/* Hamburger Icon Trigger (visible only on mobile) */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-purple-700 focus:outline-none cursor-pointer"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            // Close icon (X) when menu is open
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            // Hamburger menu icon when menu is closed
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Menu Drawer (Shows when isOpen is true) */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 animate-fadeIn">
                    <ul className="flex flex-col p-6 gap-6 text-xl text-gray-600">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.name} onClick={() => setIsOpen(false)}>
                                    <Link 
                                        href={link.href} 
                                        className={`block py-2 transition-colors ${
                                            isActive 
                                                ? "text-purple-700 font-bold border-l-4 border-purple-700 pl-2" 
                                                : "hover:text-purple-500"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                        <li className="pt-4 border-t border-gray-100">
                            <button className="bg-purple-700 text-white font-bold rounded-[41px] p-3 w-full text-xl cursor-pointer hover:bg-purple-800 transition-colors">
                                Get Started
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;