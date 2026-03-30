"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import MainPage from "@/src/features/become-a-driver/MainPage";
import Link from "next/link";
import Button from "@/src/components/ui/Button";

export default function Page() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();

  useEffect(() => {
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
        <div className="premium-card p-12 max-w-lg animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-black text-dark-text mb-4">You're Already a Driver!</h1>
          <p className="text-gray-500 font-medium mb-8">
            You have already completed the registration process. You can manage your vehicles and view your status in the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">Go to Dashboard</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <MainPage />;
}
