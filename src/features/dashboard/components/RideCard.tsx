import { HiLocationMarker, HiChevronRight, HiClock } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Link from "next/link";
import { Trip } from "@/src/features/rides/types";

interface RideCardProps {
  ride: Trip;
  isHistory?: boolean;
}

export function RideCard({ ride, isHistory = false }: RideCardProps) {
  const getFullLocation = (loc: any, fallback: string) => {
    if (!loc) return fallback;
    const parts = [
      loc.region?.name_uz || loc.region?.name,
      loc.district?.name_uz || loc.district?.name,
      loc.quarter?.name_uz || loc.quarter?.name,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : fallback;
  };

  // The 'ride' object might have nested objects or flat fields depending on the endpoint
  const from =
    ride.start_region?.name_uz || ride.start_region?.name || "Departure";
  const fromDistrict =
    ride.start_district?.name_uz || ride.start_district?.name;
  const fromQuarter = ride.start_quarter?.name_uz || ride.start_quarter?.name;

  const to = ride.end_region?.name_uz || ride.end_region?.name || "Destination";
  const toDistrict = ride.end_district?.name_uz || ride.end_district?.name;
  const toQuarter = ride.end_quarter?.name_uz || ride.end_quarter?.name;

  const fullFrom = [from, fromDistrict, fromQuarter].filter(Boolean).join(", ");
  const fullTo = [to, toDistrict, toQuarter].filter(Boolean).join(", ");

  const price = ride.price_per_seat || 0;

  return (
    <Link href={`/rides/${ride.id}`}>
      <div className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary transition-all cursor-pointer active:scale-[0.99]">
        <div className="flex items-center space-x-6 flex-1 min-w-0">
          <div className="w-14 h-14 bg-light-bg rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shrink-0">
            <HiLocationMarker className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-black text-dark-text flex items-center flex-wrap">
              <span className="truncate max-w-[200px]" title={fullFrom}>
                {from}
              </span>
              <HiChevronRight className="mx-2 text-gray-300 shrink-0" />
              <span className="truncate max-w-[200px]" title={fullTo}>
                {to}
              </span>
            </div>
            {(fromDistrict || toDistrict) && (
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5 flex items-center flex-wrap">
                {fromDistrict} {fromQuarter && `(${fromQuarter})`}
                <HiChevronRight className="mx-1.5 opacity-50" />
                {toDistrict} {toQuarter && `(${toQuarter})`}
              </div>
            )}
            <div className="text-sm font-bold text-gray-400 flex items-center mt-1">
              <HiClock className="mr-1.5" /> {formatDate(ride.start_time)}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-black text-primary mb-1">
            {formatCurrency(Number(price))}
          </div>
          <div
            className={`text-xs font-black uppercase tracking-widest ${
              isHistory
                ? "text-gray-400"
                : ride.status === "active"
                  ? "text-success"
                  : ride.status === "completed"
                    ? "text-primary"
                    : "text-error"
            }`}
          >
            {ride.status}
          </div>
        </div>
      </div>
    </Link>
  );
}
