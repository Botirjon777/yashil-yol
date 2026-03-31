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
        isInView ? "animate-in-top" : "opacity-0",
      )}
    >
      <div className="container-custom">
        <div className="bg-primary rounded-lg p-5 md:p-10 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative font-heading">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/home/cto-bg.webp"
              alt="CTA Background"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-10 -skew-x-12 translate-x-20" />

          <div className="max-w-xl text-center md:text-left z-10">
            <h2 className="text-2xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
              {t("cta", "title")}
            </h2>
            <p className="text-white text-sm md:text-lg font-bold mb-10">
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
        </div>
      </div>
    </section>
  );
}
