"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { toast } from "sonner";
import { useVerifyCode, useResendCode } from "@/src/features/auth/hooks/useAuth";

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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="premium-card p-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
             <span className="text-3xl font-black">6</span>
          </div>
          <h1 className="text-3xl font-black text-dark-text mb-4">{safeT("auth", "verify", "title")}</h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {safeT("auth", "verify", "subtitle").replace("{phone}", phone)}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-10">
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
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl md:text-3xl font-black bg-light-bg border-2 border-border rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              ))}
            </div>

            <Button type="submit" fullWidth size="lg" loading={isVerifying}>
              {safeT("auth", "verify", "button")}
            </Button>
            
            <button 
              type="button" 
              onClick={handleResend}
              disabled={isResending}
              className="mt-8 text-primary font-bold hover:underline disabled:opacity-50"
            >
              {isResending ? "..." : safeT("auth", "verify", "resend")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
};

export default VerifyPage;

