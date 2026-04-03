"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullMobile?: boolean;
}

let openModalsCount = 0;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
  fullMobile = false,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      
      // Prevent shift by adding padding equal to scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (openModalsCount === 0 && scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      document.body.style.overflow = "hidden";
      openModalsCount++;

      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        
        openModalsCount = Math.max(0, openModalsCount - 1);
        if (openModalsCount === 0) {
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }
      }, 400); // Wait for transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      // Cleanup if component unmounts while modal is logically open
      if (isOpen) {
        openModalsCount = Math.max(0, openModalsCount - 1);
        if (openModalsCount === 0) {
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }
      }
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center p-0 transition-all duration-300",
        !fullMobile ? "p-4" : "md:p-4",
      )}
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-dark-text/40 transition-all duration-500 ease-out",
          animate
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 backdrop-blur-0",
        )}
        onClick={onClose}
      />

      {/* Content Container */}
      <div
        className={cn(
          "relative flex flex-col w-full bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          fullMobile
            ? "h-full md:h-auto rounded-none md:rounded-md md:max-h-[85vh]"
            : "max-h-[90vh]",
          // Desktop Animation: Scale + Fade
          !fullMobile &&
            (animate ? "opacity-100 scale-100" : "opacity-0 scale-95"),
          // Mobile Animation: Slide Up
          fullMobile &&
            (animate ? "translate-y-0" : "translate-y-full md:translate-y-0"),
          // Desktop fallback for mobile variant
          fullMobile && !animate && "md:opacity-0 md:scale-95 md:translate-y-0",
          fullMobile &&
            animate &&
            "md:opacity-100 md:scale-100 md:translate-y-0",
          sizes[size],
          className,
        )}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-border bg-white z-10">
            <h3 className="text-xl font-bold text-dark-text">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 border border-transparent hover:border-border"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-5 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
