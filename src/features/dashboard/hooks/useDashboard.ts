import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function useDashboard() {
  const router = useRouter();
  const { user: storedUser, token, _hasHydrated } = useAuthStore();
  
  const { data: userData, isLoading: isUserLoading } = useMe(!!_hasHydrated && !!token);
  const { data: balanceData } = useBalance();

  const [activeTab, setActiveTab] = useState<"rides" | "balance" | "profile" | "driver">("rides");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [rideType, setRideType] = useState<"passenger" | "driver">("passenger");

  // Load persisted tab on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("dashboard_active_tab");
    const savedRideType = localStorage.getItem("dashboard_ride_type");
    
    if (savedTab && ["rides", "balance", "profile", "driver"].includes(savedTab)) {
      setActiveTab(savedTab as any);
    }
    if (savedRideType && ["passenger", "driver"].includes(savedRideType)) {
      setRideType(savedRideType as any);
    }
  }, []);

  // Update localStorage when tab or rideType changes
  const handleTabChange = (tab: "rides" | "balance" | "profile" | "driver") => {
    setActiveTab(tab);
    localStorage.setItem("dashboard_active_tab", tab);
  };

  const handleRideTypeChange = (type: "passenger" | "driver") => {
    setRideType(type);
    localStorage.setItem("dashboard_ride_type", type);
  };

  // Trips Hooks
  const { data: passengerActive } = useClientInprogressTrips();
  const { data: passengerHistory } = useClientCompletedTrips();
  const { data: driverActive } = useDriverActiveTrips();
  const { data: driverHistory } = useDriverCompletedTrips();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (_hasHydrated && !token) {
      router.push("/auth/login?returnTo=/dashboard");
    }
  }, [_hasHydrated, token, router]);

  const user = userData?.user || storedUser;
  const isDriver = user?.role === "driver";

  const activeRides = rideType === "driver" ? driverActive : passengerActive;
  const historyRides = rideType === "driver" ? driverHistory : passengerHistory;

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

  return {
    user,
    isUserLoading,
    balanceData,
    activeTab,
    handleTabChange,
    isTopUpOpen,
    setIsTopUpOpen,
    isAddCardOpen,
    setIsAddCardOpen,
    rideType,
    handleRideTypeChange,
    activeRides,
    historyRides,
    profileForm,
    setProfileForm,
    handleProfileSubmit,
    isUpdating,
    isDriver,
    balance: balanceData?.balance ? parseFloat(balanceData.balance) : 0,
  };
}
