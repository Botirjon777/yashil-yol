import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface SubStatusProps {
  label: string;
  status: string;
}

export function SubStatus({ label, status }: SubStatusProps) {
  const { t } = useLanguageStore();
  const isApproved = status === "approved";
  const statusLabels: Record<string, string> = t("dashboard", "driverSection")?.statuses || {};
  const displayStatus = statusLabels[status] || status;

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
      <div className={cn(
        "text-xs font-black",
        isApproved ? "text-success" : "text-warning"
      )}>
        {displayStatus}
      </div>
    </div>
  );
}
