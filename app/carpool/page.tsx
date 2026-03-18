"use client";

import React from "react";
import { HiUsers } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const CarpoolPage = () => {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[40px] p-8 md:p-16 border border-border shadow-sm text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <HiUsers className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-6 font-heading">
            {t('carpool', 'title')}
          </h1>
          <h2 className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            {t('carpool', 'subtitle')}
          </h2>
          
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 max-w-3xl mx-auto">
            <p className="text-lg text-dark-text font-semibold">
              {t('carpool', 'description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpoolPage;
