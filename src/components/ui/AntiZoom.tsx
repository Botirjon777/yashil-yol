"use client";

import { useEffect } from "react";

export default function AntiZoom() {
  useEffect(() => {
    // Prevent multi-touch zoom
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom
    let lastTouchTime = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchTime < 300) {
        e.preventDefault();
      }
      lastTouchTime = now;
    };

    // Prevent gesture zoom (Safari specific)
    const handleGestureStart = (e: any) => {
      e.preventDefault();
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("gesturestart", handleGestureStart);
    };
  }, []);

  return null;
}
