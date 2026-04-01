import { HiCheckCircle, HiCamera } from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface FileUploaderProps {
  label: string;
  onFileSelect: (f: File | null) => void;
  selectedFile: File | null;
}

export function FileUploader({
  label,
  onFileSelect,
  selectedFile,
}: FileUploaderProps) {
  const { t } = useLanguageStore();

  return (
    <div className="w-full">
      <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="mt-1.5 relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`file-${label}`}
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
        <label
          htmlFor={`file-${label}`}
          className={cn(
            "flex flex-col items-center justify-center w-full min-h-[100px] rounded-2xl border-2 border-dashed transition-all cursor-pointer group",
            selectedFile
              ? "border-success bg-success/5"
              : "border-border hover:border-primary hover:bg-primary/5",
          )}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center text-success animate-in fade-in zoom-in duration-300">
              <HiCheckCircle className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold truncate max-w-[150px]">
                {selectedFile.name}
              </span>
            </div>
          ) : (
            <>
              <HiCamera className="w-6 h-6 text-gray-400 mb-1 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary transition-colors text-center px-4">
                {t("becomeDriver", "uploader")?.select}
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
