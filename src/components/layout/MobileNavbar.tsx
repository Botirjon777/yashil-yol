"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiSearch, HiX } from "react-icons/hi";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/src/lib/utils";

const MobileNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav className="md:hidden bg-white border-b border-border fixed top-0 left-0 right-0 z-50 h-16 shadow-sm">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-base md:text-lg font-black text-dark-text tracking-tight uppercase">
            Yashil <span className="text-primary">Yo&apos;l</span>
          </span>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Search Icon */}
          <Link
            href="/rides"
            className="p-2 text-dark-text hover:text-primary transition-colors hover:bg-light-bg rounded-lg"
            aria-label="Search"
          >
            <HiSearch className="w-6 h-6" />
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-dark-text hover:text-primary transition-colors hover:bg-light-bg rounded-lg"
            aria-label="Open menu"
          >
            <HiMenu className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </nav>
  );
};

export default MobileNavbar;
