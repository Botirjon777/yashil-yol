"use client";
import Link from "next/link";
import Button from "@/src/components/ui/Button";

import { useLanguageStore } from "@/src/providers/LanguageProvider";

const NotFound = () => {
  const { t } = useLanguageStore();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-primary/10 leading-none">
            404
          </h1>
          <div className="absolute inset-x-0 bottom-8">
            <h2 className="text-3xl font-black text-dark-text">
              {t("error", "title")}
            </h2>
          </div>
        </div>
        <p className="text-gray-500 text-lg mb-10 font-medium">
          {t("error", "subtitle")}
        </p>
        <Link href="/">
          <Button size="lg">{t("error", "home")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
