"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import { motion } from "framer-motion";
import MobileSidebar from "./MobileSidebar";
import { usePathname } from "next/navigation";

const MobileNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`md:hidden bg-navbar-bg fixed top-0 left-0 right-0 z-50 h-16 transition-shadow duration-300 ${scrolled
          ? "shadow-md border-b border-border/60"
          : "border-b border-border"
        }`}
    >
      <div className="h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/logo/ketamiz-logo.webp" alt="Ketamiz" className="h-7 w-auto" />
        </Link>

        {/* Current route indicator — subtle breadcrumb feel */}
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-dark-text hover:text-primary transition-colors hover:bg-light-bg rounded-xl"
            aria-label="Open menu"
          >
            <HiMenu className="w-6 h-6" />
          </motion.button>
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
