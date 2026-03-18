"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import AuthProvider from "./AuthProvider";
import LanguageProvider from "./LanguageProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}
