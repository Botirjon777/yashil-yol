"use client";

import { useState } from "react";
import { HiUserAdd, HiMap } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Modal from "@/src/components/ui/Modal";
import { formatPhoneDisplay } from "@/src/lib/utils";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("@/src/components/ui/MapPicker"), {
  ssr: false,
});

interface AddPassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    phone: string;
    latitude: string;
    longitude: string;
  }) => void;
  loading?: boolean;
  rd: (key: string) => string;
}

export const AddPassengerModal = ({
  isOpen,
  onClose,
  onAdd,
  loading = false,
  rd,
}: AddPassengerModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !latitude.trim() || !longitude.trim())
      return;
    onAdd({ name, phone, latitude, longitude });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("addPassenger") || "Add Passenger"}
    >
      <div className="space-y-6">
        {showMap ? (
          <MapPicker
            initialLat={latitude}
            initialLng={longitude}
            onCancel={() => setShowMap(false)}
            rd={rd}
            onSelect={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
              setShowMap(false);
            }}
          />
        ) : (
          <>
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <HiUserAdd className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-dark-text">
                  {rd("addNewCompanion") || "Add New Companion"}
                </p>
                <p className="text-xs font-bold text-gray-500">
                  {rd("companionInfoDesc") || "Provide name and phone number for your friend."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label={rd("fullName") || "Full Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={rd("enterName") || "Enter name"}
                required
              />
              
              <Input
                label={rd("phone") || "Phone Number"}
                value={phone}
                onChange={(e) => setPhone(formatPhoneDisplay(e.target.value))}
                prefixText="+998"
                placeholder="XX XXX XX XX"
                required
              />
            </div>

              <div className="pt-2 space-y-3 border-t border-dashed border-border">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">
                  {rd("pickupLocation") || "Pick-up Location"}
                </label>

                {latitude && longitude ? (
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <HiMap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-tight">
                          {rd("selectedLocation") || "Location Selected"}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600/70">
                          {rd("readyToBook") || "Ready to proceed"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMap(true)}
                      className="px-4 py-2 bg-white text-[10px] font-black text-emerald-600 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
                    >
                      {rd("change") || "Change"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMap(true)}
                    className="w-full py-6 flex flex-col items-center justify-center gap-3 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl text-primary hover:bg-primary/10 hover:border-primary/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <HiMap className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      {rd("pickOnMap") || "Pick on Map"}
                    </span>
                    <p className="text-[9px] font-bold text-gray-400 max-w-[200px] text-center">
                      {rd("locationRequiredDesc") || "Click to open map and set pick-up point"}
                    </p>
                  </button>
                )}
              </div>

            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleSubmit}
              disabled={
                !name.trim() || !phone.trim() || !latitude.trim() || !longitude.trim()
              }
            >
              {rd("addPassenger") || "Add Passenger"}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};
