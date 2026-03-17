"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { HiChevronLeft, HiChevronRight, HiCalendar } from "react-icons/hi";

interface CalendarProps {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()));
  const calendarRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const selectedDate = useMemo(() => (value ? new Date(value) : null), [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const formatted = newDate.toISOString().split("T")[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    // Empty slots for prev month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === d && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      
      const isToday = new Date().getDate() === d && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateClick(d)}
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all",
            isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-primary/10 text-dark-text",
            isToday && !isSelected && "text-primary border border-primary/20",
          )}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={cn("w-full relative", className)} ref={calendarRef}>
      {label && (
        <label className="block text-sm font-semibold text-dark-text mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border border-border text-dark-text rounded-xl px-4 py-3 text-left flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          isOpen && "border-primary ring-2 ring-primary/20",
          error && "border-error focus:ring-error/20 focus:border-error",
          !value && "text-gray-400"
        )}
      >
        <HiCalendar className="w-5 h-5 mr-3 text-gray-400" />
        <span className="grow">
          {value ? new Date(value).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-100 mt-2 bg-white border border-border rounded-2xl shadow-2xl p-4 w-[320px] animate-in fade-in zoom-in duration-200 left-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-dark-text">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h4>
            <div className="flex space-x-1">
              <button 
                type="button"
                onClick={handlePrevMonth} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <button 
                type="button"
                onClick={handleNextMonth} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="h-10 w-10 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <button 
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                onChange(today);
                setIsOpen(false);
              }}
              className="text-primary text-xs font-black uppercase tracking-widest hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
      
      {error && <p className="mt-1.5 text-xs text-error font-medium ml-1">{error}</p>}
    </div>
  );
};

export default Calendar;
