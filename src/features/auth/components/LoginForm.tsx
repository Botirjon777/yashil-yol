"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "@/src/providers/AuthProvider";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { mutate, isPending, error: apiError } = useLogin();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setAuth(data.user, data.token);
          toast.success("Welcome back!");
          window.location.href = "/dashboard";
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || "Login failed");
        }
      }
    );
  };

  const displayError = (apiError as any)?.response?.data?.message || apiError?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {displayError && (
        <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold border border-error/20">
          {displayError}
        </div>
      )}
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
          <Link href="/auth/forgot-password" title="Forgot password?" className="text-sm font-bold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>

      <Checkbox label="Remember me for 30 days" />

      <Button type="submit" fullWidth size="lg" loading={isPending}>
        Sign In
      </Button>
    </form>
  );
};
