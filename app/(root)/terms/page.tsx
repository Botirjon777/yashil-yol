"use client";

import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import TermsContent from "@/src/features/terms/components/TermsContent";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const TermsPage = () => {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen py-5 bg-light-bg">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Go Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-primary transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <HiArrowLeft className="w-4 h-4" />
            </div>
            {t("error", "home") || "Orqaga"}
          </Link>
        </div>

        <TermsContent />
      </div>
    </div>
  );
};

export default TermsPage;
