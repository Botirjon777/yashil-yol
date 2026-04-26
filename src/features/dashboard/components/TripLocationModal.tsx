"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/src/components/ui/Modal";
import Dropdown from "@/src/components/ui/Dropdown";
import Button from "@/src/components/ui/Button";
import {
  useRegions,
  useDistrictsByRegion,
  useQuartersByDistrict,
} from "@/src/features/location/hooks/useLocation";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import dynamic from "next/dynamic";
import { HiLocationMarker, HiCheck } from "react-icons/hi";

const MapPicker = dynamic(() => import("@/src/components/ui/MapPicker"), {
  ssr: false,
});

interface TripLocationData {
  regionId: string;
  districtId: string;
  quarterId: string;
  lat: string;
  long: string;
  address: string;
}

interface TripLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Partial<TripLocationData>;
  onConfirm: (data: TripLocationData) => void;
}

export default function TripLocationModal({
  isOpen,
  onClose,
  title,
  initialData,
  onConfirm,
}: TripLocationModalProps) {
  const { t, language } = useLanguageStore();
  const rd = (key: string) => t("rides", key);
  const ct = t("dashboard", "createTrip");

  const [regionId, setRegionId] = useState(initialData?.regionId || "");
  const [districtId, setDistrictId] = useState(initialData?.districtId || "");
  const [quarterId, setQuarterId] = useState(initialData?.quarterId || "");
  const [lat, setLat] = useState(initialData?.lat || "");
  const [long, setLong] = useState(initialData?.long || "");
  const [address, setAddress] = useState(initialData?.address || "");

  useEffect(() => {
    if (isOpen && initialData) {
      setRegionId(initialData.regionId || "");
      setDistrictId(initialData.districtId || "");
      setQuarterId(initialData.quarterId || "");
      setLat(initialData.lat || "");
      setLong(initialData.long || "");
      setAddress(initialData.address || "");
    }
  }, [isOpen, initialData]);

  const { data: regions } = useRegions();
  const { data: districts } = useDistrictsByRegion(regionId);
  const { data: quarters } = useQuartersByDistrict(districtId);

  const getLocalizedName = (item: any) => {
    return item[`name_${language}`] || item.name_uz || item.name;
  };

  const handleRegionChange = (val: string) => {
    setRegionId(val);
    setDistrictId("");
    setQuarterId("");
  };

  const handleDistrictChange = (val: string) => {
    setDistrictId(val);
    setQuarterId("");
  };

  const handleConfirm = () => {
    onConfirm({
      regionId,
      districtId,
      quarterId,
      lat,
      long,
      address,
    });
    onClose();
  };

  const isFormValid = !!(regionId && lat && long);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      fullMobile
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Hierarchy Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Dropdown
            label={ct?.region}
            options={
              regions?.map((r) => ({
                id: r.id,
                name: getLocalizedName(r),
              })) || []
            }
            value={regionId}
            onChange={handleRegionChange}
            placeholder={ct?.selectRegion}
          />
          <Dropdown
            label={ct?.district}
            options={
              districts?.map((d) => ({
                id: d.id,
                name: getLocalizedName(d),
              })) || []
            }
            value={districtId}
            onChange={handleDistrictChange}
            placeholder={ct?.selectDistrict}
            disabled={!regionId}
          />
          <Dropdown
            label={ct?.quarter}
            options={
              quarters?.map((q) => ({
                id: q.id,
                name: getLocalizedName(q),
              })) || []
            }
            value={quarterId}
            onChange={setQuarterId}
            placeholder={ct?.selectQuarter}
            disabled={!districtId}
          />
        </div>

        {/* Map Section */}
        <div className="flex-1 min-h-[400px] border border-border rounded-2xl overflow-hidden relative mb-6">
          <MapPicker
            initialLat={lat}
            initialLng={long}
            onCancel={onClose}
            rd={rd}
            showActions={false}
            onSelect={(selectedLat, selectedLng, selectedAddress) => {
              setLat(selectedLat);
              setLong(selectedLng);
              setAddress(selectedAddress || "");
            }}
          />
        </div>

        {/* Footer Info & Confirm */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border mt-auto">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg shrink-0 ${lat ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
              <HiLocationMarker className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {rd("selectedLocation") || "Selected Point"}
              </p>
              <p className="text-[11px] font-bold text-dark-text mt-1 leading-tight line-clamp-2">
                {address || (lat ? `${lat}, ${long}` : t("common", "notSelected") || "Not selected")}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="w-full md:w-auto min-w-[200px] gap-2"
          >
            <HiCheck className="w-5 h-5" />
            {t("common", "confirm") || "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
