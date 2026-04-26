"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showMax = 5;
    
    let start = Math.max(1, currentPage - Math.floor(showMax / 2));
    let end = Math.min(totalPages, start + showMax - 1);

    if (end - start + 1 < showMax) {
      start = Math.max(1, end - showMax + 1);
    }

    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all",
            currentPage === 1
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "hover:bg-primary/5 text-dark-text/60 hover:text-primary"
          )}
        >
          1
        </button>
      );
      if (start > 2) pages.push(<span key="dots-start" className="px-2 text-dark-text/30">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all",
            currentPage === i
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "hover:bg-primary/5 text-dark-text/60 hover:text-primary"
          )}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots-end" className="px-2 text-dark-text/30">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all",
            currentPage === totalPages
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "hover:bg-primary/5 text-dark-text/60 hover:text-primary"
          )}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-white text-dark-text hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-white text-dark-text hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
