import { HiCheckCircle } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

interface StepIndicatorProps {
  step: number;
  active: boolean;
  completed: boolean;
  label: string;
}

export function StepIndicator({
  step,
  active,
  completed,
  label,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center z-10">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-4",
          active
            ? "bg-white border-primary text-primary scale-110 shadow-lg"
            : completed
              ? "bg-primary border-primary text-white"
              : "bg-white border-border text-gray-400",
        )}
      >
        {completed ? <HiCheckCircle className="w-6 h-6" /> : step}
      </div>
      <span
        className={cn(
          "mt-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors text-center max-w-[60px]",
          active
            ? "text-primary"
            : completed
              ? "text-dark-text"
              : "text-gray-400",
        )}
      >
        {label}
      </span>
    </div>
  );
}
