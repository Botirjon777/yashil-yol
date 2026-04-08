import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useMe, useUpdateProfile } from "@/src/features/auth/hooks/useAuth";
import { useBalance } from "@/src/features/payment/hooks/usePayment";
import { 
  useClientInprogressTrips,
  useClientCompletedTrips,
  useClientCanceledTrips,
  useDriverActiveTrips,
  useDriverCompletedTrips,
  useDriverCanceledTrips,
  useClientBookings,
} from "@/src/features/rides/hooks/useRides";
import { useVehicles } from "@/src/features/rides/hooks/useVehicles";
import { parseError } from "@/src/lib/errorUtils";
import { toast } from "sonner";
import { Card } from "../actions/payment";

export function useDashboard() {
  const router = useRouter();
  const { user: storedUser, token, _hasHydrated } = useAuthStore();
  
  const { data: userData, isLoading: isUserLoading } = useMe(!!_hasHydrated && !!token);
  const { data: balanceData } = useBalance();

  const [activeTab, setActiveTab] = useState<"rides" | "balance" | "transactions" | "profile" | "driver">("rides");
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardToVerify, setCardToVerify] = useState<Card | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [rideType, setRideType] = useState<"passenger" | "driver">("passenger");

  // Load persisted tab on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("dashboard_active_tab");
    const savedRideType = localStorage.getItem("dashboard_ride_type");
    
    if (savedTab && ["rides", "balance", "transactions", "profile", "driver"].includes(savedTab)) {
      setActiveTab(savedTab as any);
    }
    if (savedRideType && ["passenger", "driver"].includes(savedRideType)) {
      setRideType(savedRideType as any);
    }
  }, []);

  // Update localStorage when tab or rideType changes
  const handleTabChange = (tab: "rides" | "balance" | "transactions" | "profile" | "driver") => {
    setActiveTab(tab);
    setIsSectionOpen(true);
    localStorage.setItem("dashboard_active_tab", tab);
  };

  const handleRideTypeChange = (type: "passenger" | "driver") => {
    setRideType(type);
    localStorage.setItem("dashboard_ride_type", type);
  };

  // Trips Hooks
  const { data: passengerInprogress } = useClientInprogressTrips();
  const { data: passengerCompleted } = useClientCompletedTrips();
  const { data: passengerCanceled } = useClientCanceledTrips();
  const { data: driverActive } = useDriverActiveTrips();
  const { data: driverCompleted } = useDriverCompletedTrips();
  const { data: driverCanceled } = useDriverCanceledTrips();
  const { data: passengerBookings } = useClientBookings();
  const { data: vehiclesData } = useVehicles();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    email: "",
  });
  const [isFatherNameModalOpen, setIsFatherNameModalOpen] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (_hasHydrated && !token) {
      router.push("/auth/login?returnTo=/dashboard");
    }
  }, [_hasHydrated, token, router]);

  const user = userData?.user || storedUser;
  const isDriver = user?.role === "driver";

  const now = new Date();
  
  // Transform Bookings to Trips with context for passengers
  // This is the primary source since the user requested to see their bookings here.
  const passengerTrips = (passengerBookings || []).map((b: any) => ({ 
    ...b.trip, 
    bookingId: b.id || b.booking_id, 
    bookingStatus: b.status,
    // Add fallback status from trip if booking status is unclear
    status: b.trip?.status || b.status 
  }));

  const passengerActiveTrips = passengerTrips.filter((t: any) => 
    (t.bookingStatus === "confirmed" || t.bookingStatus === "pending" || t.bookingStatus === "active") &&
    t.status !== "completed" && t.status !== "canceled"
  );

  const passengerHistoryTrips = passengerTrips.filter((t: any) => 
    t.bookingStatus === "completed" || t.bookingStatus === "canceled" || 
    t.status === "completed" || t.status === "canceled"
  );

  const allActive = (rideType === "driver" ? driverActive : passengerActiveTrips) || [];
  
  // Filter out trips where departure time is in the past for current display
  const trulyActive = allActive.filter((ride: any) => ride.start_time && new Date(ride.start_time) >= now);
  const autoArchived = allActive.filter((ride: any) => ride.start_time && new Date(ride.start_time) < now);
  
  const rawHistory = rideType === "driver" 
    ? [...(driverCompleted || []), ...(driverCanceled || [])]
    : passengerHistoryTrips;

  const activeRides = trulyActive;
  const historyRides = [...rawHistory, ...autoArchived].sort((a: any, b: any) => {
    if (!a.start_time || !b.start_time) return 0;
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        father_name: user.father_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Check if father_name is missing when opening profile tab
  useEffect(() => {
    if (activeTab === "profile" && user && !user.father_name) {
      setIsFatherNameModalOpen(true);
    }
  }, [activeTab, user]);

  const isDirty = 
    profileForm.first_name !== (user?.first_name || "") ||
    profileForm.last_name !== (user?.last_name || "") ||
    profileForm.father_name !== (user?.father_name || "") ||
    profileForm.email !== (user?.email || "");

  const handleProfileSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isDirty && !isFatherNameModalOpen) return;

    // Validate father_name is present for update
    if (!profileForm.father_name) {
      toast.error(parseError({ response: { data: { message: "Otasining ismi kiritilishi shart" } } }));
      return;
    }

    updateProfile(profileForm, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        setIsFatherNameModalOpen(false);
      },
      onError: (err: any) => toast.error(parseError(err, "Failed to update profile")),
    });
  };

  return {
    user,
    isUserLoading,
    balanceData,
    activeTab,
    handleTabChange,
    isSectionOpen,
    setIsSectionOpen,
    isTopUpOpen,
    setIsTopUpOpen,
    isAddCardOpen,
    setIsAddCardOpen,
    cardToVerify,
    setCardToVerify,
    rideType,
    handleRideTypeChange,
    isAddVehicleOpen,
    setIsAddVehicleOpen,
    activeRides,
    historyRides,
    profileForm,
    setProfileForm,
    handleProfileSubmit,
    isUpdating,
    isDirty,
    isFatherNameModalOpen,
    setIsFatherNameModalOpen,
    isDriver,
    balance: (balanceData?.balance || user?.balance?.balance) ? parseFloat(String(balanceData?.balance || user?.balance?.balance).replace(',', '.')) : 0,
    vehicles: vehiclesData || [],
  };
}
