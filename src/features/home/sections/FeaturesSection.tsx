import {
  HiShieldCheck,
  HiCurrencyDollar,
  HiLightningBolt,
} from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import FeatureCard from "../components/FeatureCard";
import { useInView } from "@/src/hooks/useInView";
import { cn } from "@/src/lib/utils";

export default function FeaturesSection() {
  const { t } = useLanguageStore();
  const { ref, isInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={cn(
        "py-10 md:py-16 bg-light-bg",
        isInView ? "animate-in-right" : "opacity-0"
      )}
    >
      <div className="container-custom">
        <div className="text-center mb-16 px-4">
          <h2 className="text-2xl md:text-5xl font-black text-dark-text mb-4 font-heading uppercase tracking-normal">
            {t("features", "why")}
          </h2>
          <div className="h-1.5 w-16 md:w-24 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<HiShieldCheck className="w-8 h-8" />}
            title={t("features", "driverTitle")}
            description={t("features", "driverDesc")}
          />
          <FeatureCard
            icon={<HiCurrencyDollar className="w-8 h-8" />}
            title={t("features", "priceTitle")}
            description={t("features", "priceDesc")}
          />
          <FeatureCard
            icon={<HiLightningBolt className="w-8 h-8" />}
            title={t("features", "bookingTitle")}
            description={t("features", "bookingDesc")}
          />
        </div>
      </div>
    </section>
  );
}
