import { useState } from "react";
import { useRouter } from "next/navigation";
import { UZBEKISTAN_REGIONS } from "@/src/lib/regions";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export const useHomeSearch = () => {
  const { t } = useLanguageStore();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    params.set("passengers", passengers.toString());

    router.push(`/rides?${params.toString()}`);
  };

  const regionOptions = UZBEKISTAN_REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
  }));

  const passengerOptions = [
    { id: 1, name: `1 ${t('hero', 'passengerCount')}${t('hero', 'passengerCount') === 'Passenger' ? '' : ''}` },
    { id: 2, name: `2 ${t('hero', 'passengerCount')}s` },
    { id: 3, name: `3 ${t('hero', 'passengerCount')}s` },
    { id: 4, name: `4 ${t('hero', 'passengerCount')}s` },
  ];

  return {
    from,
    setFrom,
    to,
    setTo,
    date,
    setDate,
    passengers,
    setPassengers,
    handleSearch,
    regionOptions,
    passengerOptions,
  };
};
