"use client";

import { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";

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

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {rd("latitude") || "Latitude"}
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-light-bg border border-border/60 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="e.g. 41.2995"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {rd("longitude") || "Longitude"}
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-light-bg border border-border/60 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="e.g. 69.2401"
              />
            </div>
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
      </div>
    </Modal>
  );
};
