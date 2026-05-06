import { useState, useEffect } from "react";
import { RideCard } from "../components/RideCard";
import CreateTripModal from "../components/CreateTripModal";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { HiPlus, HiOutlineClock } from "react-icons/hi";
import { AuthUser } from "../../auth/types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import Dropdown from "@/src/components/ui/Dropdown";

interface RidesSectionProps {
  rideType: "passenger" | "driver";
  handleRideTypeChange: (type: "passenger" | "driver") => void;
  passengerInprogress?: any[];
  passengerCompleted?: any[];
  passengerCanceled?: any[];
  passengerBookings?: any[];
  driverActive?: any[];
  driverCompleted?: any[];
  driverCanceled?: any[];
  driverAll?: any[];
  isDriver: boolean;
  user: AuthUser | null;
}

export function RidesSection({
  rideType,
  handleRideTypeChange,
  passengerInprogress = [],
  passengerCompleted = [],
  passengerCanceled = [],
  passengerBookings = [],
  driverActive = [],
  driverCompleted = [],
  driverCanceled = [],
  driverAll = [],
  isDriver,
  user,
}: RidesSectionProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [passengerTab, setPassengerTab] = useState<"inprogress" | "completed" | "canceled" | "all">("all");
  const [driverTab, setDriverTab] = useState<"all" | "active" | "completed" | "canceled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  
  // Reset pagination when tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [passengerTab, driverTab, rideType]);
  
  const isApproved = user?.driving_verification_status === "approved";
  const isPending = user?.driving_verification_status === "pending";
  const isRejected = user?.driving_verification_status === "rejected";
  const isBlocked = user?.driving_verification_status === "blocked";
  const { t } = useLanguageStore();

  const ridesTranslations = t("dashboard", "rides");

  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    const parts = text.split("/support");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <Link href="/support" className="text-primary hover:underline font-black">
            /support
          </Link>
        )}
      </span>
    ));
  };

  const renderPassengerList = () => {
    let currentList = [];
    let emptyMessage = "";

    switch (passengerTab) {
      case "inprogress":
        currentList = [...passengerInprogress].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noActive;
        break;
      case "completed":
        currentList = [...passengerCompleted].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noHistory;
        break;
      case "canceled":
        currentList = [...passengerCanceled].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noHistory;
        break;
      case "all":
        currentList = [...passengerBookings].sort((a, b) => (b.bookingId || 0) - (a.bookingId || 0));
        emptyMessage = ridesTranslations?.noHistory;
        break;
    }

    if (currentList.length === 0) {
      return (
        <div className="premium-card p-6 lg:p-12 text-center text-gray-500 font-medium">
          {emptyMessage}
        </div>
      );
    }

    const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
    const paginatedList = currentList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
      <div className="space-y-4">
        {paginatedList.map((ride: any, index: number) => (
          <RideCard 
            key={`${passengerTab}-${ride.bookingId || "nb"}-${ride.id || index}`} 
            ride={ride} 
            isHistory={passengerTab === "completed" || passengerTab === "canceled"} 
          />
        ))}
        {totalPages > 1 && renderPagination(totalPages)}
      </div>
    );
  };

  const renderDriverList = () => {
    let currentList = [];
    let emptyMessage = "";

    switch (driverTab) {
      case "all":
        currentList = [...driverAll].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noHistory;
        break;
      case "active":
        currentList = [...driverActive].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noActive;
        break;
      case "completed":
        currentList = [...driverCompleted].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noHistory;
        break;
      case "canceled":
        currentList = [...driverCanceled].sort((a, b) => b.id - a.id);
        emptyMessage = ridesTranslations?.noHistory;
        break;
    }

    if (currentList.length === 0) {
      return (
        <div className="premium-card p-6 lg:p-12 text-center text-gray-500 font-medium">
          {emptyMessage}
        </div>
      );
    }

    const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
    const paginatedList = currentList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
      <div className="space-y-4">
        {paginatedList.map((ride: any, index: number) => (
          <RideCard 
            key={`driver-${driverTab}-${ride.id || index}`} 
            ride={ride} 
            isHistory={driverTab === "completed" || driverTab === "canceled"} 
          />
        ))}
        {totalPages > 1 && renderPagination(totalPages)}
      </div>
    );
  };

  const renderPagination = (totalPages: number) => {
    return (
      <div className="flex items-center justify-center gap-2 mt-8 py-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl text-sm font-bold border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          {t("dashboard", "back") || "Back"}
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Only show a few pages if there are many
            if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
              if (page === 2 || page === totalPages - 1) return <span key={page} className="px-2 text-gray-400">...</span>;
              return null;
            }
            
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                  currentPage === page
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl text-sm font-bold border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          {t("common", "next") || "Next"}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-2.5 lg:space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-2">
        <h1 className="text-3xl font-black text-dark-text">
          {ridesTranslations?.title}
        </h1>

        <div className="hidden lg:flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:gap-4">
          {isDriver && (
            <div className="flex bg-white p-1 rounded-xl border border-border shadow-sm">
              <button
                onClick={() => handleRideTypeChange("passenger")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  rideType === "passenger"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {ridesTranslations?.asPassenger}
              </button>
              <button
                onClick={() => handleRideTypeChange("driver")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  rideType === "driver"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {ridesTranslations?.asDriver}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdowns */}
      <div className="flex lg:hidden items-center gap-2 mb-4">
        {isDriver && (
          <Dropdown
            options={[
              { id: "passenger", name: ridesTranslations?.asPassenger },
              { id: "driver", name: ridesTranslations?.asDriver }
            ]}
            value={rideType}
            onChange={(val) => handleRideTypeChange(val)}
            className="flex-1"
          />
        )}
        <Dropdown
          options={
            rideType === "driver"
              ? [
                  { id: "all", name: ridesTranslations?.allTrips || "All Trips" },
                  { id: "active", name: ridesTranslations?.activeLabel || ridesTranslations?.active || "Active" },
                  { id: "completed", name: ridesTranslations?.completed },
                  { id: "canceled", name: ridesTranslations?.canceled }
                ]
              : [
                  { id: "all", name: ridesTranslations?.allTrips || "All Trips" },
                  { id: "inprogress", name: ridesTranslations?.inprogress },
                  { id: "completed", name: ridesTranslations?.completed },
                  { id: "canceled", name: ridesTranslations?.canceled }
                ]
          }
          value={rideType === "driver" ? driverTab : passengerTab}
          onChange={(val) => (rideType === "driver" ? setDriverTab(val) : setPassengerTab(val))}
          className="flex-1"
        />
      </div>

      {rideType === "passenger" && (
        <div className="hidden lg:flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: ridesTranslations?.allTrips || "All Trips" },
            { id: "inprogress", label: ridesTranslations?.inprogress },
            { id: "completed", label: ridesTranslations?.completed },
            { id: "canceled", label: ridesTranslations?.canceled }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPassengerTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                passengerTab === tab.id
                  ? "bg-dark-text text-white border-dark-text shadow-lg shadow-dark-text/10"
                  : "bg-white text-gray-500 border-border hover:border-gray-400"
              }`}
            >
              {tab.label || tab.id}
            </button>
          ))}
        </div>
      )}

      {rideType === "driver" && (
        <div className="hidden lg:flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: ridesTranslations?.allTrips || "All Trips" },
            { id: "active", label: ridesTranslations?.activeLabel || ridesTranslations?.active || "Active" },
            { id: "completed", label: ridesTranslations?.completed },
            { id: "canceled", label: ridesTranslations?.canceled }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDriverTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                driverTab === tab.id
                  ? "bg-dark-text text-white border-dark-text shadow-lg shadow-dark-text/10"
                  : "bg-white text-gray-500 border-border hover:border-gray-400"
              }`}
            >
              {tab.label || tab.id}
            </button>
          ))}
        </div>
      )}
      
      {rideType === "driver" && isPending && (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <HiOutlineClock className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">
            {ridesTranslations?.pendingVerification || "Your documents are under verification, please wait"}
          </p>
        </div>
      )}

      {rideType === "driver" && isRejected && (
        <div className="p-4 bg-error/5 text-error rounded-2xl border border-error/20 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="text-sm font-bold">
            {renderTextWithLinks(t("dashboard", "driver")?.rejected)}
          </p>
        </div>
      )}

      {rideType === "driver" && isBlocked && (
        <div className="p-4 bg-error/5 text-error rounded-2xl border border-error/20 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="text-sm font-bold">
            {renderTextWithLinks(t("dashboard", "driver")?.blocked)}
          </p>
        </div>
      )}

      {/* Simple Create Trip Banner for Drivers */}
      {isDriver && (isApproved || isPending || isRejected || isBlocked) && rideType === "driver" && (
        <div className="animate-in-bottom transition-all duration-500">
          <div className="premium-card p-5 lg:p-6 bg-linear-to-r from-primary/5 to-secondary/5 border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-dark-text">
                {ridesTranslations?.bannerTitle}
              </h3>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isPending || isRejected || isBlocked}
              className="px-8 shadow-lg relative z-10"
            >
              {ridesTranslations?.createTrip}
            </Button>
          </div>
        </div>
      )}

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <div className="space-y-4">
        {rideType === "driver" ? renderDriverList() : renderPassengerList()}
      </div>
    </div>
  );
}
