"use client";

import React from "react";
import Link from "next/link";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { AuthPageLayout } from "@/src/features/auth/components/AuthPageLayout";

const LoginPage = () => {
  const { safeT } = useLanguageStore();

  return (
    <AuthPageLayout
      imageSide="left"
      backgroundImage="/assets/auth/login-bg.webp"
      title={safeT("auth", "login", "title")}
      subtitle={safeT("auth", "login", "subtitle")}
    >
      <LoginForm />

      <div className="mt-4 pt-4 border-t border-border/40 text-center">
        <p className="text-gray-400 font-medium text-xs">
          {safeT("auth", "login", "noAccount")}{" "}
          <Link
            href="/auth/register"
            className="text-primary font-black hover:underline tracking-tight"
          >
            {safeT("auth", "login", "createAccount")}
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default LoginPage;
