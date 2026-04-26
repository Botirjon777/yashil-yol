"use client";

import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Dropdown from "@/src/components/ui/Dropdown";
import Button from "@/src/components/ui/Button";
import { useRegions } from "@/src/features/location/hooks/useLocation";
import { useCreateTrip } from "@/src/features/rides/hooks/useRides";
import { useVehicles } from "@/src/features/rides/hooks/useVehicles";
import { toast } from "sonner";
import Calendar from "@/src/components/ui/Calendar";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { HiLocationMarker } from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import TripLocationModal from "./TripLocationModal";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTripModal({
  isOpen,
  onClose,
}: CreateTripModalProps) {
  const { t, language } = useLanguageStore();
  const ct = t("dashboard", "createTrip");
  const rd = (key: string) => t("rides", key);
  const { data: regions } = useRegions();

  const [modalType, setModalType] = useState<"start" | "end" | null>(null);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    price_per_seat: "",
    available_seats: "4",
    start_region_id: "",
    end_region_id: "",
    start_district_id: "",
    end_district_id: "",
    start_quarter_id: "",
    end_quarter_id: "",
    start_lat: "",
    start_long: "",
    end_lat: "",
    end_long: "",
    vehicle_id: "",
  });

  const { data: vehicles } = useVehicles();
  const { mutate: createTrip, isPending } = useCreateTrip();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.start_time ||
      !formData.end_time ||
      !formData.price_per_seat ||
      !formData.start_region_id ||
      !formData.end_region_id ||
      !formData.vehicle_id ||
      !formData.start_lat ||
      !formData.end_lat
    ) {
      toast.error(
        ct?.errors?.fillAll ||
          "Please fill in all required fields and select locations",
      );
      return;
    }

    const formatDateTimeForBackend = (val: string) => {
      if (!val) return "";
      if (val.split(":").length === 3) return val;
      return `${val}:00`;
    };

    const payload: any = {
      ...formData,
      start_time: formatDateTimeForBackend(formData.start_time),
      end_time: formatDateTimeForBackend(formData.end_time),
      price_per_seat: Number(formData.price_per_seat),
      available_seats: Number(formData.available_seats),
      start_lat: Number(formData.start_lat),
      start_long: Number(formData.start_long),
      end_lat: Number(formData.end_lat),
      end_long: Number(formData.end_long),
      start_region_id: String(formData.start_region_id),
      end_region_id: String(formData.end_region_id),
      start_district_id: String(formData.start_district_id),
      end_district_id: String(formData.end_district_id),
      vehicle_id: String(formData.vehicle_id),
    };

    if (formData.start_quarter_id) {
      payload.start_quarter_id = String(formData.start_quarter_id);
    }
    if (formData.end_quarter_id) {
      payload.end_quarter_id = String(formData.end_quarter_id);
    }

    if (new Date(payload.end_time) <= new Date(payload.start_time)) {
      toast.error(
        ct?.errors?.timeError ||
          "Arrival time must be strictly after departure time",
      );
      return;
    }

    createTrip(payload, {
      onSuccess: () => {
        toast.success(ct?.success || "Trip created successfully!");
        onClose();
        setFormData({
          start_time: "",
          end_time: "",
          price_per_seat: "",
          available_seats: "4",
          start_region_id: "",
          end_region_id: "",
          start_district_id: "",
          end_district_id: "",
          start_quarter_id: "",
          end_quarter_id: "",
          start_lat: "",
          start_long: "",
          end_lat: "",
          end_long: "",
          vehicle_id: "",
        });
        setStartAddress("");
        setEndAddress("");
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            ct?.errors?.failed ||
            "Failed to create trip",
        );
      },
    });
  };

  const minDate = new Date();

  const isStartFilled = !!(formData.start_region_id && formData.start_lat);
  const isEndFilled = !!(formData.end_region_id && formData.end_lat);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={ct?.title}
        size="lg"
        fullMobile
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Calendar
              label={ct?.departureTime}
              showTime
              value={formData.start_time}
              onChange={(val: string) => handleSelectChange("start_time", val)}
              placeholder={ct?.selectDeparture}
              minDate={minDate}
            />
            <Calendar
              label={ct?.arrivalTime}
              showTime
              value={formData.end_time}
              onChange={(val: string) => handleSelectChange("end_time", val)}
              placeholder={ct?.selectArrival}
              minDate={
                formData.start_time ? new Date(formData.start_time) : minDate
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label={ct?.pricePerSeat}
              type="number"
              name="price_per_seat"
              value={formData.price_per_seat}
              onChange={handleInputChange}
              placeholder={ct?.pricePlaceholder}
              required
            />
            <Input
              label={ct?.availableSeats}
              type="number"
              name="available_seats"
              value={formData.available_seats}
              onChange={handleInputChange}
              required
            />
          </div>

          <Dropdown
            label={ct?.selectVehicle}
            options={
              vehicles?.map((v) => ({
                id: v.id,
                name: `${v.model} (${v.car_number})`,
              })) || []
            }
            value={formData.vehicle_id}
            onChange={(val) => handleSelectChange("vehicle_id", val)}
            placeholder={ct?.vehiclePlaceholder}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                {ct?.from}
              </label>
              <button
                type="button"
                onClick={() => setModalType("start")}
                className={cn(
                  "w-full flex flex-col items-start gap-1 p-5 rounded-[24px] border-2 transition-all text-left group",
                  isStartFilled
                    ? "bg-primary/5 border-primary/30 hover:border-primary/50 text-primary"
                    : "bg-error/5 border-error/30 hover:border-error/50 text-error",
                )}
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-70">
                  <HiLocationMarker className="w-3.5 h-3.5" />
                  {isStartFilled ? "Jo'nash manzili tanlandi" : "Jo'nash manzilini tanlang"}
                </div>
                <div className="text-sm font-black truncate w-full">
                  {startAddress || (isStartFilled ? `${formData.start_lat}, ${formData.start_long}` : "Tanlanmagan")}
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                {ct?.to}
              </label>
              <button
                type="button"
                onClick={() => setModalType("end")}
                className={cn(
                  "w-full flex flex-col items-start gap-1 p-5 rounded-[24px] border-2 transition-all text-left group",
                  isEndFilled
                    ? "bg-primary/5 border-primary/30 hover:border-primary/50 text-primary"
                    : "bg-error/5 border-error/30 hover:border-error/50 text-error",
                )}
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-70">
                  <HiLocationMarker className="w-3.5 h-3.5" />
                  {isEndFilled ? "Borish manzili tanlandi" : "Borish manzilini tanlang"}
                </div>
                <div className="text-sm font-black truncate w-full">
                  {endAddress || (isEndFilled ? `${formData.end_lat}, ${formData.end_long}` : "Tanlanmagan")}
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              className="mr-3"
              onClick={onClose}
              disabled={isPending}
            >
              {ct?.cancel}
            </Button>
            <Button type="submit" loading={isPending}>
              {ct?.submit}
            </Button>
          </div>
        </form>
      </Modal>

      <TripLocationModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={modalType === "start" ? rd("selectStartLocation") : rd("selectEndLocation")}
        initialData={
          modalType === "start"
            ? {
                regionId: formData.start_region_id,
                districtId: formData.start_district_id,
                quarterId: formData.start_quarter_id,
                lat: formData.start_lat,
                long: formData.start_long,
                address: startAddress,
              }
            : {
                regionId: formData.end_region_id,
                districtId: formData.end_district_id,
                quarterId: formData.end_quarter_id,
                lat: formData.end_lat,
                long: formData.end_long,
                address: endAddress,
              }
        }
        onConfirm={(data) => {
          if (modalType === "start") {
            setFormData((prev) => ({
              ...prev,
              start_region_id: data.regionId,
              start_district_id: data.districtId,
              start_quarter_id: data.quarterId,
              start_lat: data.lat,
              start_long: data.long,
            }));
            setStartAddress(data.address);
          } else {
            setFormData((prev) => ({
              ...prev,
              end_region_id: data.regionId,
              end_district_id: data.districtId,
              end_quarter_id: data.quarterId,
              end_lat: data.lat,
              end_long: data.long,
            }));
            setEndAddress(data.address);
          }
        }}
      />
    </>
  );
}
