import React from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { FileUploader } from "../components/FileUploader";
import { Step2Data } from "../types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface DocumentsStepProps {
  data: Step2Data;
  onFileSelect: (field: keyof Step2Data, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isPending: boolean;
}

export function DocumentsStep({
  data,
  onFileSelect,
  onSubmit,
  onBack,
  isPending,
}: DocumentsStepProps) {
  const { t } = useLanguageStore();

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 animate-in slide-in-from-right duration-500"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-dark-text">
          {t("becomeDriver", "step2")?.title}
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="text-gray-400 hover:text-dark-text transition-colors flex items-center text-sm font-bold"
        >
          <HiChevronLeft className="mr-1" /> {t("becomeDriver", "step2")?.back}
        </button>
      </div>
      <p className="text-gray-500 text-sm font-medium">
        {t("becomeDriver", "step2")?.desc}
      </p>

      <div className="space-y-6">
        <FileUploader
          label={t("becomeDriver", "step2")?.licenseFront}
          onFileSelect={(f) => onFileSelect("driving_licence_front", f)}
          selectedFile={data.driving_licence_front}
        />
        <FileUploader
          label={t("becomeDriver", "step2")?.licenseBack}
          onFileSelect={(f) => onFileSelect("driving_licence_back", f)}
          selectedFile={data.driving_licence_back}
        />
        <FileUploader
          label={t("becomeDriver", "step2")?.passport}
          onFileSelect={(f) => onFileSelect("driver_passport_image", f)}
          selectedFile={data.driver_passport_image}
        />
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isPending}
          icon={<HiChevronRight className="order-last ml-2" />}
        >
          {t("becomeDriver", "step2")?.next}
        </Button>
      </div>
    </form>
  );
}
