import React from "react";
import { cn } from "@/src/lib/utils";

interface FormErrorProps {
  message?: string | null;
  className?: string;
}

const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "bg-error/10 text-error p-3 rounded-sm text-sm font-medium border border-error/20 animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      {message}
    </div>
  );
};

export default FormError;
