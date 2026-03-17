import React from "react";
import { cn } from "@/src/lib/utils";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            ref={ref}
            className={cn(
              "peer appearance-none w-5 h-5 border-2 border-border rounded-full checked:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
              className
            )}
            {...props}
          />
          <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
        </div>
        <span className="text-dark-text font-medium group-hover:text-primary transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
