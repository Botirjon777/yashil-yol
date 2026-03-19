"use client";

import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const RegisterPage = () => {
  const { safeT, t } = useLanguageStore();
  const benefits = t("auth", "register")?.benefits || [];

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="premium-card p-8 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-3xl font-black text-dark-text mb-4">
                {safeT("auth", "register", "title")}
              </h1>
              <p className="text-gray-500 font-medium mb-8">
                {safeT("auth", "register", "subtitle")}
              </p>

              <ul className="space-y-4">
                {Array.isArray(benefits) && benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-600 font-medium">
                    <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center mr-3 shrink-0">
                      ✓
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <RegisterForm />

              <p className="text-center text-gray-500 text-sm font-medium mt-6">
                {safeT("auth", "register", "hasAccount")}{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-bold hover:underline"
                >
                  {safeT("auth", "register", "login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

