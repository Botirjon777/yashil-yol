"use client";

import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Dropdown from "@/src/components/ui/Dropdown";
import Button from "@/src/components/ui/Button";
import {
  useRegions,
  useDistrictsByRegion,
  useQuartersByDistrict,
} from "@/src/features/location/hooks/useLocation";
import { useCreateTrip } from "@/src/features/rides/hooks/useRides";
import { useVehicles } from "@/src/features/rides/hooks/useVehicles";
import { toast } from "sonner";
import Calendar from "@/src/components/ui/Calendar";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

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
  const { data: regions } = useRegions();

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
    start_lat: "41.3111", // Default to Tashkent for demo if not using map
    start_long: "69.2797",
    end_lat: "40.7128",
    end_long: "-74.0060",
    vehicle_id: "",
  });

  const { data: startDistricts } = useDistrictsByRegion(
    formData.start_region_id,
  );
  const { data: endDistricts } = useDistrictsByRegion(formData.end_region_id);
  const { data: startQuarters } = useQuartersByDistrict(
    formData.start_district_id,
  );
  const { data: endQuarters } = useQuartersByDistrict(formData.end_district_id);
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
      // Reset hierarchical children
      ...(name === "start_region_id"
        ? { start_district_id: "", start_quarter_id: "" }
        : {}),
      ...(name === "end_region_id"
        ? { end_district_id: "", end_quarter_id: "" }
        : {}),
      ...(name === "start_district_id" ? { start_quarter_id: "" } : {}),
      ...(name === "end_district_id" ? { end_quarter_id: "" } : {}),
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
      !formData.vehicle_id
    ) {
      toast.error(
        ct?.errors?.fillAll ||
          "Please fill in all required fields including a vehicle",
      );
      return;
    }

    // Custom calendar returns "YYYY-MM-DD HH:mm"
    // Backend expects "YYYY-MM-DD HH:mm:ss"
    const formatDateTimeForBackend = (val: string) => {
      if (!val) return "";
      // If it already has seconds (unlikely from our component), return as is
      if (val.split(":").length === 3) return val;
      return `${val}:00`;
    };

    const payload = {
      ...formData,
      start_time: formatDateTimeForBackend(formData.start_time),
      end_time: formatDateTimeForBackend(formData.end_time),
      price_per_seat: Number(formData.price_per_seat),
      available_seats: Number(formData.available_seats),
      start_lat: Number(formData.start_lat),
      start_long: Number(formData.start_long),
      end_lat: Number(formData.end_lat),
      end_long: Number(formData.end_long),
      // IDs MUST be strings according to backend requirements
      start_region_id: String(formData.start_region_id),
      end_region_id: String(formData.end_region_id),
      start_district_id: String(formData.start_district_id),
      end_district_id: String(formData.end_district_id),
      vehicle_id: String(formData.vehicle_id),
    };

    // Only include quarters if selected, also as strings
    if (formData.start_quarter_id) {
      payload.start_quarter_id = String(formData.start_quarter_id);
    }
    if (formData.end_quarter_id) {
      payload.end_quarter_id = String(formData.end_quarter_id);
    }

    // Step 2: Logical Date Validation
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
        // Reset form
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
          start_lat: "41.3111",
          start_long: "69.2797",
          end_lat: "40.7128",
          end_long: "-74.0060",
          vehicle_id: "",
        });
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

  const getLocalizedName = (item: any) => {
    return item[`name_${language}`] || item.name_uz || item.name;
  };

  const minDate = new Date();

  return (
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
              formData.start_time
                ? new Date(formData.start_time)
                : minDate
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

        <div className="space-y-4">
          <h4 className="font-bold text-gray-700">{ct?.from}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Dropdown
              label={ct?.region}
              options={
                regions?.map((r) => ({
                  id: r.id,
                  name: getLocalizedName(r),
                })) || []
              }
              value={formData.start_region_id}
              onChange={(val) => handleSelectChange("start_region_id", val)}
              placeholder={ct?.selectRegion}
            />
            <Dropdown
              label={ct?.district}
              options={
                startDistricts?.map((d) => ({
                  id: d.id,
                  name: getLocalizedName(d),
                })) || []
              }
              value={formData.start_district_id}
              onChange={(val) => handleSelectChange("start_district_id", val)}
              placeholder={ct?.selectDistrict}
              disabled={!formData.start_region_id}
            />
          </div>
          <Dropdown
            label={ct?.quarter}
            options={
              startQuarters?.map((q) => ({
                id: q.id,
                name: getLocalizedName(q),
              })) || []
            }
            value={formData.start_quarter_id}
            onChange={(val) => handleSelectChange("start_quarter_id", val)}
            placeholder={ct?.selectQuarter}
            disabled={!formData.start_district_id}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-700">{ct?.to}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Dropdown
              label={ct?.region}
              options={
                regions?.map((r) => ({
                  id: r.id,
                  name: getLocalizedName(r),
                })) || []
              }
              value={formData.end_region_id}
              onChange={(val) => handleSelectChange("end_region_id", val)}
              placeholder={ct?.selectRegion}
            />
            <Dropdown
              label={ct?.district}
              options={
                endDistricts?.map((d) => ({
                  id: d.id,
                  name: getLocalizedName(d),
                })) || []
              }
              value={formData.end_district_id}
              onChange={(val) => handleSelectChange("end_district_id", val)}
              placeholder={ct?.selectDistrict}
              disabled={!formData.end_region_id}
            />
          </div>
          <Dropdown
            label={ct?.quarter}
            options={
              endQuarters?.map((q) => ({
                id: q.id,
                name: getLocalizedName(q),
              })) || []
            }
            value={formData.end_quarter_id}
            onChange={(val) => handleSelectChange("end_quarter_id", val)}
            placeholder={ct?.selectQuarter}
            disabled={!formData.end_district_id}
          />
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
  );
}
