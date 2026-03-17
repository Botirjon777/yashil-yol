"use client";

import React from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { ForgotPasswordForm } from "@/src/features/auth/components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-8 group"
        >
          <HiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Log in
        </Link>

        <div className="premium-card p-8 md:p-10 text-center">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
