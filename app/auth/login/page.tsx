"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMail, HiLockClosed } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="premium-card p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-dark-text mb-2">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Log in to find your perfect ride</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              iconLeft={<HiMail className="w-5 h-5" />}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                iconLeft={<HiLockClosed className="w-5 h-5" />}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end">
                <Link href="#" className="text-sm font-bold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Checkbox label="Remember me for 30 days" />

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

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
