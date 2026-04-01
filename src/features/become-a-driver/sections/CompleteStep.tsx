import { HiCheckCircle } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface CompleteStepProps {
  onGoToDashboard: () => void;
}

export function CompleteStep({ onGoToDashboard }: CompleteStepProps) {
  const { t } = useLanguageStore();

  return (
    <div className="premium-card p-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
        <HiCheckCircle />
      </div>
      <h2 className="text-3xl font-black text-dark-text mb-4">
        {t("becomeDriver", "complete")?.title}
      </h2>
      <p className="text-gray-500 font-medium mb-8">
        {t("becomeDriver", "complete")?.desc}
      </p>
      <Button size="lg" onClick={onGoToDashboard}>
        {t("becomeDriver", "complete")?.dashboard}
      </Button>
    </div>
  );
}
