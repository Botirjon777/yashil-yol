"use client";

import { useLanguageStore } from "@/src/providers/LanguageProvider";

const TermsPage = () => {
  const { t } = useLanguageStore();

  // Get localized sections
  const sectionsObj = t("terms", "sections") as any;
  const sectionKeys = Object.keys(sectionsObj);

  return (
    <div className="min-h-screen py-10 bg-light-bg">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="w-full">
            <h1 className="text-xl md:text-3xl font-black text-dark-text mb-2.5">
              {t("terms", "title")}
            </h1>
            <p className="text-base md:text-lg text-gray-500 font-medium max-w-2xl">
              {t("terms", "subtitle")}
            </p>
            <div className="mt-2.5 flex flex-col md:flex-row items-start md:items-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {t("terms", "lastUpdated")}: May 3, 2026
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {t("terms", "version")} 2.1
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-5">
          {sectionKeys.map((key) => {
            const section = sectionsObj?.[key];
            if (!section) return null;

            return (
              <div
                key={key}
                id={key}
                className="premium-card p-2.5 md:p-5 border border-border/50 hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">
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
        <div className="mt-10 p-2.5 md:p-5 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <h4 className="text-lg font-black text-dark-text mb-2">
            {t("terms", "qTitle")}
          </h4>
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
