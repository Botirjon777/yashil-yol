"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiPhone, HiLockClosed } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";
import FormError from "@/src/components/ui/FormError";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { parseError, isValidPhone } from "@/src/lib/errorUtils";

export const LoginForm = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate, isPending, error: apiError } = useLogin();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  const { safeT } = useLanguageStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation: Check if input is a valid phone number
    if (!isValidPhone(phone)) {
      setLocalError(
        safeT("auth", "login", "phoneInvalid") ||
          "Iltimos, to'g'ri telefon raqami kiriting.",
      );
      return;
    }

    mutate(
      { phone: `+998${phone}`, password },
      {
        onSuccess: (data) => {
          setAuth(data.user, data.authorisation?.token);
          window.location.href = "/dashboard";
        },
        onError: (err: any) => {
          parseError(err, safeT("auth", "login", "loginFailed"));
        },
      },
    );
  };

  const displayError = localError || (apiError ? parseError(apiError) : null);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
      <FormError message={displayError} />
      <Input
        label={safeT("auth", "login", "phoneLabel")}
        name="phone"
        autoComplete="tel"
        type="tel"
        placeholder={safeT("auth", "login", "phonePlaceholder")}
        prefixText="+998"
        iconLeft={<HiPhone className="w-5 h-5" />}
        className="ml-2.5"
        required
        value={phone}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, ""); // Only digits
          if (val.length <= 9) setPhone(val); // Limit to 9 digits for UZ
          if (localError) setLocalError(null);
        }}
        error={
          phone && phone.length < 9
            ? safeT("auth", "login", "phoneInvalid") ||
              "Iltimos, to'g'ri telefon raqami kiriting."
            : undefined
        }
      />

      <div className="space-y-2.5 md:space-y-5">
        <Input
          label={safeT("auth", "login", "passwordLabel")}
          type="password"
          placeholder={safeT("auth", "login", "passwordPlaceholder")}
          iconLeft={<HiLockClosed className="w-5 h-5" />}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            title={safeT("auth", "login", "forgotPassword")}
            className="text-[10px] md:text-xs font-medium text-primary hover:underline uppercase tracking-widest"
          >
            {safeT("auth", "login", "forgotPassword")}
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <Checkbox label={safeT("auth", "login", "rememberMe")} />
      </div>

      <div className="pt-1">
        <Button type="submit" fullWidth size="lg" loading={isPending}>
          {safeT("auth", "login", "submitButton")}
        </Button>
      </div>
    </form>
  );
};
