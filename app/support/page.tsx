"use client";

import React, { useState } from "react";
import { HiChatAlt2, HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { toast } from "sonner";

const SupportPage = () => {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t("support", "success"));
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-6 font-heading">
            {t("support", "title")}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            {t("support", "subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-2.5 md:space-y-5">
            <div className="premium-card p-8">
              <h3 className="text-xl font-black text-dark-text mb-8 uppercase tracking-widest">
                {t("support", "contactInfo")}
              </h3>

              <div className="space-y-2.5 md:space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <HiMail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      Email
                    </p>
                    <p className="text-dark-text font-bold">
                      support@yashilyol.uz
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <HiPhone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      Phone
                    </p>
                    <p className="text-dark-text font-bold">
                      +998 71 200 00 00
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <HiLocationMarker className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      Address
                    </p>
                    <p className="text-dark-text font-bold">
                      Tashkent city, Uzbekistan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="premium-card p-8 md:p-12">
              <h3 className="text-2xl font-black text-dark-text mb-8">
                {t("support", "formTitle")}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    required
                    label={t("support", "name")}
                    type="text"
                  />
                  <Input
                    required
                    label={t("support", "email")}
                    type="email"
                  />
                </div>

                <div className="space-y-2.5 md:space-y-5">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">
                    {t("support", "message")}
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-light-bg border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold resize-none text-base"
                  ></textarea>
                </div>

                <Button fullWidth size="lg" type="submit" disabled={loading}>
                  {loading ? t("common", "loading") : t("support", "send")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
