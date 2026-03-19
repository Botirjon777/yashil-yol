"use client";

import React, { useState } from "react";
import { HiUser, HiMail, HiLockClosed, HiPhone } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";
import { useRegister } from "../hooks/useAuth";
import { useAuthStore } from "@/src/providers/AuthProvider";
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
  const setAuth = useAuthStore((state: any) => state.setAuth);
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
        phone: formData.phone,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          setAuth(data.user, data.token);
          toast.success(safeT("auth", "register", "accountCreated"));
          window.location.href = `/auth/verify?phone=${encodeURIComponent(formData.phone)}`;
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || safeT("auth", "register", "registrationFailed"));
        }
      },
    );
  };

  const displayError =
    localError ||
    (apiError as any)?.response?.data?.message ||
    apiError?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
      {displayError && (
        <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold border border-error/20">
          {displayError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={safeT("auth", "register", "firstNameLabel")}
          name="firstName"
          placeholder={safeT("auth", "register", "firstNamePlaceholder")}
          required
          value={formData.firstName}
          onChange={handleChange}
          iconLeft={<HiUser className="w-4 h-4" />}
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
        iconLeft={<HiMail className="w-4 h-4" />}
      />
      <Input
        label={safeT("auth", "register", "phoneLabel")}
        name="phone"
        type="tel"
        placeholder={safeT("auth", "register", "phonePlaceholder")}
        required
        value={formData.phone}
        onChange={handleChange}
        iconLeft={<HiPhone className="w-4 h-4" />}
      />
      <Input
        label={safeT("auth", "register", "passwordLabel")}
        name="password"
        type="password"
        placeholder={safeT("auth", "register", "passwordPlaceholder")}
        required
        value={formData.password}
        onChange={handleChange}
        iconLeft={<HiLockClosed className="w-4 h-4" />}
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

      <div className="pt-2">
        <Checkbox label={safeT("auth", "register", "termsAgreement")} required />
      </div>

      <Button type="submit" fullWidth size="lg" loading={isPending}>
        {safeT("auth", "register", "submitButton")}
      </Button>
    </form>
  );
};
