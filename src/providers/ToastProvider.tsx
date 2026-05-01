"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      expand={true}
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: {
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '700',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '2px solid rgba(0,0,0,0.05)',
        },
        className: "sonner-toast",
      }}
    />
  );
}
