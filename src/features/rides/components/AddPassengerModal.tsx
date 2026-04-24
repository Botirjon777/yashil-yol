"use client";

import { useState } from "react";
import { HiUserAdd, HiMap } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import MapPicker from "@/src/components/ui/MapPicker";

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
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  {rd("fullName") || "Full Name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-light-bg border border-border/60 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder={rd("enterName") || "Enter name"}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  {rd("phone") || "Phone Number"}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-light-bg border border-border/60 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="+998..."
                />
              </div>

              <div className="pt-2 space-y-3 border-t border-dashed border-border">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {rd("pickupLocation") || "Pick-up Location"}
                  </label>
                  <button
                    onClick={() => setShowMap(true)}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary-dark transition-colors bg-primary/5 px-2 py-1 rounded-lg border border-primary/10"
                  >
                    <HiMap className="w-3 h-3" />
                    {rd("pickOnMap") || "Pick on Map"}
                  </button>
                </div>

                {latitude && longitude ? (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-light-bg rounded-xl border border-border/50">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-gray-400 uppercase">Lat</span>
                      <p className="text-xs font-bold text-dark-text">{latitude}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-gray-400 uppercase">Lng</span>
                      <p className="text-xs font-bold text-dark-text">{longitude}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400">
                      {rd("noLocationSelected") || "No location selected"}
                    </p>
                  </div>
                )}
              </div>
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
