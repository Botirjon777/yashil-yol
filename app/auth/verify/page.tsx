"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/src/components/ui/Button";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "your phone number";
  
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 3) {
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="premium-card p-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
             <span className="text-3xl font-black">4</span>
          </div>
          <h1 className="text-3xl font-black text-dark-text mb-4">Verify Identity</h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            We&apos;ve sent a 4-digit verification code to <span className="text-dark-text font-bold">{phone}</span>. Please enter it below.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-4 mb-10">
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
                  className="w-16 h-16 text-center text-3xl font-black bg-light-bg border-2 border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              ))}
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Verify & Log In
            </Button>
            
            <button type="button" className="mt-8 text-primary font-bold hover:underline">
              Didn&apos;t receive code? Resend
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
