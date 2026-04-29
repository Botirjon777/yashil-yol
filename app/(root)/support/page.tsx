"use client";

import React from "react";
import { HiMail, HiPhone, HiLocationMarker, HiArrowLeft } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { useSendSupportMessage } from "@/src/features/support/hooks/useSupport";
import { useRouter } from "next/navigation";

const SupportPage = () => {
  const { t } = useLanguageStore();
  const { mutate: sendMessage, isPending: loading } = useSendSupportMessage();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    sendMessage(
      { name, email, message },
      {
        onSuccess: () => {
          (e.target as HTMLFormElement).reset();
        },
      },
    );
  };

  return (
    <div className="min-h-screen py-5 md:py-10 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <HiArrowLeft className="w-4 h-4" />
          {t("common", "back") || "Go Back"}
        </Button>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-5">
          <h1 className="text-xl md:text-3xl font-black text-dark-text mb-2.5 font-heading">
            {t("support", "title")}
          </h1>
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            {t("support", "subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-2.5 md:space-y-5">
            <div className="premium-card p-2.5 md:p-5">
              <h3 className="text-md font-black text-dark-text mb-2.5 md:mb-8 uppercase tracking-widest">
                {t("support", "contactInfo")}
              </h3>

              <div className="space-y-2.5 md:space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <HiMail className="w-5 h-5 text-primary" />
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
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <HiPhone className="w-5 h-5 text-primary" />
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
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <HiLocationMarker className="w-5 h-5 text-primary" />
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
            <div className="premium-card p-2.5 md:p-8">
              <h3 className="text-md md:text-2xl font-black text-dark-text mb-2.5 md:mb-8">
                {t("support", "formTitle")}
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-2.5 md:space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    required
                    name="name"
                    label={t("support", "name")}
                    type="text"
                  />
                  <Input
                    required
                    name="email"
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
                    name="message"
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
