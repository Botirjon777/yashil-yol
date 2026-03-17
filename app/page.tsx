"use client";

import React, { useState } from "react";
import { HiLocationMarker, HiCalendar, HiUsers, HiTicket, HiShieldCheck, HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
import { UZBEKISTAN_REGIONS } from "@/src/lib/regions";
import Button from "@/src/components/ui/Button";
import Dropdown from "@/src/components/ui/Dropdown";
import Calendar from "@/src/components/ui/Calendar";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const regionOptions = UZBEKISTAN_REGIONS.map((r) => ({ id: r.id, name: r.name }));
  const passengerOptions = [
    { id: 1, name: "1 Passenger" },
    { id: 2, name: "2 Passengers" },
    { id: 3, name: "3 Passengers" },
    { id: 4, name: "4 Passengers" },
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
            Ride together, <br />
            <span className="text-primary">Save together.</span>
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            The smartest way to travel across Uzbekistan. Comfortable, safe, and professional.
          </p>

          {/* Search Card */}
          <div className="premium-card p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in zoom-in duration-500 delay-300 relative z-30">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="grow grid grid-cols-1 md:grid-cols-3 gap-6">
                <Dropdown
                  label="Leaving from"
                  options={regionOptions}
                  value={from}
                  onChange={setFrom}
                  placeholder="Region"
                  className="text-left"
                />
                <Dropdown
                  label="Going to"
                  options={regionOptions}
                  value={to}
                  onChange={setTo}
                  placeholder="Region"
                  className="text-left"
                />
                <Calendar
                  label="Date"
                  value={date}
                  onChange={setDate}
                  placeholder="Select date"
                  className="text-left"
                />
              </div>
              <div className="flex items-end space-x-4">
                <Dropdown
                  label="Passengers"
                  options={passengerOptions}
                  value={passengers}
                  onChange={setPassengers}
                  placeholder="1"
                  className="w-40 text-left"
                />
                <Button className="h-[52px] px-10 rounded-xl shadow-lg shadow-primary/30 shrink-0 font-black uppercase tracking-widest text-xs">
                  Search
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
              <span className="block text-2xl text-dark-text mb-1">20,000+</span>
              Happy Users
            </div>
            <div>
              <span className="block text-2xl text-dark-text mb-1">14</span>
              Regions Covered
            </div>
            <div>
              <span className="block text-2xl text-dark-text mb-1">5,000+</span>
              Daily Rides
            </div>
            <div>
              <span className="block text-2xl text-dark-text mb-1">100%</span>
              Safe & Verified
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-dark-text mb-4 font-heading">Why Yashil Yo&apos;l?</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<HiShieldCheck className="w-8 h-8" />}
              title="Verified Drivers"
              description="Every driver on our platform is personally verified. Safety is our #1 priority."
            />
            <FeatureCard
              icon={<HiCurrencyDollar className="w-8 h-8" />}
              title="Best Prices"
              description="Travel for up to 60% less than standard taxi services across the country."
            />
            <FeatureCard
              icon={<HiLightningBolt className="w-8 h-8" />}
              title="Instant Booking"
              description="Find your ride in seconds. No calls, no waiting, just easy travel."
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
              <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to start your first trip?</h2>
              <p className="text-indigo-100 text-lg md:text-xl font-medium mb-10">
                Join thousands of travelers today and experience the best ride-sharing in Uzbekistan.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button variant="secondary" size="lg" className="rounded-2xl">Create Account</Button>
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 rounded-2xl border border-white/20">How it works</Button>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="premium-card p-10 hover:border-primary transition-colors group">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-dark-text mb-4 font-heading">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed font-sans">{description}</p>
    </div>
  );
}
