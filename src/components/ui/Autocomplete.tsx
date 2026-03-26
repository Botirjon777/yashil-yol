"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { HiSearch, HiX, HiLocationMarker } from "react-icons/hi";

interface Suggestion {
  id: string | number;
  name: string;
  subtext?: string;
  type: "region" | "district" | "quarter";
}

interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: string;
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  onInputChange: (value: string) => void;
  className?: string;
  isLoading?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  placeholder = "Search location...",
  value = "",
  suggestions,
  onSelect,
  onInputChange,
  className,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use a local state for the "active" input value to ensure responsiveness while typing
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onInputChange(val);
    setIsOpen(true);
  };

  const handleSelect = (suggestion: Suggestion) => {
    // We update the local value, but the prop 'value' should also update via onSelect
    onSelect(suggestion);
    
    if (suggestion.type === "quarter") {
      setIsOpen(false);
    } else {
      // For region/district, we keep it open and refocus
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className={cn("w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-dark-text mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <HiSearch className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-white border border-border text-dark-text rounded-xl pl-12 pr-10 py-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base",
            isOpen && "rounded-b-none border-primary"
          )}
        />
        {localValue && (
          <button
            onClick={() => {
              setLocalValue("");
              onInputChange("");
            }}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-dark-text transition-colors"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <ul className="absolute z-50 w-full bg-white border border-t-0 border-primary rounded-b-xl shadow-2xl max-h-72 overflow-auto py-2 animate-in slide-in-from-top-1 duration-200">
          {isLoading ? (
            <div className="px-4 py-3 flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Searching...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.type}-${suggestion.id}-${index}`}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors flex items-start space-x-3 border-b border-gray-50 last:border-0"
              >
                <div className={cn(
                  "mt-0.5 p-1.5 rounded-lg flex items-center justify-center shrink-0",
                  suggestion.type === "region" ? "bg-primary/10 text-primary" : 
                  suggestion.type === "district" ? "bg-secondary/10 text-secondary" : 
                  "bg-accent/10 text-accent"
                )}>
                  <HiLocationMarker className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black text-dark-text leading-tight">
                    {suggestion.name}
                  </div>
                  {suggestion.subtext && (
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {suggestion.subtext}
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
