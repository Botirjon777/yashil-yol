"use client";

import React, { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary text-white shadow-2xl transition-all duration-300 hover:bg-primary-dark hover:-translate-y-1 focus:outline-hidden focus:ring-4 focus:ring-primary/20",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <HiArrowUp className="w-6 h-6" />
    </button>
  );
}
