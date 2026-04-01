import Link from "next/link";
import { HiPlus, HiTruck } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { cn, getVehicleColorHex } from "@/src/lib/utils";
import { StatusCard } from "../components/StatusCard";
import { SubStatus } from "../components/SubStatus";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface DriverSectionProps {
  user: any;
  vehicles: any[];
  onAddVehicleClick: () => void;
}

export function DriverSection({
  user,
  vehicles,
  onAddVehicleClick,
}: DriverSectionProps) {
  const { t, language } = useLanguageStore();
  const ds = t("dashboard", "driverSection");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-dark-text">{ds?.title}</h1>
        <span
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
            user?.driving_verification_status === "approved"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning",
          )}
        >
          {ds?.statuses?.[user?.driving_verification_status || "pending"] || user?.driving_verification_status || ds?.statuses?.pending}
        </span>
      </div>

      {/* Document Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusCard
          title={ds?.drivingLicence}
          status={
            user?.driving_verification_status === "approved"
              ? "approved"
              : user?.has_driving_licence || user?.driving_license_number
                ? "pending"
                : "notUploaded"
          }
        />
        <StatusCard
          title={ds?.driverPassport}
          status={
            user?.driving_verification_status === "approved"
              ? "approved"
              : user?.has_passport
                ? "pending"
                : "notUploaded"
          }
        />
      </div>

      {/* Vehicles List */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-dark-text">
            {ds?.registeredVehicles}
          </h2>
          {user?.role === "driver" ? (
            <Button variant="outline" size="sm" onClick={onAddVehicleClick}>
              <HiPlus className="mr-1" /> {ds?.addNew}
            </Button>
          ) : (
            <Link href="/become-a-driver">
              <Button variant="outline" size="sm">
                <HiPlus className="mr-1" /> {ds?.addNew}
              </Button>
            </Link>
          )}
        </div>

        {!vehicles || vehicles.length === 0 ? (
          <div className="premium-card p-12 text-center text-gray-500 font-medium">
            {ds?.noVehicles}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vehicles.map((vehicle: any) => {
              const isGlobalApproved =
                user?.driving_verification_status === "approved";
              
              const vehicleColorName =
                vehicle.color?.[`title_${language}`] || vehicle.color?.title_en || "Unknown";
              const vehicleColorCode =
                vehicle.color?.code || getVehicleColorHex(vehicleColorName);

              // Check for specific images
              const hasTechPassport = vehicle.vehicle_images?.some((img: any) => img.type === "tech_passport");
              const hasCarPhotos = vehicle.vehicle_images?.some((img: any) => img.type === "car_photo");

              return (
                <div
                  key={vehicle.id}
                  className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-light-bg rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border group-hover:bg-primary/5 transition-all text-primary">
                      <HiTruck />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-dark-text">
                        {vehicle.model}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="bg-dark-text text-white px-3 py-0.5 rounded text-xs font-black tracking-widest">
                          {vehicle.car_number}
                        </span>
                        {vehicle.color && (
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: vehicleColorCode }}
                            />
                            <span className="text-xs font-bold text-gray-400 capitalize">
                              {vehicleColorName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex space-x-2">
                      <SubStatus
                        label={ds?.vehicleLabels?.car}
                        status={isGlobalApproved ? "approved" : "pending"}
                      />
                      <SubStatus
                        label={ds?.vehicleLabels?.passport}
                        status={isGlobalApproved ? "approved" : (hasTechPassport ? "pending" : "notUploaded")}
                      />
                      <SubStatus
                        label={ds?.vehicleLabels?.photos}
                        status={isGlobalApproved ? "approved" : (hasCarPhotos ? "pending" : "notUploaded")}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded",
                        isGlobalApproved
                          ? "text-success bg-success/5"
                          : "text-warning bg-warning/5",
                      )}
                    >
                      {ds?.overall}: {ds?.statuses?.[isGlobalApproved ? "approved" : "pending"]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
