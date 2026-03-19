"use client";

import React from "react";
import Link from "next/link";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const LoginPage = () => {
  const { safeT } = useLanguageStore();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="premium-card p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-dark-text mb-2">
              {safeT("auth", "login", "title")}
            </h1>
            <p className="text-gray-500 font-medium">
              {safeT("auth", "login", "subtitle")}
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-gray-500 font-medium">
              {safeT("auth", "login", "noAccount")}{" "}
              <Link href="/auth/register" className="text-primary font-bold hover:underline">
                {safeT("auth", "login", "createAccount")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
