"use client";

import React from "react";
import { HiTicket } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const BusPage = () => {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="premium-card p-8 md:p-16 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-8">
            <HiTicket className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-6 font-heading">
            {t('bus', 'title')}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            {t('bus', 'subtitle')}
          </p>
          
          <div className="bg-primary/5 rounded-lg p-8 border border-primary/10 max-w-3xl mx-auto">
            <p className="text-lg text-dark-text font-semibold">
              {t('bus', 'description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusPage;
