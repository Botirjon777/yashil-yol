"use client";

import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Dropdown from "@/src/components/ui/Dropdown";
import Button from "@/src/components/ui/Button";
import {
  useRegions,
  useDistrictsByRegion,
} from "@/src/features/location/hooks/useLocation";
import { useCreateTrip } from "@/src/features/rides/hooks/useRides";
import { useVehicles } from "@/src/features/rides/hooks/useVehicles";
import { toast } from "sonner";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTripModal({
  isOpen,
  onClose,
}: CreateTripModalProps) {
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
      // Reset district if region changes
      ...(name === "start_region_id" ? { start_district_id: "" } : {}),
      ...(name === "end_region_id" ? { end_district_id: "" } : {}),
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
      toast.error("Please fill in all required fields including a vehicle");
      return;
    }

    // Format dates to Y-m-d H:i:s
    const formatDateTime = (val: string) => {
      if (!val) return "";
      const date = new Date(val);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const h = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const s = "00";
      return `${y}-${m}-${d} ${h}:${min}:${s}`;
    };

    const payload = {
      ...formData,
      start_time: formatDateTime(formData.start_time),
      end_time: formatDateTime(formData.end_time),
      price_per_seat: Number(formData.price_per_seat),
      available_seats: Number(formData.available_seats),
      start_lat: Number(formData.start_lat),
      start_long: Number(formData.start_long),
      end_lat: Number(formData.end_lat),
      end_long: Number(formData.end_long),
    };

    createTrip(payload, {
      onSuccess: () => {
        toast.success("Trip created successfully!");
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
          start_lat: "41.3111",
          start_long: "69.2797",
          end_lat: "40.7128",
          end_long: "-74.0060",
          vehicle_id: "",
        });
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || err.message || "Failed to create trip",
        );
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Departure Time"
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Arrival Time (Estimated)"
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Price per Seat (UZS)"
            type="number"
            name="price_per_seat"
            value={formData.price_per_seat}
            onChange={handleInputChange}
            placeholder="e.g. 50000"
            required
          />
          <Input
            label="Available Seats"
            type="number"
            name="available_seats"
            value={formData.available_seats}
            onChange={handleInputChange}
            required
          />
        </div>

        <Dropdown
          label="Select Vehicle"
          options={
            vehicles?.map((v) => ({
              id: v.id,
              name: `${v.model} (${v.car_number})`,
            })) || []
          }
          value={formData.vehicle_id}
          onChange={(val) => handleSelectChange("vehicle_id", val)}
          placeholder="Select one of your vehicles"
        />

        <div className="space-y-4">
          <h4 className="font-bold text-gray-700">From</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dropdown
              label="Region"
              options={
                regions?.map((r) => ({
                  id: r.id,
                  name: r.name_uz || r.name,
                })) || []
              }
              value={formData.start_region_id}
              onChange={(val) => handleSelectChange("start_region_id", val)}
              placeholder="Select Region"
            />
            <Dropdown
              label="District"
              options={
                startDistricts?.map((d) => ({
                  id: d.id,
                  name: d.name_uz || d.name,
                })) || []
              }
              value={formData.start_district_id}
              onChange={(val) => handleSelectChange("start_district_id", val)}
              placeholder="Select District"
              disabled={!formData.start_region_id}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-700">To</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dropdown
              label="Region"
              options={
                regions?.map((r) => ({
                  id: r.id,
                  name: r.name_uz || r.name,
                })) || []
              }
              value={formData.end_region_id}
              onChange={(val) => handleSelectChange("end_region_id", val)}
              placeholder="Select Region"
            />
            <Dropdown
              label="District"
              options={
                endDistricts?.map((d) => ({
                  id: d.id,
                  name: d.name_uz || d.name,
                })) || []
              }
              value={formData.end_district_id}
              onChange={(val) => handleSelectChange("end_district_id", val)}
              placeholder="Select District"
              disabled={!formData.end_region_id}
            />
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
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create Trip
          </Button>
        </div>
      </form>
    </Modal>
  );
}
