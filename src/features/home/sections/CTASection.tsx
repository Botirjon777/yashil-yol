import React from "react";
import { HiTicket } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useInView } from "@/src/hooks/useInView";
import { cn } from "@/src/lib/utils";

export default function CTASection() {
  const { t } = useLanguageStore();
  const { ref, isInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={cn(
        "py-10 md:py-16",
        isInView ? "animate-in-top" : "opacity-0"
      )}
    >
      <div className="container-custom">
        <div className="bg-primary rounded-lg p-5 md:p-10 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative font-heading">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 -skew-x-12 translate-x-20" />

          <div className="max-w-xl text-center md:text-left z-10">
            <h2 className="text-2xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
              {t("cta", "title")}
            </h2>
            <p className="text-indigo-100 text-sm md:text-lg font-bold mb-10">
              {t("cta", "subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-4">
              <Button variant="secondary" size="lg">
                {t("cta", "button")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 border border-white/20"
              >
                {t("cta", "howItWorks")}
              </Button>
            </div>
          </div>

          <div className="mt-12 md:mt-0 relative z-10">
            <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <HiTicket className="w-32 h-32 rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
