"use client";

import React from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { ForgotPasswordForm } from "@/src/features/auth/components/ForgotPasswordForm";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { AuthPageLayout } from "@/src/features/auth/components/AuthPageLayout";

const ForgotPasswordPage = () => {
  const { safeT } = useLanguageStore();

  return (
    <AuthPageLayout
      imageSide="left"
      title={safeT("auth", "forgotPassword", "title")}
      subtitle={safeT("auth", "forgotPassword", "subtitle")}
    >
      <Link
        href="/auth/login"
        className="inline-flex items-center text-sm font-black text-gray-400 hover:text-primary transition-colors mb-8 group uppercase tracking-widest"
      >
        <HiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />{" "}
        {safeT("auth", "forgotPassword", "returnToLogin")}
      </Link>

      <ForgotPasswordForm />
    </AuthPageLayout>
  );
};

export default ForgotPasswordPage;
