import React from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Step3Data } from "../types";

interface VehicleStepProps {
  data: Step3Data;
  colors: { id: string | number; name: string }[] | undefined;
  onChange: (data: Step3Data) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isPending: boolean;
}

export function VehicleStep({
  data,
  colors,
  onChange,
  onSubmit,
  onBack,
  isPending,
}: VehicleStepProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 animate-in slide-in-from-right duration-500"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-dark-text">
          Vehicle Registration
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="text-gray-400 hover:text-dark-text transition-colors flex items-center text-sm font-bold"
        >
          <HiChevronLeft className="mr-1" /> Back
        </button>
      </div>
      <p className="text-gray-500 text-sm font-medium">
        Basic info about your car.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Car Model"
          placeholder="e.g. Chevrolet Nexia 3"
          value={data.car_model}
          onChange={(e) => onChange({ ...data, car_model: e.target.value })}
          required
        />
        <Input
          label="Plate Number"
          placeholder="e.g. 01 A 123 AA"
          value={data.vehicle_number}
          onChange={(e) =>
            onChange({ ...data, vehicle_number: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">
            Car Color
          </label>
          <select
            className="w-full px-5 py-4 bg-light-bg border border-border rounded-lg outline-none transition-all font-semibold text-base mt-1"
            value={data.car_color_id}
            onChange={(e) =>
              onChange({ ...data, car_color_id: e.target.value })
            }
            required
          >
            <option value="">Select Color</option>
            {colors?.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Available Seats"
          type="number"
          min="1"
          max="8"
          value={data.seats}
          onChange={(e) => onChange({ ...data, seats: e.target.value })}
          required
        />
      </div>

      <Input
        label="Tech Passport Number"
        placeholder="e.g. TTR1234567"
        value={data.tech_passport_number}
        onChange={(e) =>
          onChange({ ...data, tech_passport_number: e.target.value })
        }
        required
      />

      <div className="pt-6">
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isPending}
          icon={<HiChevronRight className="order-last ml-2" />}
        >
          Next: Car Photos
        </Button>
      </div>
    </form>
  );
}
