import React from "react";
import { cn } from "@/src/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "md", fullPage = false, className }) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  const content = (
    <div
      className={cn(
        "rounded-full border-primary border-t-transparent animate-spin",
        sizes[size],
        className
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-200 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
