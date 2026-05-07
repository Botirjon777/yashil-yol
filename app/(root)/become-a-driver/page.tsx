"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import MainPage from "@/src/features/become-a-driver/MainPage";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";


export default function Page() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  const { t, safeT: storeSafeT } = useLanguageStore();
  const [mounted, setMounted] = useState(false);


  const safeT = (category: string, section: string, key: string) => {
    if (!mounted) return "";
    return storeSafeT(category, section, key);
  };


  useEffect(() => {
    setMounted(true);
    if (_hasHydrated && !token) {
      router.push("/auth/login?returnTo=/become-a-driver");
    }
  }, [_hasHydrated, token, router]);



  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!token) return null;

  if (user?.role === "driver") {
    return (
      <div className="min-h-screen bg-light-bg flex flex-col items-center justify-center p-4 text-center">
        <div className="premium-card p-10 md:p-14 max-w-xl animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-success/10 text-success rounded-[32px] flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner animate-bounce">
            ✓
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-dark-text mb-5 tracking-tight">
            {safeT("becomeDriver", "alreadyDriver", "title")}
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10 max-w-md mx-auto">
            {safeT("becomeDriver", "alreadyDriver", "subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-2xl h-14 px-10">
                {safeT("becomeDriver", "alreadyDriver", "goToDashboard")}
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 px-10">
                {safeT("becomeDriver", "alreadyDriver", "backHome")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return <MainPage />;
}
