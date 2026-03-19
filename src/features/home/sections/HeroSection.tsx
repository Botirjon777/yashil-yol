import Dropdown from "@/src/components/ui/Dropdown";
import Calendar from "@/src/components/ui/Calendar";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useInView } from "@/src/hooks/useInView";
import { cn } from "@/src/lib/utils";
import Typewriter from "@/src/components/ui/Typewriter";

interface HeroSectionProps {
  from: string;
  setFrom: (val: string) => void;
  to: string;
  setTo: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  passengers: number;
  setPassengers: (val: number) => void;
  handleSearch: () => void;
  regionOptions: { id: string | number; name: string }[];
  passengerOptions: { id: string | number; name: string }[];
}

export default function HeroSection({
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
}: HeroSectionProps) {
  const { t } = useLanguageStore();
  const { ref, isInView } = useInView({ triggerOnce: true });

  // Get title options from translations, fallback to static title if not available
  const titleOptions = t("hero", "titleOptions") as unknown as string[];
  const finalTitleOptions = Array.isArray(titleOptions) ? titleOptions : [t("hero", "title")];

  return (
    <section
      ref={ref}
      className={cn(
        "relative h-[650px] flex items-center justify-center z-20",
        isInView ? "animate-in-top" : "opacity-0"
      )}
    >
      <div className="absolute inset-0 overflow-hidden -z-10 bg-[#EEF2FF]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/10 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-7xl font-black text-dark-text mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 font-heading min-h-[1.2em]">
          <Typewriter phrases={finalTitleOptions} pauseDuration={3000} />
        </h1>
        <p className="text-gray-500 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {t("hero", "subtitle")}
        </p>

        <div className="premium-card p-6 md:p-10 container-custom animate-in fade-in zoom-in duration-500 delay-300 relative z-30">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="grow grid grid-cols-1 md:grid-cols-3 gap-6">
              <Dropdown
                label={t("hero", "leavingFrom")}
                options={regionOptions}
                value={from}
                onChange={setFrom}
                placeholder={t("hero", "searchPlaceholder")}
                className="text-left"
              />
              <Dropdown
                label={t("hero", "goingTo")}
                options={regionOptions}
                value={to}
                onChange={setTo}
                placeholder={t("hero", "destinationPlaceholder")}
                className="text-left"
              />
              <Calendar
                label={t("hero", "date")}
                value={date}
                onChange={setDate}
                placeholder={t("hero", "datePlaceholder")}
                className="text-left"
              />
            </div>
            <div className="flex items-end space-x-4">
              <Dropdown
                label={t("hero", "passengers")}
                options={passengerOptions}
                value={passengers}
                onChange={setPassengers}
                placeholder="1"
                className="w-40 text-left"
              />
              <Button onClick={handleSearch}>
                {t("hero", "searchButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
