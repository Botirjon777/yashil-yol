import { cn } from "@/src/lib/utils";

interface SubStatusProps {
  label: string;
  status: string;
}

export function SubStatus({ label, status }: SubStatusProps) {
  const isApproved = status === "approved";
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
      <div className={cn(
        "text-xs font-black",
        isApproved ? "text-success" : "text-warning"
      )}>
        {isApproved ? "Approved" : "Pending"}
      </div>
    </div>
  );
}
