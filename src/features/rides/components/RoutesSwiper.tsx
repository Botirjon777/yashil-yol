"use client";

import { useRef, useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiLocationMarker } from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import { POPULAR_ROUTES, PopularRoute } from "../constants/routes";

interface RoutesSwiperProps {
  activeRoute: PopularRoute | null;
  onRouteClick: (route: PopularRoute) => void;
}

export function RoutesSwiper({ activeRoute, onRouteClick }: RoutesSwiperProps) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = (dir: "left" | "right") => {
    if (!swiperRef.current) return;
    const scrollAmount = 280;
    const currentScroll = swiperRef.current.scrollLeft;
    const maxScroll = swiperRef.current.scrollWidth - swiperRef.current.clientWidth;

    if (dir === "right") {
      if (currentScroll >= maxScroll - 10) {
        swiperRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        swiperRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      swiperRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Desktop arrows */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-border rounded-full shadow-lg items-center justify-center hover:border-primary hover:text-primary transition-all hidden md:flex -ml-5 opacity-0 group-hover:opacity-100"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={swiperRef}
        className="flex gap-3 overflow-x-auto scroll-smooth px-0 md:px-2 py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {POPULAR_ROUTES.map((route) => {
          const isActive = activeRoute?.label === route.label;
          return (
            <button
              key={route.label}
              onClick={() => onRouteClick(route)}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap px-5 py-3 rounded-2xl border text-sm font-black transition-all shrink-0",
                isActive
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105"
                  : "bg-white text-dark-text border-border hover:border-primary hover:text-primary hover:shadow-md",
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center",
                isActive ? "bg-white/20" : "bg-primary/5"
              )}>
                <HiLocationMarker
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-white" : "text-primary",
                  )}
                />
              </div>
              {route.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-border rounded-full shadow-lg items-center justify-center hover:border-primary hover:text-primary transition-all hidden md:flex -mr-5 opacity-0 group-hover:opacity-100"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
