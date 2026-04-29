import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export type BadgeStatus = "active" | "full" | "cancelled" | "past" | "completed";

interface BadgeProps {
  status: BadgeStatus;
  className?: string;
  children?: React.ReactNode;
  showDot?: boolean;
}

const statusConfig: Record<BadgeStatus, { label: string; classes: string; dotClass: string }> = {
  active: {
    label: "Faol",
    classes: "bg-success/10 text-success border-success/20",
    dotClass: "bg-success",
  },
  full: {
    label: "To'la",
    classes: "bg-accent/10 text-accent border-accent/20",
    dotClass: "bg-accent",
  },
  cancelled: {
    label: "Bekor qilingan",
    classes: "bg-error/10 text-error border-error/20",
    dotClass: "bg-error",
  },
  past: {
    label: "O'tgan",
    classes: "bg-slate-100 text-slate-500 border-slate-200",
    dotClass: "bg-slate-400",
  },
  completed: {
    label: "Yakunlangan",
    classes: "bg-primary/10 text-primary border-primary/20",
    dotClass: "bg-primary",
  },
};

const Badge: React.FC<BadgeProps> = ({ 
  status, 
  className, 
  children,
  showDot = true 
}) => {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        duration: 0.2 
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors",
        config.classes,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      )}
      <span>{children || config.label}</span>
    </motion.div>
  );
};

export default Badge;
