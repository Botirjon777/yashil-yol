import React from "react";
import { cn } from "@/src/lib/utils";
import { HiCheck } from "react-icons/hi";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              "peer appearance-none w-5 h-5 border-2 border-border rounded-lg checked:bg-primary checked:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
              className
            )}
            {...props}
          />
          <HiCheck className="absolute w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform duration-200" />
        </div>
        {label && (
          <span className="text-dark-text font-medium group-hover:text-primary transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
