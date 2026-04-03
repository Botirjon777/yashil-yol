import React from "react";
import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  hideOptionalLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      iconLeft,
      iconRight,
      type,
      required,
      hideOptionalLabel,
      ...props
    },
    ref,
  ) => {
    const { t } = useLanguageStore();

    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">
            {label}
            {required ? (
              <span className="text-error ml-1">*</span>
            ) : !hideOptionalLabel ? (
              <span className="text-gray-400 font-medium ml-1.5 lowercase">
                {t("common", "optional")}
              </span>
            ) : null}
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
              "w-full px-4 py-2.5 bg-light-bg border border-border rounded-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm",
              iconLeft && "pl-11",
              iconRight && "pr-11",
              error && "border-error focus:ring-error/20 focus:border-error",
              className,
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-error font-medium ml-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
