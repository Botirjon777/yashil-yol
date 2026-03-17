"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      expand={true}
      richColors
      closeButton
      theme="light"
    />
  );
}
