import React from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { HiUserCircle } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface FatherNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const FatherNameModal: React.FC<FatherNameModalProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const { t } = useLanguageStore();
  const translations = t("dashboard", "fatherNameModal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translations?.title || "Complete Profile"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-8 p-2 text-center">
        <div className="space-y-3">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <HiUserCircle className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-black text-dark-text">
            {translations?.title}
          </h4>
          <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
            {translations?.subtitle}
          </p>
        </div>

        <div className="text-left">
          <Input
            label={(translations?.inputLabel || "Father's Name") + " *"}
            placeholder={t("dashboard", "profile")?.fatherNamePlaceholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="py-4"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 px-6"
          >
            {translations?.later || "Later"}
          </Button>
          <Button
            variant="primary"
            loading={isLoading}
            type="submit"
            size="lg"
            className="px-12"
            disabled={!value.trim()}
          >
            {translations?.save || "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
