"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/auth/verify";
    }, 1500);
  };

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Alisher"
                  required
                  iconLeft={<HiUser className="w-4 h-4" />}
                />
                <Input label="Last Name" placeholder="Navoiy" required />
              </div>
              <Input label="Father's Name" placeholder="Optional" />
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
                iconLeft={<HiMail className="w-4 h-4" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                required
                iconLeft={<HiLockClosed className="w-4 h-4" />}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm"
                required
              />

              <div className="pt-2">
                <Checkbox
                  label="I agree to the Terms and Conditions"
                  required
                />
              </div>

              <Button type="submit" fullWidth size="lg" loading={isLoading}>
                Create Account
              </Button>

              <p className="text-center text-gray-500 text-sm font-medium mt-4">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
