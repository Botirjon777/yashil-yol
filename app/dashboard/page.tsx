"use client";

import React, { useState } from "react";
import {
  HiUser,
  HiCreditCard,
  HiPlus,
  HiChevronRight,
  HiStar,
  HiLocationMarker,
  HiClock,
} from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<"rides" | "balance" | "profile">(
    "rides",
  );
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [balance, setBalance] = useState(150000);

  // Mock Data
  const MY_RIDES = [
    {
      id: "1",
      from: "Tashkent",
      to: "Samarkand",
      date: "2026-03-20",
      time: "08:30",
      price: 65000,
      status: "upcoming",
    },
    {
      id: "2",
      from: "Samarkand",
      to: "Bukhara",
      date: "2026-03-22",
      time: "10:00",
      price: 45000,
      status: "upcoming",
    },
  ];

  return (
    <div className="bg-light-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="premium-card p-8 mb-8 text-center bg-primary text-white border-none shadow-primary/20">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black backdrop-blur-md">
                A
              </div>
              <h2 className="text-xl font-black">Alisher Navoiy</h2>
              <p className="text-indigo-100 text-sm font-medium">
                Verified Traveler
              </p>
            </div>

            <nav className="space-y-2">
              <DashboardNavItem
                icon={<HiStar />}
                label="My Rides"
                active={activeTab === "rides"}
                onClick={() => setActiveTab("rides")}
              />
              <DashboardNavItem
                icon={<HiCreditCard />}
                label="Balance & Cards"
                active={activeTab === "balance"}
                onClick={() => setActiveTab("balance")}
              />
              <DashboardNavItem
                icon={<HiUser />}
                label="Profile Settings"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "rides" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-black text-dark-text">
                    My Rides
                  </h1>
                  <div className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-widest">
                    {MY_RIDES.length} Total
                  </div>
                </div>

                {MY_RIDES.map((ride) => (
                  <div
                    key={ride.id}
                    className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary transition-colors"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-light-bg rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
                        <HiLocationMarker className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-dark-text flex items-center">
                          {ride.from}{" "}
                          <HiChevronRight className="mx-2 text-gray-300" />{" "}
                          {ride.to}
                        </div>
                        <div className="text-sm font-bold text-gray-400 flex items-center mt-1">
                          <HiClock className="mr-1.5" /> {formatDate(ride.date)}{" "}
                          • {ride.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-primary mb-1">
                        {formatCurrency(ride.price)}
                      </div>
                      <div className="text-xs font-black text-success uppercase tracking-widest">
                        Confirmed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "balance" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h1 className="text-3xl font-black text-dark-text mb-6">
                  Payment & Balance
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="premium-card bg-linear-to-br from-primary to-primary-dark text-white p-10 border-none shadow-xl shadow-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="relative z-10">
                      <div className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">
                        Available Balance
                      </div>
                      <div className="text-5xl font-black mb-10">
                        {formatCurrency(balance)}
                      </div>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-2xl"
                        onClick={() => setIsTopUpOpen(true)}
                      >
                        <HiPlus className="mr-2" /> Top up Balance
                      </Button>
                    </div>
                  </div>

                  <div className="premium-card p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-dark-text text-lg">
                        Saved Cards
                      </h3>
                      <button className="text-primary font-bold text-sm hover:underline flex items-center">
                        <HiPlus className="mr-1" /> Add New
                      </button>
                    </div>
                    <div className="space-y-4">
                      <SavedCard last4="4589" brand="Visa" />
                      <SavedCard last4="9921" brand="Uzcard" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="premium-card p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <h1 className="text-3xl font-black text-dark-text mb-10">
                  Account Settings
                </h1>
                <form className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <Input label="First Name" defaultValue="Alisher" />
                    <Input label="Last Name" defaultValue="Navoiy" />
                  </div>
                  <Input
                    label="Email Address"
                    defaultValue="alisher.navoiy@gmail.com"
                    type="email"
                  />
                  <div className="pt-4">
                    <Button size="lg" className="px-12 rounded-2xl">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top up Modal */}
      <Modal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        title="Top up Balance"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
              Select Card
            </label>
            <SavedCard last4="4589" brand="Visa" active />
          </div>
          <Input label="Amount (UZS)" placeholder="50,000" type="number" />
          <Button
            fullWidth
            size="lg"
            onClick={() => {
              setBalance((b) => b + 50000);
              setIsTopUpOpen(false);
            }}
          >
            Confirm Payment
          </Button>
        </div>
      </Modal>
    </div>
  );
};

function DashboardNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all ${
        active
          ? "bg-white text-primary shadow-lg shadow-gray-200/50"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
      {active && <HiChevronRight className="ml-auto" />}
    </button>
  );
}

function SavedCard({
  last4,
  brand,
  active = false,
}: {
  last4: string;
  brand: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
        active
          ? "border-primary bg-primary/5"
          : "border-border hover:border-gray-300"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-8 bg-dark-text rounded-lg flex items-center justify-center text-[10px] text-white font-black overflow-hidden relative">
          {brand}
          <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-white/10 rounded-full" />
        </div>
        <div>
          <div className="font-black text-dark-text tracking-wider">
            •••• {last4}
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {brand} Card
          </div>
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          active ? "border-primary bg-primary text-white" : "border-border"
        }`}
      >
        {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
    </div>
  );
}

export default DashboardPage;
