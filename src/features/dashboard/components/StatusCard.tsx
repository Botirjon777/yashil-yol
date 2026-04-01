import React from "react";
import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface StatusCardProps {
  title: string;
  status: string;
}

export function StatusCard({ title, status }: StatusCardProps) {
  const { t } = useLanguageStore();
  const isApproved = status === "approved";
  const isPending = status === "pending";
  
  const statusLabels: Record<string, string> = t("dashboard", "driverSection")?.statuses || {};
  const displayStatus = statusLabels[status] || status;

  return (
    <div className="premium-card p-5 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-dark-text font-black capitalize">{displayStatus}</p>
      </div>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        isApproved ? "bg-success/10 text-success" : isPending ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
      )}>
        {isApproved ? "✓" : isPending ? "⌛" : "✕"}
      </div>
    </div>
  );
}
