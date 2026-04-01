import React from "react";
import { HiChevronLeft, HiPhotograph, HiUpload } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { FileUploader } from "../components/FileUploader";
import { Step4Data } from "../types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface CarImagesStepProps {
  data: Step4Data;
  onFileSelect: (field: keyof Omit<Step4Data, "car_images">, file: File | null) => void;
  onCarImagesChange: (files: FileList | null) => void;
  onRemoveCarImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isPending: boolean;
}

export function CarImagesStep({ 
  data, 
  onFileSelect, 
  onCarImagesChange, 
  onRemoveCarImage, 
  onSubmit, 
  onBack, 
  isPending 
}: CarImagesStepProps) {
  const { t } = useLanguageStore();

  return (
    <form onSubmit={onSubmit} className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-dark-text">{t("becomeDriver", "step4")?.title}</h2>
        <button type="button" onClick={onBack} className="text-gray-400 hover:text-dark-text transition-colors flex items-center text-sm font-bold">
          <HiChevronLeft className="mr-1" /> {t("becomeDriver", "step2")?.back}
        </button>
      </div>
      <p className="text-gray-500 text-sm font-medium">{t("becomeDriver", "step4")?.desc}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploader
          label={t("becomeDriver", "step4")?.techFront}
          onFileSelect={(f) => onFileSelect("tech_passport_front", f)}
          selectedFile={data.tech_passport_front}
        />
        <FileUploader
          label={t("becomeDriver", "step4")?.techBack}
          onFileSelect={(f) => onFileSelect("tech_passport_back", f)}
          selectedFile={data.tech_passport_back}
        />
      </div>

      <div className="w-full">
        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">{t("becomeDriver", "step4")?.carImages}</label>
        <div className="mt-1.5 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.car_images.map((file, idx) => (
            <div key={idx} className="aspect-square bg-success/5 border-2 border-success rounded-2xl flex flex-col items-center justify-center text-success relative overflow-hidden group">
              <HiPhotograph className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-bold px-2 truncate w-full text-center">{file.name}</span>
              <button 
                type="button" 
                onClick={() => onRemoveCarImage(idx)}
                className="absolute inset-0 bg-error/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs"
              >
                {t("becomeDriver", "step4")?.remove}
              </button>
            </div>
          ))}
          <label className="aspect-square border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-all group">
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => onCarImagesChange(e.target.files)} />
            <HiUpload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase">{t("becomeDriver", "step4")?.addMore}</span>
          </label>
        </div>
      </div>

      <div className="pt-6">
        <Button type="submit" fullWidth size="lg" loading={isPending}>
          {t("becomeDriver", "step4")?.submit}
        </Button>
      </div>
    </form>
  );
}
