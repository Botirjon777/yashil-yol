import Calendar from "@/src/components/ui/Calendar";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useInView } from "@/src/hooks/useInView";
import { cn } from "@/src/lib/utils";
import Typewriter from "@/src/components/ui/Typewriter";
import Autocomplete from "@/src/components/ui/Autocomplete";

interface HeroSectionProps {
  fromLocation: any;
  setFromLocation: (val: any) => void;
  toLocation: any;
  setToLocation: (val: any) => void;

  setFromQuery: (val: string) => void;
  setToQuery: (val: string) => void;

  fromSuggestions: any[];
  toSuggestions: any[];

  date: string;
  setDate: (val: string) => void;
  handleSearch: () => void;
  loading?: boolean;
}

export default function HeroSection({
  fromLocation,
  setFromLocation,
  toLocation,
  setToLocation,
  setFromQuery,
  setToQuery,
  fromSuggestions,
  toSuggestions,
  date,
  setDate,
  handleSearch,
  loading,
}: HeroSectionProps) {
  const { t } = useLanguageStore();
  const { ref, isInView } = useInView({ triggerOnce: true });

  const titleOptions = t("hero", "titleOptions") as unknown as string[];
  const finalTitleOptions = Array.isArray(titleOptions)
    ? titleOptions
    : [t("hero", "title")];

  return (
    <section
      ref={ref}
      className={cn(
        "relative min-h-[750px] flex items-center justify-center z-20 py-20",
        isInView ? "animate-in-top" : "opacity-0",
      )}
    >
      <div className="absolute inset-0 overflow-hidden -z-10">
        <img
          src="/assets/home/hero-bg.webp"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/55 via-white/50 to-white/95" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-7xl font-black text-dark-text mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 font-heading flex items-center justify-center">
          <Typewriter phrases={finalTitleOptions} pauseDuration={3000} />
        </h1>
        <p className="text-gray-500 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {t("hero", "subtitle")}
        </p>

        <div className="premium-card p-4 md:p-8 container-custom animate-in fade-in zoom-in duration-500 delay-300 relative z-30 shadow-2xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Autocomplete
              label={t("hero", "leavingFrom")}
              placeholder={t("hero", "searchPlaceholder")}
              value={fromLocation?.name}
              suggestions={fromSuggestions}
              onInputChange={setFromQuery}
              onSelect={setFromLocation}
              isLoading={loading}
            />
            <Autocomplete
              label={t("hero", "goingTo")}
              placeholder={t("hero", "destinationPlaceholder")}
              value={toLocation?.name}
              suggestions={toSuggestions}
              onInputChange={setToQuery}
              onSelect={setToLocation}
              isLoading={loading}
            />
          </div>

          <div className="flex flex-col md:flex-row items-end gap-6 pt-6 border-t border-border">
            <div className="grow w-full">
              <Calendar
                label={t("hero", "date")}
                value={date}
                onChange={setDate}
                placeholder={t("hero", "datePlaceholder")}
                className="text-left"
              />
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full md:w-64 h-14 text-lg"
              loading={loading}
              disabled={!fromLocation || !toLocation}
            >
              {t("hero", "searchButton")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
