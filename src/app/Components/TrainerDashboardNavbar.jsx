"use client"

import React, { useState } from "react";
import { usePathname } from "next/navigation";import Image from "next/image";
import logo from "../Images/logo.jpg";
// Optional: Install 'lucide-react' for clean iconography, or swap with your own SVGs
import { LayoutDashboard, Music, GraduationCap, Store, Users, Menu, X, Mail } from "lucide-react";

function TrainerDashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/trainerdashboard" },
    { name: "My Courses", icon: <GraduationCap size={20} />, link: "/trainerdashboard/MyCourses" },
    { name: "Contact", icon: <Mail size={20} />, link: "/trainerdashboard/Contact"},
  ];

  return (
    <>
      {/* --- MOBILE NAVBAR HEADER (visible only on mobile) --- */}
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden border-b border-gray-100">
        <div className="w-28 relative h-8">
          <Image alt="logo" src={logo} fill className="object-contain" />
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-700 focus:outline-none p-1 hover:bg-gray-100 rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- RESPONSIVE SIDEBAR CONTAINER --- */}
      <div
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100 p-4 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:sticky md:top-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Logo (hidden on mobile header layout) */}
        <div className="hidden md:block mb-8 px-2">
          <div className="w-36 relative h-10">
            <Image alt="logo" src={logo} fill className="object-contain" priority />
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          <ul className="flex flex-col gap-1 w-full">
            {menuItems.map((item, index) => {
              // Simulating active state styling for 'Dashboard' as shown in the screenshot
              const isActive = pathname === item.link;              
              return (
                <li key={index}>
                  <a
                    href={`${item.link}`}
                    onClick={() => setIsOpen(false)} // Close sidebar on mobile item click
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                      ${isActive 
                        ? "bg-[#EBE5F7] text-[#5C23CD]" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <span className={isActive ? "text-[#5C23CD]" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* --- BACKDROP FOR MOBILE OVERLAY --- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default TrainerDashboardNavbar;
