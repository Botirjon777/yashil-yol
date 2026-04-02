import React from "react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-primary text-white shadow-xl shadow-primary/25 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0",
      secondary:
        "bg-secondary text-white shadow-xl shadow-secondary/25 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "bg-transparent text-primary hover:bg-primary/10 hover:-translate-y-0.5 active:translate-y-0",
      danger:
        "bg-error text-white shadow-xl shadow-error/25 hover:bg-error/90 hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[10px]",
      md: "px-5 py-2.5 text-xs",
      lg: "px-8 py-3.5 text-sm md:text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-tight cursor-pointer transition-all duration-300 rounded-xl shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          icon && <span className="mr-2">{icon}</span>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
