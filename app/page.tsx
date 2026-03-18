"use client";

import React, { useState } from "react";
import {
  HiTicket,
  HiShieldCheck,
  HiCurrencyDollar,
  HiLightningBolt,
} from "react-icons/hi";
import { UZBEKISTAN_REGIONS } from "@/src/lib/regions";
import Button from "@/src/components/ui/Button";
import Dropdown from "@/src/components/ui/Dropdown";
import Calendar from "@/src/components/ui/Calendar";

import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export default function Home() {
  const { t } = useLanguageStore();
  const [from, setFrom] = useState("");
  // ... rest of state
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    params.set("passengers", passengers.toString());

    router.push(`/rides?${params.toString()}`);
  };

  const regionOptions = UZBEKISTAN_REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
  }));
  const passengerOptions = [
    { id: 1, name: `1 ${t('hero', 'passengerCount')}${t('hero', 'passengerCount') === 'Passenger' ? '' : ''}` },
    { id: 2, name: `2 ${t('hero', 'passengerCount')}s` },
    { id: 3, name: `3 ${t('hero', 'passengerCount')}s` },
    { id: 4, name: `4 ${t('hero', 'passengerCount')}s` },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center z-20">
        {/* Abstract Background Elements - Clipped in its own layer */}
        <div className="absolute inset-0 overflow-hidden -z-10 bg-[#EEF2FF]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/10 to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full text-center">
          <h1 className="text-4xl md:text-7xl font-black text-dark-text mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 font-heading">
            {t('hero', 'title')}
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {t('hero', 'subtitle')}
          </p>

          {/* Search Card */}
          <div className="premium-card p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in zoom-in duration-500 delay-300 relative z-30">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="grow grid grid-cols-1 md:grid-cols-3 gap-6">
                <Dropdown
                  label={t('hero', 'leavingFrom')}
                  options={regionOptions}
                  value={from}
                  onChange={setFrom}
                  placeholder={t('hero', 'searchPlaceholder')}
                  className="text-left"
                />
                <Dropdown
                  label={t('hero', 'goingTo')}
                  options={regionOptions}
                  value={to}
                  onChange={setTo}
                  placeholder={t('hero', 'destinationPlaceholder')}
                  className="text-left"
                />
                <Calendar
                  label={t('hero', 'date')}
                  value={date}
                  onChange={setDate}
                  placeholder={t('hero', 'datePlaceholder')}
                  className="text-left"
                />
              </div>
              <div className="flex items-end space-x-4">
                <Dropdown
                  label={t('hero', 'passengers')}
                  options={passengerOptions}
                  value={passengers}
                  onChange={setPassengers}
                  placeholder="1"
                  className="w-40 text-left"
                />
                <Button
                  onClick={handleSearch}
                >
                  {t('hero', 'searchButton')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center uppercase tracking-widest text-xs font-bold text-gray-400">
            <div>
              <span className="block text-2xl text-dark-text mb-1">
                20,000+
              </span>
              {t('stats', 'users')}
            </div>
            <div>
              <span className="block text-2xl text-dark-text mb-1">14</span>
              {t('stats', 'regions')}
            </div>
            <div>
              <span className="block text-2xl text-dark-text mb-1">5,000+</span>
              {t('stats', 'dailyRides')}
            </div>
            <div>
              <span className="block text-2xl text-dark-text mb-1">100%</span>
              {t('stats', 'safe')}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-dark-text mb-4 font-heading">
              {t('features', 'why')}
            </h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<HiShieldCheck className="w-8 h-8" />}
              title={t('features', 'driverTitle')}
              description={t('features', 'driverDesc')}
            />
            <FeatureCard
              icon={<HiCurrencyDollar className="w-8 h-8" />}
              title={t('features', 'priceTitle')}
              description={t('features', 'priceDesc')}
            />
            <FeatureCard
              icon={<HiLightningBolt className="w-8 h-8" />}
              title={t('features', 'bookingTitle')}
              description={t('features', 'bookingDesc')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-primary rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative font-heading">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 -skew-x-12 translate-x-20" />

            <div className="max-w-xl text-center md:text-left z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                {t('cta', 'title')}
              </h2>
              <p className="text-indigo-100 text-lg md:text-xl font-medium mb-10">
                {t('cta', 'subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button variant="secondary" size="lg">
                  {t('cta', 'button')}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 border border-white/20"
                >
                  {t('cta', 'howItWorks')}
                </Button>
              </div>
            </div>

            <div className="mt-12 md:mt-0 relative z-10">
              <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <HiTicket className="w-32 h-32 rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="premium-card p-10 hover:border-primary transition-colors group">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-dark-text mb-4 font-heading">
        {title}
      </h3>
      <p className="text-gray-500 font-medium leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
}
