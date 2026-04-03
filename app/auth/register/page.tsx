"use client";

import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { AuthPageLayout } from "@/src/features/auth/components/AuthPageLayout";

const RegisterPage = () => {
  const { safeT, t } = useLanguageStore();
  const benefits = t("auth", "register")?.benefits || [];

  return (
    <AuthPageLayout
      imageSide="right"
      backgroundImage="/assets/auth/register-bg.webp"
      title={safeT("auth", "register", "title")}
      subtitle={safeT("auth", "register", "subtitle")}
    >
      <div className="mb-4 md:mb-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {Array.isArray(benefits) &&
            benefits.map((benefit: string, index: number) => (
              <li
                key={index}
                className="flex items-center text-gray-600 font-bold text-xs"
              >
                <div className="w-4 h-4 bg-success/10 text-success rounded-md flex items-center justify-center mr-2 shrink-0 text-[10px]">
                  ✓
                </div>
                {benefit}
              </li>
            ))}
        </ul>
      </div>

      <RegisterForm />

      <p className="text-center text-gray-400 text-xs font-medium mt-4 pt-4 border-t border-border/40">
        {safeT("auth", "register", "hasAccount")}{" "}
        <Link
          href="/auth/login"
          className="text-primary font-black hover:underline tracking-tight"
        >
          {safeT("auth", "register", "login")}
        </Link>
      </p>
    </AuthPageLayout>
  );
};

export default RegisterPage;
