import React from "react";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useInView } from "@/src/hooks/useInView";
import { cn } from "@/src/lib/utils";

export default function StatsSection() {
  const { t } = useLanguageStore();
  const { ref, isInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={cn(
        "py-12 bg-white border-y border-border",
        isInView ? "animate-in-left" : "opacity-0"
      )}
    >
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center uppercase tracking-widest text-xs font-bold text-gray-400">
          <div>
            <span className="block text-2xl text-dark-text mb-1">20,000+</span>
            {t('stats', 'users')}
          </div>
          <div>
            <span className="block text-2xl text-dark-text mb-1">14</span>
            {t('stats', 'regions')}
          </div>
          <div>
            <span className="block text-2xl text-dark-text mb-1">5,000+</span>
            {t('stats', 'dailyRides')}
          </div>
          <div>
            <span className="block text-2xl text-dark-text mb-1">100%</span>
            {t('stats', 'safe')}
          </div>
        </div>
      </div>
    </section>
  );
}
