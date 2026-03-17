"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <ToastProvider />
      </AuthProvider>
    </QueryProvider>
  );
}
