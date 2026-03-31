import React from "react";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { cn, getVehicleColorHex } from "@/src/lib/utils";
import { StatusCard } from "../components/StatusCard";
import { SubStatus } from "../components/SubStatus";

interface DriverSectionProps {
  user: any;
  vehicles: any[];
}

export function DriverSection({ user, vehicles }: DriverSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-dark-text">Driver Profile</h1>
        <span className={cn(
          "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
          user?.driving_verification_status === "approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        )}>
          {user?.driving_verification_status || "Pending"}
        </span>
      </div>

      {/* Document Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusCard 
          title="Driving Licence" 
          status={user?.driving_verification_status === "approved" ? "approved" : (user?.has_driving_licence ? "pending" : "not uploaded")} 
        />
        <StatusCard 
          title="Driver Passport" 
          status={user?.driving_verification_status === "approved" ? "approved" : (user?.has_passport ? "pending" : "not uploaded")} 
        />
      </div>

      {/* Vehicles List */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-dark-text">Registered Vehicles</h2>
          <Link href="/become-a-driver">
            <Button variant="outline" size="sm">
              <HiPlus className="mr-1" /> Add New
            </Button>
          </Link>
        </div>

        {!vehicles || vehicles.length === 0 ? (
          <div className="premium-card p-12 text-center text-gray-500 font-medium">
            No vehicles registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vehicles.map((vehicle: any) => {
              const isGlobalApproved = user?.driving_verification_status === "approved";
              const vehicleColorName = vehicle.color?.title_en || vehicle.color?.title_uz || "Unknown";
              const vehicleColorCode = vehicle.color?.code || getVehicleColorHex(vehicleColorName);

              return (
                <div key={vehicle.id} className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary transition-colors">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-light-bg rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border group-hover:bg-primary/5 transition-all">
                      🚗
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-dark-text">{vehicle.model}</h4>
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
                            <span className="text-xs font-bold text-gray-400 capitalize">{vehicleColorName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex space-x-2">
                      <SubStatus label="Car" status={isGlobalApproved ? "approved" : "pending"} />
                      <SubStatus label="Passport" status={isGlobalApproved ? "approved" : "pending"} />
                      <SubStatus label="Photos" status={isGlobalApproved ? "approved" : "pending"} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded",
                      isGlobalApproved ? "text-success bg-success/5" : "text-warning bg-warning/5"
                    )}>
                      Overall: {isGlobalApproved ? "approved" : "pending"}
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
