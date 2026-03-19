"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMail } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useForgotPassword } from "../hooks/useAuth";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { mutate, isPending, error: apiError } = useForgotPassword();
  const { safeT } = useLanguageStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(
      { email },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          toast.success(safeT("auth", "forgotPassword", "resetLinkSent"));
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || safeT("auth", "forgotPassword", "resetFailed"));
        }
      }
    );
  };

  const displayError = (apiError as any)?.response?.data?.message || apiError?.message;

  if (isSubmitted) {
    return (
      <div className="py-4">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <HiMail className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-dark-text mb-4">
          {safeT("auth", "forgotPassword", "successTitle")}
        </h2>
        <p className="text-gray-500 font-medium mb-8 text-center text-balance">
          {safeT("auth", "forgotPassword", "successSubtitle")} <br />
          <span className="text-dark-text font-black">{email}</span>
        </p>
        <Button 
          variant="outline" 
          fullWidth 
          onClick={() => setIsSubmitted(false)}
          className="mb-4"
        >
          {safeT("auth", "forgotPassword", "resendEmail")}
        </Button>
        <Link href="/auth/login" className="block w-full">
          <Button variant="ghost" fullWidth>
            {safeT("auth", "forgotPassword", "returnToLogin")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-black text-dark-text mb-4">
        {safeT("auth", "forgotPassword", "title")}
      </h1>
      <p className="text-gray-500 font-medium mb-8">
        {safeT("auth", "forgotPassword", "subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
        {displayError && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold border border-error/20 text-center">
            {displayError}
          </div>
        )}
        <Input
          label={safeT("auth", "forgotPassword", "emailLabel")}
          type="email"
          placeholder={safeT("auth", "forgotPassword", "emailPlaceholder")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          iconLeft={<HiMail className="w-5 h-5" />}
        />

        <Button type="submit" fullWidth size="lg" loading={isPending}>
          {safeT("auth", "forgotPassword", "submitButton")}
        </Button>
      </form>
    </>
  );
};
