"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { toast } from "sonner";
import { useVerifyCode, useResendCode } from "@/src/features/auth/hooks/useAuth";
import { AuthPageLayout } from "@/src/features/auth/components/AuthPageLayout";

const VerifyForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { safeT } = useLanguageStore();
  const phone = searchParams.get("phone") || "";
  const initialCode = searchParams.get("code") || "";
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verify, isPending: isVerifying } = useVerifyCode();
  const { mutate: resend, isPending: isResending } = useResendCode();

  useEffect(() => {
    if (initialCode && initialCode.length === 6) {
      setCode(initialCode.split(""));
    }
  }, [initialCode]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value)) && value !== "") return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length < 6) {
      toast.error(safeT("auth", "verify", "incompleteCode"));
      return;
    }

    verify(
      { phone, code: verificationCode },
      {
        onSuccess: () => {
          toast.success(safeT("auth", "verify", "success"));
          router.push("/auth/login"); // After verification, go to login
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || safeT("auth", "verify", "error"));
        }
      }
    );
  };

  const handleResend = () => {
    if (!phone) return;
    resend(
      { phone },
      {
        onSuccess: (data: any) => {
          toast.success(data.message || safeT("auth", "verify", "resendSuccess"));
          if (data.code) {
             // If backend returns the new code (dev mode), update URL or state
             console.log("New code:", data.code);
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || safeT("auth", "verify", "resendError"));
        }
      }
    );
  };

  return (
    <AuthPageLayout
      imageSide="right"
      title={safeT("auth", "verify", "title")}
      subtitle={safeT("auth", "verify", "subtitle").replace("{phone}", phone)}
    >
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="flex justify-center space-x-2 md:space-x-3 px-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-9 h-11 md:w-11 md:h-13 text-center text-xl md:text-2xl font-black bg-light-bg/50 border-2 border-border/60 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button type="submit" fullWidth size="lg" loading={isVerifying} className="h-12 md:h-14 shadow-lg shadow-primary/5">
            {safeT("auth", "verify", "button")}
          </Button>
          
          <div className="text-center">
            <button 
              type="button" 
              onClick={handleResend}
              disabled={isResending}
              className="text-primary font-black uppercase text-[10px] md:text-xs tracking-widest hover:text-primary-dark transition-colors disabled:opacity-50"
            >
              {isResending ? "..." : safeT("auth", "verify", "resend")}
            </button>
          </div>
        </div>
      </form>
    </AuthPageLayout>
  );
};

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-32"></div>
        </div>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
};

export default VerifyPage;
