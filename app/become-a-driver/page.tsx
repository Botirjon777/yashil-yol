"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import MainPage from "@/src/features/become-a-driver/MainPage";

export default function Page() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login?returnTo=/become-a-driver");
    }
  }, [token, router]);

  if (!token) return null;

  return <MainPage />;
}
