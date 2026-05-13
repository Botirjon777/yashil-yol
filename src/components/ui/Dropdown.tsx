"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { HiChevronDown } from "react-icons/hi";

interface Option {
  id: string | number;
  label: string | React.ReactNode;
  name?: string; // Optional string name for simple display/alt
}

interface DropdownProps {
  label?: React.ReactNode;
  options: Option[];
  value?: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  large?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  className,
  disabled = false,
  large = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full relative", className)} ref={dropdownRef}>
      {label && (
        <div className="block text-xs font-bold text-gray-500 ml-1 mb-1">
          {label}
        </div>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full bg-light-bg border border-border text-dark-text rounded-xl px-4 py-2.5 text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium",
          large && "py-4 px-6 text-lg font-black rounded-2xl shadow-md",
          isOpen && "border-primary ring-2 ring-primary/20",
          error && "border-error focus:ring-error/20 focus:border-error",
          disabled &&
            "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed",
          !selectedOption && "text-gray-400",
        )}
      >
        <div className="truncate mr-2 flex items-center">
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <HiChevronDown
          className={cn(
            "w-5 h-5 transition-transform duration-200 shrink-0",
            large && "w-6 h-6",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            "absolute z-100 w-full mt-2 bg-white border border-border rounded-xl shadow-xl max-h-60 overflow-auto py-1 animate-in fade-in zoom-in duration-200 left-0",
            large && "rounded-2xl mt-3 shadow-2xl",
          )}
        >
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2.5 hover:bg-primary/5 cursor-pointer transition-colors text-dark-text text-sm flex items-center",
                  large && "px-6 py-4 text-base",
                  value === option.id && "bg-primary/10 text-primary font-bold",
                )}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-gray-400 text-sm">
              No options available
            </li>
          )}
        </ul>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-error font-medium ml-1">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
