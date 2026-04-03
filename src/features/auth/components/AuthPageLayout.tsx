"use client";

import React from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  imageSide?: "left" | "right";
  title?: string;
  subtitle?: string;
}

export const AuthPageLayout = ({
  children,
  imageSide = "left",
  title,
  subtitle,
}: AuthPageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden relative">
      {/* Back to home - Mobile floating */}
      <Link
        href="/"
        className="md:hidden fixed top-6 left-6 z-50 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-dark-text border border-border/40 transition-transform active:scale-95"
      >
        <HiArrowLeft className="w-5 h-5" />
      </Link>

      {/* Decorative Image Side */}
      <div
        className={cn(
          "hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden animate-in fade-in duration-1000",
          imageSide === "right" ? "order-2" : "order-1",
        )}
      >
        <img
          src="/assets/home/hero-bg.webp"
          alt="Authentication Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Form Content Side */}
      <div
        className={cn(
          "flex-1 flex flex-col relative p-0 md:p-8 lg:p-12 bg-white md:bg-light-bg/30 min-h-screen",
          imageSide === "right" ? "order-1" : "order-2",
        )}
      >
        {/* Back to home - Desktop positioned */}
        <div className="w-full max-w-2xl mx-auto pt-8 hidden md:block">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <HiArrowLeft className="w-4 h-4" />
            </div>
            Bosh sahifaga qaytish
          </Link>
        </div>

        <div className="w-full max-w-2xl mx-auto my-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out px-6 py-10 md:px-0 md:py-0">
          <div className="mb-6 md:mb-8 text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-dark-text tracking-tight mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="bg-white md:premium-card md:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] md:overflow-hidden md:rounded-md border-transparent">
            <div className="p-0 md:p-6 lg:p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
