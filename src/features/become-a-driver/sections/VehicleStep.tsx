import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { cn, getVehicleColorHex } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Step3Data } from "../types";
import { CarColor } from "@/src/features/rides/types";

interface VehicleStepProps {
  data: Step3Data;
  colors: CarColor[] | undefined;
  onChange: (data: Step3Data) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isPending: boolean;
}

const FALLBACK_COLORS = [
  { id: 1, name: "Qizil" },
  { id: 2, name: "Yashil" },
  { id: 3, name: "Ko'k" },
  { id: 4, name: "Sariq" },
  { id: 5, name: "Qora" },
  { id: 6, name: "Oq" },
  { id: 7, name: "Kulrang" },
  { id: 8, name: "To‘q ko‘k" },
  { id: 9, name: "Jigarrang" },
  { id: 10, name: "To‘q yashil" },
  { id: 11, name: "Olcha" },
  { id: 12, name: "Zaytun" },
  { id: 13, name: "Kumush" },
  { id: 14, name: "Olovrang" },
  { id: 15, name: "Siyohrang" },
  { id: 16, name: "Pushti" },
  { id: 17, name: "Ko‘k-yashil" },
  { id: 18, name: "Aqua" },
  { id: 19, name: "Shaftoli" },
  { id: 20, name: "Oltin" },
  { id: 21, name: "Bej" },
  { id: 22, name: "Shokolad" },
  { id: 23, name: "Karamel" },
  { id: 24, name: "Quyosh" },
  { id: 25, name: "Dengiz to‘lqini" },
  { id: 26, name: "Pushti binafsha" },
  { id: 27, name: "Qaymoqrang" },
  { id: 28, name: "Jigar binafsha" },
  { id: 29, name: "Zangori" },
  { id: 30, name: "To‘q kulrang" },
];

export function VehicleStep({
  data,
  colors: apiColors,
  onChange,
  onSubmit,
  onBack,
  isPending,
}: VehicleStepProps) {
  const colors = apiColors?.length ? apiColors : (FALLBACK_COLORS as CarColor[]);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  const getColorName = (color: CarColor) => {
    return color.name || color.title_uz || color.title_en || color.title_ru || `Color ${color.id}`;
  };

  const selectedColor = colors?.find((c) => String(c.id) === String(data.car_color_id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setIsColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, car_model: e.target.value })}
          required
        />
        <Input
          label="Plate Number"
          placeholder="e.g. 01 A 123 AA"
          value={data.vehicle_number}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...data, vehicle_number: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full relative" ref={colorRef}>
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">
            Car Color
          </label>
          <button
            type="button"
            onClick={() => setIsColorOpen(!isColorOpen)}
            className="w-full px-5 py-4 bg-light-bg border border-border rounded-lg outline-none transition-all font-semibold text-base mt-1 flex items-center justify-between hover:border-primary group"
          >
            <div className="flex items-center space-x-3">
              {selectedColor ? (
                <>
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: getVehicleColorHex(selectedColor.name || selectedColor.title_en || "") }}
                  />
                  <span className="text-dark-text">
                    <span className="text-gray-400 font-bold mr-2">ID: {selectedColor.id}</span>
                    {getColorName(selectedColor)}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">Select Color</span>
              )}
            </div>
            <HiChevronDown className={cn("text-gray-400 transition-transform", isColorOpen && "rotate-180")} />
          </button>

          {isColorOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-border rounded-xl shadow-2xl max-h-64 overflow-y-auto py-2 animate-in fade-in zoom-in duration-200">
              {!colors ? (
                <div className="px-5 py-4 text-center text-gray-400 text-sm italic">
                  Loading colors...
                </div>
              ) : colors.length === 0 ? (
                <div className="px-5 py-4 text-center text-gray-400 text-sm italic">
                  No colors available
                </div>
              ) : (
                colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      onChange({ ...data, car_color_id: String(color.id) });
                      setIsColorOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-4 px-5 py-3 hover:bg-light-bg transition-colors text-left",
                      String(data.car_color_id) === String(color.id) && "bg-primary/5 border-l-4 border-primary"
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-100 shadow-sm"
                      style={{ backgroundColor: getVehicleColorHex(color.name || color.title_en || color.title_uz || "") }}
                    />
                    <div className="flex flex-col">
                      <span className={cn("font-bold text-sm", String(data.car_color_id) === String(color.id) ? "text-primary" : "text-dark-text")}>
                        {getColorName(color)}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Color ID: {color.id}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <Input
          label="Available Seats"
          type="number"
          min="1"
          max="8"
          value={data.seats}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, seats: e.target.value })}
          required
        />
      </div>

      <Input
        label="Tech Passport Number"
        placeholder="e.g. TTR1234567"
        value={data.tech_passport_number}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
