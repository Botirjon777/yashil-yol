"use client";

import React, { useState, useEffect } from "react";
import {
  HiUser,
  HiCreditCard,
  HiPlus,
  HiChevronRight,
  HiStar,
  HiLocationMarker,
  HiClock,
  HiStatusOnline,
  HiIdentification,
} from "react-icons/hi";
import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useMe, useUpdateProfile } from "@/src/features/auth/hooks/useAuth";
import { useBalance } from "@/src/features/payment/hooks/usePayment";
import { 
  useClientInprogressTrips, 
  useClientCompletedTrips,
  useDriverActiveTrips,
  useDriverCompletedTrips 
} from "@/src/features/rides/hooks/useRides";
import { toast } from "sonner";

const DashboardPage = () => {
  const { user: storedUser } = useAuthStore();
  const { data: userData, isLoading: isUserLoading } = useMe();
  const { data: balanceData } = useBalance();
  
  const [activeTab, setActiveTab] = useState<"rides" | "balance" | "profile">("rides");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [rideType, setRideType] = useState<"passenger" | "driver">("passenger");

  const user = userData?.user || storedUser;
  const isDriver = user?.role === "driver";

  // Trips Hooks
  const { data: passengerActive } = useClientInprogressTrips();
  const { data: passengerHistory } = useClientCompletedTrips();
  const { data: driverActive } = useDriverActiveTrips();
  const { data: driverHistory } = useDriverCompletedTrips();

  const activeRides = rideType === "driver" ? driverActive : passengerActive;
  const historyRides = rideType === "driver" ? driverHistory : passengerHistory;

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm, {
      onSuccess: () => toast.success("Profile updated successfully"),
      onError: (err: any) => toast.error(err.message || "Failed to update profile"),
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="premium-card p-8 mb-8 text-center bg-primary text-white border-none shadow-primary/20">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black backdrop-blur-md overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.first_name?.[0] || "U"
                )}
              </div>
              <h2 className="text-xl font-black">{user?.first_name} {user?.last_name}</h2>
              <p className="text-indigo-100 text-sm font-medium uppercase tracking-widest">
                {user?.role || "Traveler"}
              </p>
            </div>

            <nav className="space-y-2.5">
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
          <div className="lg:col-span-3 space-y-8">
            {/* Driver Application Status */}
            {!isDriver && user?.driving_verification_status && (
              <div className={cn(
                "premium-card p-6 flex items-center justify-between border-l-8 animate-in fade-in slide-in-from-top-4 duration-500",
                user.driving_verification_status === "pending" && "border-warning bg-warning/5",
                user.driving_verification_status === "verified" && "border-success bg-success/5",
                user.driving_verification_status === "rejected" && "border-error bg-error/5",
                user.driving_verification_status === "blocked" && "border-gray-400 bg-gray-50"
              )}>
                <div className="flex items-center space-x-5">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm",
                    user.driving_verification_status === "pending" && "bg-warning/20 text-warning",
                    user.driving_verification_status === "verified" && "bg-success/20 text-success",
                    user.driving_verification_status === "rejected" && "bg-error/20 text-error",
                    user.driving_verification_status === "blocked" && "bg-gray-200 text-gray-500"
                  )}>
                    <HiIdentification />
                  </div>
                  <div>
                    <h3 className="font-black text-dark-text">Driver Application Status</h3>
                    <p className="text-sm font-bold text-gray-500 capitalize">
                      {user.driving_verification_status} – {
                        user.driving_verification_status === "pending" ? "We're reviewing your information." :
                        user.driving_verification_status === "verified" ? "Congratulations! You can now start driving." :
                        user.driving_verification_status === "rejected" ? "Your application was rejected. Please contact support." :
                        "Your account has been blocked."
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isDriver && !user?.driving_verification_status && (
              <div className="premium-card p-8 bg-linear-to-r from-accent/10 to-primary/10 border-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl text-accent shadow-sm">
                    🚗
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-dark-text">Want to earn with Qadam?</h3>
                    <p className="text-gray-500 font-medium">Register as a driver and start your journey today!</p>
                  </div>
                </div>
                <Link href="/become-a-driver">
                  <Button variant="outline" size="lg">Learn More</Button>
                </Link>
              </div>
            )}

            {activeTab === "rides" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-black text-dark-text">My Rides</h1>
                  {isDriver && (
                    <div className="flex bg-white p-1 rounded-xl border border-border">
                      <button 
                        onClick={() => setRideType("passenger")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${rideType === "passenger" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                        As Passenger
                      </button>
                      <button 
                        onClick={() => setRideType("driver")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${rideType === "driver" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                        As Driver
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-black text-gray-400 uppercase tracking-widest">Active & Upcoming</h2>
                  {activeRides?.length === 0 ? (
                    <div className="premium-card p-12 text-center text-gray-500 font-medium">
                      No active rides found.
                    </div>
                  ) : (
                    activeRides?.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))
                  )}

                  <h2 className="text-lg font-black text-gray-400 uppercase tracking-widest pt-8">History</h2>
                  {historyRides?.length === 0 ? (
                    <div className="premium-card p-12 text-center text-gray-500 font-medium">
                      No ride history found.
                    </div>
                  ) : (
                    historyRides?.map((ride) => (
                      <RideCard key={ride.id} ride={ride} isHistory />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "balance" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h1 className="text-3xl font-black text-dark-text mb-6">Payment & Balance</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="premium-card bg-linear-to-br from-primary to-primary-dark text-white p-10 border-none shadow-xl shadow-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="relative z-10">
                      <div className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</div>
                      <div className="text-5xl font-black mb-10">
                        {formatCurrency(Number(balanceData?.balance || user?.balance?.balance || 0))}
                      </div>
                      <Button variant="secondary" size="lg" onClick={() => setIsTopUpOpen(true)}>
                        <HiPlus className="mr-2" /> Top up Balance
                      </Button>
                    </div>
                  </div>

                  <div className="premium-card p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-dark-text text-lg">Saved Cards</h3>
                      <button className="text-primary font-bold text-sm hover:underline flex items-center">
                        <HiPlus className="mr-1" /> Add New
                      </button>
                    </div>
                    <div className="space-y-4">
                      {/* We'll integrate actual cards API later if needed */}
                      <p className="text-gray-400 font-medium text-center py-4 text-sm italic">No cards connected yet.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="premium-card p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-10">
                  <h1 className="text-3xl font-black text-dark-text">Account Settings</h1>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${user?.is_verified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {user?.is_verified ? "Verified Account" : "Unverified"}
                  </span>
                </div>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="First Name" 
                      value={profileForm.first_name} 
                      onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                    />
                    <Input 
                      label="Last Name" 
                      value={profileForm.last_name} 
                      onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  />
                  <Input
                    label="Phone Number"
                    value={user?.phone || ""}
                    disabled
                  />
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="px-12" loading={isUpdating}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} title="Top up Balance">
        <div className="space-y-6">
          <p className="text-gray-500 font-medium">To top up your balance, please connect a card first.</p>
          <Button fullWidth size="lg" onClick={() => setIsTopUpOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

function RideCard({ ride, isHistory = false }: { ride: any, isHistory?: boolean }) {
  const from = ride.start_region?.name || "Departure";
  const to = ride.end_region?.name || "Destination";
  const price = ride.price_per_seat || ride.total_price || 0;
  
  return (
    <div className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary transition-colors">
      <div className="flex items-center space-x-6">
        <div className="w-14 h-14 bg-light-bg rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
          <HiLocationMarker className="w-7 h-7" />
        </div>
        <div>
          <div className="text-lg font-black text-dark-text flex items-center">
            {from} <HiChevronRight className="mx-2 text-gray-300" /> {to}
          </div>
          <div className="text-sm font-bold text-gray-400 flex items-center mt-1">
            <HiClock className="mr-1.5" /> {formatDate(ride.start_time || ride.created_at)}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-primary mb-1">{formatCurrency(Number(price))}</div>
        <div className={`text-xs font-black uppercase tracking-widest ${isHistory ? "text-gray-400" : "text-success"}`}>
          {ride.status}
        </div>
      </div>
    </div>
  );
}

function DashboardNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? "bg-white text-primary shadow-lg shadow-gray-200/50" : "text-gray-500 hover:bg-gray-100"}`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
      {active && <HiChevronRight className="ml-auto" />}
    </button>
  );
}

export default DashboardPage;
