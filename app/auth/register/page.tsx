"use client";

import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="premium-card p-8 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-3xl font-black text-dark-text mb-4">
                Create Account
              </h1>
              <p className="text-gray-500 font-medium mb-8">
                Join our community and start traveling smarter across the
                country.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center text-gray-600 font-medium">
                  <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center mr-3 shrink-0">
                    ✓
                  </div>
                  Save up to 60% on travel
                </li>
                <li className="flex items-center text-gray-600 font-medium">
                  <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center mr-3 shrink-0">
                    ✓
                  </div>
                  Verified & rated drivers
                </li>
                <li className="flex items-center text-gray-600 font-medium">
                  <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center mr-3 shrink-0">
                    ✓
                  </div>
                  Easy balance-based payments
                </li>
              </ul>
            </div>

            <div>
              <RegisterForm />

              <p className="text-center text-gray-500 text-sm font-medium mt-6">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-bold hover:underline"
                >
                  Log in
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

