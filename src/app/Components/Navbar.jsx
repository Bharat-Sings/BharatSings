'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../Images/logo.jpg";

function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [navHeight, setNavHeight] = useState(0);
    const barRef = useRef(null);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/Features" },
        { name: "About", href: "/About" },
        { name: "Contact", href: "/Contact" },
    ];

    // Measure the actual rendered height of the top bar (logo + links row)
    // so the mobile menu overlay can sit exactly below it, regardless of
    // logo size or screen width — instead of guessing a fixed pixel value.
    useEffect(() => {
        function measure() {
            if (barRef.current) {
                setNavHeight(barRef.current.offsetHeight);
            }
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // Prevent the page behind the menu from scrolling while it's open.
    useEffect(() => {
        if (isOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [isOpen]);

    // Close the menu automatically if the viewport is resized up to
    // desktop width, so it can't get stuck open behind the desktop nav.
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 768) setIsOpen(false);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="relative w-full bg-white shadow-sm">
            {/* Top bar: logo, desktop links, desktop CTA, mobile hamburger */}
            <div
                ref={barRef}
                className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-10"
            >
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
                    <Link
                        href="/RegisterUserOrTrainer"
                        className="inline-flex items-center justify-center bg-white text-purple-700 font-bold rounded-[41px] p-2 w-40 text-xl lg:text-2xl border-2 border-purple-700 hover:bg-purple-700 hover:text-white transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Hamburger Icon Trigger (visible only on mobile) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-purple-700 focus:outline-none cursor-pointer relative z-[60]"
                    aria-label="Toggle Menu"
                    aria-expanded={isOpen}
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

            {/* Mobile Menu — a full-screen overlay (not a short dropdown) so
                it fully covers the page content below it. Previously this
                was `absolute` and only as tall as its own links, which let
                the hero section's own button peek through underneath it. */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-x-0 bottom-0 bg-white z-50 overflow-y-auto animate-fadeIn"
                    style={{ top: navHeight }}
                >
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
                            <Link
                                href="/RegisterUserOrTrainer"
                                onClick={() => setIsOpen(false)}
                                className="block w-full bg-purple-700 text-white font-bold rounded-full py-3 text-center text-xl hover:bg-purple-800 transition-colors"
                            >
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;