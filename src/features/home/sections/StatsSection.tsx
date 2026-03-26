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
      <div className="container-custom grid grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col items-center group">
            <span className="block text-3xl md:text-5xl font-black text-dark-text mb-2 transition-all group-hover:scale-110">20,000+</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center">{t('stats', 'users')}</span>
          </div>
          <div className="flex flex-col items-center group">
            <span className="block text-3xl md:text-5xl font-black text-dark-text mb-2 transition-all group-hover:scale-110">14</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center">{t('stats', 'regions')}</span>
          </div>
          <div className="flex flex-col items-center group">
            <span className="block text-3xl md:text-5xl font-black text-dark-text mb-2 transition-all group-hover:scale-110">5,000+</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center">{t('stats', 'dailyRides')}</span>
          </div>
          <div className="flex flex-col items-center group">
            <span className="block text-3xl md:text-5xl font-black text-dark-text mb-2 transition-all group-hover:scale-110">100%</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center">{t('stats', 'safe')}</span>
          </div>
      </div>
    </section>
  );
}
