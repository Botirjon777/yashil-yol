"use client";

import React from "react";
import Link from "next/link";
import { LoginForm } from "@/src/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="premium-card p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-dark-text mb-2">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Log in to find your perfect ride</p>
          </div>

          <LoginForm />

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-gray-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
