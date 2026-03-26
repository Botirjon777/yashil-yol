"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiPhone, HiLockClosed } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export const LoginForm = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const { mutate, isPending, error: apiError } = useLogin();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  const { safeT } = useLanguageStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(
      { phone, password },
      {
        onSuccess: (data) => {
          setAuth(data.user, data.authorisation?.token);
          toast.success(safeT("auth", "login", "welcomeBack"));
          window.location.href = "/dashboard";
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || safeT("auth", "login", "loginFailed"));
        }
      }
    );
  };

  const displayError = (apiError as any)?.response?.data?.message || apiError?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
      {displayError && (
        <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold border border-error/20">
          {displayError}
        </div>
      )}
      <Input
        label={safeT("auth", "login", "emailLabel")}
        type="tel"
        placeholder="+998 xx xxx xx xx"
        iconLeft={<HiPhone className="w-5 h-5" />}
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
          <Link href="/auth/forgot-password" title={safeT("auth", "login", "forgotPassword")} className="text-sm font-bold text-primary hover:underline">
            {safeT("auth", "login", "forgotPassword")}
          </Link>
        </div>
      </div>

      <Checkbox label={safeT("auth", "login", "rememberMe")} />

      <Button type="submit" fullWidth size="lg" loading={isPending}>
        {safeT("auth", "login", "submitButton")}
      </Button>
    </form>
  );
};
