"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiPhone } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import FormError from "@/src/components/ui/FormError";
import { useSendResetCode } from "../hooks/useAuth";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export const ForgotPasswordForm = () => {
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate, isPending, error: apiError } = useSendResetCode();
  const { safeT } = useLanguageStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { phone: `+998${phone}` },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          toast.success(safeT("auth", "forgotPassword", "resetLinkSent"));
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              err.message ||
              safeT("auth", "forgotPassword", "resetFailed"),
          );
        },
      },
    );
  };

  const displayError =
    (apiError as any)?.response?.data?.message || apiError?.message;

  if (isSubmitted) {
    return (
      <div className="py-2 md:py-3 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <HiPhone className="w-8 h-8" />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-dark-text mb-2">
          {safeT("auth", "forgotPassword", "successTitle")}
        </h2>
        <p className="text-gray-500 font-medium mb-6 text-sm md:text-base leading-relaxed text-balance">
          {safeT("auth", "forgotPassword", "successSubtitle")} <br />
          <span className="text-dark-text font-black text-base md:text-lg">
            +998{phone}
          </span>
        </p>
        <div className="space-y-2">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setIsSubmitted(false)}
            className="h-12 text-sm rounded-xl"
          >
            {safeT("auth", "forgotPassword", "resendEmail")}
          </Button>
          <Link href="/auth/login" className="block w-full">
            <Button variant="ghost" fullWidth className="h-12 text-sm">
              {safeT("auth", "forgotPassword", "returnToLogin")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <FormError message={displayError} />
      <Input
        label={safeT("auth", "forgotPassword", "emailLabel")}
        type="tel"
        prefixText="+998"
        placeholder={
          safeT("auth", "forgotPassword", "emailPlaceholder") || "90 123 45 67"
        }
        required
        value={phone}
        className="ml-2.5"
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          if (val.length <= 9) setPhone(val);
        }}
        iconLeft={<HiPhone className="w-5 h-5 text-gray-400" />}
      />

      <div className="pt-1">
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isPending}
          className="h-12 md:h-14 shadow-lg shadow-primary/5"
        >
          {safeT("auth", "forgotPassword", "submitButton")}
        </Button>
      </div>
    </form>
  );
};
