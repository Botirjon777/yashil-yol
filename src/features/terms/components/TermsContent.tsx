"use client";

import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { termsUz } from "../data/terms.uz";
import { termsRu } from "../data/terms.ru";
import { termsEn } from "../data/terms.en";

const dataMap: Record<string, typeof termsEn> = {
  uz: termsUz,
  ru: termsRu,
  en: termsEn,
};

const TermsContent = () => {
  const { language } = useLanguageStore();
  const data = dataMap[language] ?? termsUz;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-black text-dark-text mb-2.5 tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-3xl">
          {data.subtitle}
        </p>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-4">
        {data.sections.map((section, idx) => (
          <div
            key={idx}
            id={`section-${idx + 1}`}
            className="bg-white rounded-2xl border border-border/40 p-5 md:p-7 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
          >
            <h2 className="text-base md:text-lg font-black text-dark-text mb-3 group-hover:text-primary transition-colors">
              {section.title}
            </h2>

            {Array.isArray(section.content) ? (
              <ul className="space-y-2">
                {section.content.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">
                {section.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsContent;
