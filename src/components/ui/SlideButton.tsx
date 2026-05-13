"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

interface SlideButtonProps {
  onSuccess: () => void;
  label: string;
  successLabel?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const SlideButton: React.FC<SlideButtonProps> = ({
  onSuccess,
  label,
  successLabel,
  className,
  disabled = false,
  isLoading = false,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Width of the handle (button) is roughly 64px (h-14)
  const [maxDrag, setMaxDrag] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setMaxDrag(containerRef.current.offsetWidth - 64);
    }
  }, []);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setMaxDrag(containerRef.current.offsetWidth - 64);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const opacity = useTransform(x, [0, maxDrag * 0.8], [1, 0.2]);
  const scale = useTransform(x, [0, maxDrag], [1, 1.05]);

  const handleDragEnd = () => {
    if (x.get() > maxDrag * 0.9) {
      x.set(maxDrag);
      setIsSuccess(true);
      onSuccess();
    } else {
      controls.start({ x: 0 });
    }
  };

  if (isSuccess || isLoading) {
    return (
      <div className={cn("w-full h-16 bg-success rounded-2xl flex items-center justify-center text-white font-black uppercase tracking-widest shadow-lg shadow-success/20 animate-in-bottom", className)}>
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          successLabel || "Success!"
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-16 bg-white rounded-2xl border-2 border-border overflow-hidden select-none shadow-sm",
        disabled && "opacity-50 pointer-events-none grayscale",
        className
      )}
    >
      {/* Background track text */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center text-gray-400 font-black uppercase text-[10px] tracking-[0.25em] pl-14"
      >
        {label}
      </motion.div>

      {/* Progress background */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-primary/5"
        style={{ width: x }}
      />

      {/* The Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, scale }}
        className="absolute top-1 bottom-1 left-1 w-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(79,70,229,0.4)] cursor-grab active:cursor-grabbing z-10 transition-colors hover:bg-primary-dark"
      >
        <HiChevronRight className="w-8 h-8" />
      </motion.div>
    </div>
  );
};

export default SlideButton;
