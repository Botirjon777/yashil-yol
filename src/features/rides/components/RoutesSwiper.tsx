"use client";

import { useRef } from "react";
import { HiChevronLeft, HiChevronRight, HiLocationMarker } from "react-icons/hi";
import { GoArrowSwitch } from "react-icons/go";
import { cn } from "@/src/lib/utils";
import { POPULAR_ROUTES, PopularRoute } from "../constants/routes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

interface RoutesSwiperProps {
  activeRoute: PopularRoute | null;
  onRouteClick: (route: PopularRoute) => void;
}

export function RoutesSwiper({ activeRoute, onRouteClick }: RoutesSwiperProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Swiper List on top */}
      <div className="py-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          className="my-swiper"
        >
          {POPULAR_ROUTES.map((route) => {
            const isActive = activeRoute?.from_id === route.from_id && activeRoute?.to_id === route.to_id;
            return (
              <SwiperSlide key={`${route.from_id}-${route.to_id}`} className="!w-auto">
                <button
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
                  <div className="flex items-center gap-2">
                    <span className="text-inherit">{route.from}</span>
                    <GoArrowSwitch className={cn("w-3.5 h-3.5", isActive ? "text-white/70" : "text-gray-400")} />
                    <span className="text-inherit">{route.to}</span>
                  </div>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Navigation Buttons on bottom-left */}
      <div className="flex items-center gap-3">
        <button
          ref={prevRef}
          aria-label="Scroll left"
          className="w-10 h-10 bg-white border-2 border-border rounded-full flex items-center justify-center text-dark-text hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>
        <button
          ref={nextRef}
          aria-label="Scroll right"
          className="w-10 h-10 bg-white border-2 border-border rounded-full flex items-center justify-center text-dark-text hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
