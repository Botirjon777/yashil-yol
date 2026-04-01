import React from "react";
import { HiChevronRight } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Step1Data } from "../types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface InfoStepProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function InfoStep({
  data,
  onChange,
  onSubmit,
  isPending,
}: InfoStepProps) {
  const { t } = useLanguageStore();

  const isLicenseValid = (val: string) => /^[A-Z]{2}[0-9]{7}$/.test(val);
  const licenseError = data.driving_license_number && !isLicenseValid(data.driving_license_number) 
    ? t("becomeDriver", "toasts")?.licenseFormatError 
    : "";

  const formatDate = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length > 0) {
      formatted += digits.slice(0, 2);
      if (digits.length > 2) {
        formatted += "." + digits.slice(2, 4);
        if (digits.length > 4) {
          formatted += "." + digits.slice(4, 8);
        }
      }
    }
    return formatted;
  };

  const parseDate = (str: string) => {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(str)) return null;
    const [d, m, y] = str.split(".").map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
  };

  const getBirthError = () => {
    if (!data.birthday) return "";
    if (data.birthday.length < 10) return "";
    const date = parseDate(data.birthday);
    if (!date) return t("becomeDriver", "toasts")?.dateInvalidError;
    if (date > new Date()) return t("becomeDriver", "toasts")?.datePastError;
    return "";
  };

  const getExpirationError = () => {
    if (!data.driving_license_expiration_date) return "";
    if (data.driving_license_expiration_date.length < 10) return "";
    const date = parseDate(data.driving_license_expiration_date);
    if (!date) return t("becomeDriver", "toasts")?.dateInvalidError;
    if (date < new Date()) return t("becomeDriver", "toasts")?.dateFutureError;
    
    // Check against birth year
    const birthDate = parseDate(data.birthday);
    if (birthDate && date.getFullYear() <= birthDate.getFullYear()) {
      return t("becomeDriver", "toasts")?.expirationBirthError;
    }
    return "";
  };

  const birthError = getBirthError();
  const expirationError = getExpirationError();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLicenseValid(data.driving_license_number) || birthError || expirationError) {
      return;
    }
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in slide-in-from-right duration-500"
    >
      <h2 className="text-2xl font-black text-dark-text mb-2">
        {t("becomeDriver", "step1")?.title}
      </h2>
      <p className="text-gray-500 text-sm font-medium mb-6">
        {t("becomeDriver", "step1")?.desc}
      </p>

      <Input
        label={t("becomeDriver", "step1")?.licenseLabel}
        placeholder={t("becomeDriver", "step1")?.licensePlaceholder}
        value={data.driving_license_number}
        error={licenseError}
        onChange={(e) => {
          const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9);
          onChange({ ...data, driving_license_number: val });
        }}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("becomeDriver", "step1")?.expirationLabel}
          placeholder={t("becomeDriver", "step1")?.datePlaceholder}
          value={data.driving_license_expiration_date}
          error={expirationError}
          onChange={(e) =>
            onChange({
              ...data,
              driving_license_expiration_date: formatDate(e.target.value),
            })
          }
          required
        />
        <Input
          label={t("becomeDriver", "step1")?.birthdayLabel}
          placeholder={t("becomeDriver", "step1")?.datePlaceholder}
          value={data.birthday}
          error={birthError}
          onChange={(e) => onChange({ ...data, birthday: formatDate(e.target.value) })}
          required
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
          {t("becomeDriver", "step1")?.next}
        </Button>
      </div>
    </form>
  );
}
