"use client";

import {
  HiOutlineLightBulb,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const AboutUsPage = () => {
  const { t } = useLanguageStore();

  const values = [
    {
      key: "safety",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />,
    },
    {
      key: "community",
      icon: <HiOutlineUserGroup className="w-8 h-8" />,
    },
    {
      key: "innovation",
      icon: <HiOutlineLightBulb className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-light-bg">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 text-primary rounded-4xl mb-8 shadow-sm">
            <HiOutlineGlobeAlt className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark-text mb-6 tracking-tight">
            {t("about", "title")}
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {t("about", "subtitle")}
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="premium-card p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <h2 className="text-3xl font-black text-dark-text mb-6">
              {t("about", "mission")?.title}
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              {t("about", "mission")?.desc}
            </p>
          </div>

          <div className="premium-card p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <h2 className="text-3xl font-black text-dark-text mb-6">
              {t("about", "vision")?.title}
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              {t("about", "vision")?.desc}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-dark-text mb-12">
            {t("about", "values")?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div
                key={val.key}
                className="premium-card p-8 border border-border/50 hover:border-primary/20 transition-all flex flex-col items-center group"
              >
                <div className="w-16 h-16 bg-light-bg rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm border border-border/50 group-hover:bg-primary group-hover:text-white transition-all">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-dark-text group-hover:text-primary transition-colors">
                  {t("about", "values")?.[val.key]}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 premium-card p-12 bg-dark-text relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/20 to-transparent pointer-events-none" />
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-black text-white mb-4">
              {t("cta", "title")}
            </h3>
            <p className="text-gray-400 font-medium mb-10 max-w-xl mx-auto">
              {t("cta", "subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/register">
                <button className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95">
                  {t("cta", "button")}
                </button>
              </a>
              <a href="/support">
                <button className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all active:scale-95">
                  {t("support", "title")}
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
