"use client";

import { useRef } from "react";
import { HiChevronLeft, HiChevronRight, HiLocationMarker } from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import { POPULAR_ROUTES, PopularRoute } from "../constants/routes";

interface RoutesSwiperProps {
  activeRoute: PopularRoute | null;
  onRouteClick: (route: PopularRoute) => void;
}

export function RoutesSwiper({ activeRoute, onRouteClick }: RoutesSwiperProps) {
  const swiperRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") =>
    swiperRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });

  return (
    <div className="relative">
      {/* Desktop arrows */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full shadow-sm items-center justify-center hover:border-primary transition-all hidden md:flex"
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={swiperRef}
        className="flex gap-2.5 overflow-x-auto scroll-smooth px-0 md:px-9"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {POPULAR_ROUTES.map((route) => {
          const isActive = activeRoute?.label === route.label;
          return (
            <button
              key={route.label}
              onClick={() => onRouteClick(route)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-2xl border text-xs font-black transition-all shrink-0",
                isActive
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-white text-dark-text border-border hover:border-primary hover:text-primary hover:shadow-sm",
              )}
            >
              <HiLocationMarker
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  isActive ? "text-white/80" : "text-primary",
                )}
              />
              {route.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full shadow-sm items-center justify-center hover:border-primary transition-all hidden md:flex"
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
