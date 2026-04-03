"use client";

import React, { useState } from "react";
import { HiUser, HiMail, HiLockClosed, HiPhone } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";
import FormError from "@/src/components/ui/FormError";
import { useRegister } from "../hooks/useAuth";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

  const { mutate, isPending, error: apiError } = useRegister();
  const { safeT } = useLanguageStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (formData.password !== formData.confirmPassword) {
      setLocalError(safeT("auth", "register", "passwordsDoNotMatch"));
      return;
    }

    mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        email: formData.email,
        phone: `+998${formData.phone}`,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      },
      {
        onSuccess: (data: any) => {
          toast.success(
            data.message || safeT("auth", "register", "accountCreated"),
          );
          window.location.href = `/auth/verify?phone=${encodeURIComponent(`+998${formData.phone}`)}&code=${data.code}`;
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              err.message ||
              safeT("auth", "register", "registrationFailed"),
          );
        },
      },
    );
  };

  const displayError =
    localError ||
    (apiError as any)?.response?.data?.message ||
    (apiError as any)?.response?.data?.errors
      ? Object.values((apiError as any).response.data.errors)
          .flat()
          .join(", ")
      : apiError?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
      <FormError message={displayError} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Input
          label={safeT("auth", "register", "firstNameLabel")}
          name="firstName"
          placeholder={safeT("auth", "register", "firstNamePlaceholder")}
          required
          value={formData.firstName}
          onChange={handleChange}
          iconLeft={<HiUser className="w-5 h-5" />}
        />
        <Input
          label={safeT("auth", "register", "lastNameLabel")}
          name="lastName"
          placeholder={safeT("auth", "register", "lastNamePlaceholder")}
          required
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Input
          label={safeT("auth", "register", "fatherNameLabel")}
          name="fatherName"
          placeholder={safeT("auth", "register", "fatherNamePlaceholder")}
          value={formData.fatherName}
          onChange={handleChange}
        />
        <Input
          label={safeT("auth", "register", "emailLabel")}
          name="email"
          type="email"
          placeholder={safeT("auth", "register", "emailPlaceholder")}
          required
          value={formData.email}
          onChange={handleChange}
          iconLeft={<HiMail className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Input
          label={safeT("auth", "register", "phoneLabel")}
          name="phone"
          type="tel"
          placeholder={safeT("auth", "register", "phonePlaceholder")}
          prefixText="+998"
          required
          value={formData.phone}
          className="ml-2.5"
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, ""); // Only digits
            if (val.length <= 9) {
              setFormData((prev) => ({ ...prev, phone: val }));
            }
          }}
          iconLeft={<HiPhone className="w-5 h-5" />}
        />
        <div className="hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Input
          label={safeT("auth", "register", "passwordLabel")}
          name="password"
          type="password"
          placeholder={safeT("auth", "register", "passwordPlaceholder")}
          required
          value={formData.password}
          onChange={handleChange}
          iconLeft={<HiLockClosed className="w-5 h-5" />}
        />
        <Input
          label={safeT("auth", "register", "confirmPasswordLabel")}
          name="confirmPassword"
          type="password"
          placeholder={safeT("auth", "register", "confirmPasswordPlaceholder")}
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div className="pt-1">
        <Checkbox
          label={safeT("auth", "register", "termsAgreement")}
          required
        />
      </div>

      <div className="pt-1">
        <Button type="submit" fullWidth size="lg" loading={isPending}>
          {safeT("auth", "register", "submitButton")}
        </Button>
      </div>
    </form>
  );
};
