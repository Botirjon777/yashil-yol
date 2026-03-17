"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { HiChevronDown } from "react-icons/hi";

interface Option {
  id: string | number;
  name: string;
}

interface DropdownProps {
  label?: string;
  options: Option[];
  value?: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-dark-text mb-1.5 ml-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border border-border text-dark-text rounded-xl px-4 py-3 text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          isOpen && "border-primary ring-2 ring-primary/20",
          error && "border-error focus:ring-error/20 focus:border-error",
          !selectedOption && "text-gray-400"
        )}
      >
        <span className="truncate mr-2">{selectedOption ? selectedOption.name : placeholder}</span>
        <HiChevronDown
          className={cn("w-5 h-5 transition-transform duration-200 shrink-0", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-100 w-full mt-2 bg-white border border-border rounded-xl shadow-xl max-h-60 overflow-auto py-1 animate-in fade-in zoom-in duration-200 left-0">
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2.5 hover:bg-primary/5 cursor-pointer transition-colors text-dark-text text-sm",
                  value === option.id && "bg-primary/10 text-primary font-bold"
                )}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-gray-400 text-sm">No options available</li>
          )}
        </ul>
      )}
      {error && <p className="mt-1.5 text-xs text-error font-medium ml-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
