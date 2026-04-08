"use client";

import React from "react";
import { HiShieldCheck, HiScale, HiDocumentText, HiLockClosed } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const TermsPage = () => {
  const { t } = useLanguageStore();

  const sectionIcons: Record<string, React.ReactNode> = {
    acceptance: <HiShieldCheck className="w-6 h-6" />,
    eligibility: <HiLockClosed className="w-6 h-6" />,
    services: <HiDocumentText className="w-6 h-6" />,
    conduct: <HiScale className="w-6 h-6" />,
    payment: <HiScale className="w-6 h-6" />,
    cancellation: <HiDocumentText className="w-6 h-6" />,
    liability: <HiShieldCheck className="w-6 h-6" />,
    governingLaw: <HiScale className="w-6 h-6" />
  };

  // Get localized sections
  const sectionsObj = t("terms", "sections") as any;
  const sectionKeys = Object.keys(sectionIcons);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-light-bg">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-3xl mb-6 shadow-sm">
            <HiDocumentText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-6">
            {t("terms", "title")}
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            {t("terms", "subtitle")}
          </p>
          <div className="mt-8 flex justify-center items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{t("terms", "lastUpdated")}: April 8, 2026</span>
            <span>•</span>
            <span>{t("terms", "version")} 2.1</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          {sectionKeys.map((key) => {
            const section = sectionsObj?.[key];
            if (!section) return null;
            
            return (
              <div 
                key={key}
                id={key}
                className="premium-card p-8 md:p-10 border border-border/50 hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-14 h-14 bg-light-bg rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm border border-border/50">
                    {sectionIcons[key]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-dark-text mb-4 transition-colors group-hover:text-primary">
                      {section.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <h4 className="text-lg font-black text-dark-text mb-2">{t("terms", "qTitle")}</h4>
          <p className="text-gray-500 font-medium mb-6">
            {t("terms", "qSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/support">
              <button className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20">
                {t("terms", "contactSupport")}
              </button>
            </a>
            <button 
              onClick={() => window.print()}
              className="px-8 py-3 bg-white text-dark-text border border-border font-black rounded-xl hover:bg-light-bg transition-all active:scale-95"
            >
              {t("terms", "print")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
