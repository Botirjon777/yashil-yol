"use client";

import React from "react";
import Modal from "@/src/components/ui/Modal";
import dynamic from "next/dynamic";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const RideMap = dynamic(
  () => import("./RideMap").then((mod) => mod.RideMap),
  { 
    ssr: false, 
    loading: () => <div className="h-[500px] bg-gray-50 animate-pulse rounded-2xl" /> 
  }
);

interface RideMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: any;
}

export const RideMapModal = ({ isOpen, onClose, ride }: RideMapModalProps) => {
  const { t } = useLanguageStore();
  const rd = (key: string) => t("rides", key);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("tripMap") || "Trip Route"}
      size="xl"
    >
      <div className="p-1">
        <RideMap 
          trip={ride} 
          rd={rd} 
          hideHeader={true} 
          height="500px" 
          interactive={true}
          obfuscated={true}
        />
      </div>
    </Modal>
  );
};
