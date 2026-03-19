import React from "react";
import { cn } from "@/src/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, iconLeft, iconRight, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full px-5 py-3 md:py-4 bg-light-bg border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-base",
              iconLeft && "pl-11",
              iconRight && "pr-11",
              error && "border-error focus:ring-error/20 focus:border-error",
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-error font-medium ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
