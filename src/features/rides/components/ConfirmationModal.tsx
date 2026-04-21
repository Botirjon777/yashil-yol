"use client";

import React from "react";
import { HiExclamation, HiX } from "react-icons/hi";
import Modal from "@/src/components/ui/Modal";
import Button from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) => {
  const variantStyles = {
    danger: {
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      buttonVariant: "danger" as const,
    },
    primary: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      buttonVariant: "primary" as const,
    },
    warning: {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      buttonVariant: "primary" as const, // Or warning if exists
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className={cn(
          "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-sm",
          style.iconBg,
          style.iconColor
        )}>
          <HiExclamation className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-dark-text mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="font-bold"
          >
            {cancelText}
          </Button>
          <Button
            variant={style.buttonVariant}
            onClick={onConfirm}
            loading={isLoading}
            className="font-black shadow-lg"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
