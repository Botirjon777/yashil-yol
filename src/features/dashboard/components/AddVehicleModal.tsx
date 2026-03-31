"use client";

import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Dropdown from "@/src/components/ui/Dropdown";
import Button from "@/src/components/ui/Button";
import {
  HiChevronRight,
  HiChevronLeft,
  HiUpload,
  HiCheckCircle,
} from "react-icons/hi";
import {
  useCarColors,
  useAddVehicle,
} from "@/src/features/rides/hooks/useVehicles";
import { useUploadCarImages } from "@/src/features/become-a-driver/hooks/useBecomeDriver";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";
import { CarColor } from "@/src/features/rides/types";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "details" | "documents";

export default function AddVehicleModal({
  isOpen,
  onClose,
}: AddVehicleModalProps) {
  const [step, setStep] = useState<Step>("details");
  const { data: colors } = useCarColors();
  const { mutate: addVehicle, isPending: isAddingVehicle } = useAddVehicle();
  const { mutate: uploadImages, isPending: isUploadingImages } =
    useUploadCarImages();

  const [vehicleId, setVehicleId] = useState<number | null>(null);

  // Step 1 Data
  const [details, setDetails] = useState({
    car_model: "",
    vehicle_number: "",
    car_color_id: "",
    seats: "4",
    tech_passport_number: "",
  });

  // Step 2 Data
  const [files, setFiles] = useState<{
    tech_passport_front: File | null;
    tech_passport_back: File | null;
    car_images: File[];
  }>({
    tech_passport_front: null,
    tech_passport_back: null,
    car_images: [],
  });

  const getColorName = (color: CarColor) => {
    return (
      color.name ||
      color.title_uz ||
      color.title_en ||
      color.title_ru ||
      `Color ${color.id}`
    );
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(details, {
      onSuccess: (res) => {
        if (res.data?.id) {
          setVehicleId(res.data.id);
          setStep("documents");
          toast.success("Vehicle info saved! Now upload documents.");
        } else {
          toast.error("Failed to get vehicle ID");
        }
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to add vehicle");
      },
    });
  };

  const handleFilesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !vehicleId ||
      !files.tech_passport_front ||
      !files.tech_passport_back ||
      files.car_images.length === 0
    ) {
      toast.error("Please upload all required files");
      return;
    }

    uploadImages(
      {
        vehicle_id: vehicleId,
        tech_passport_front: files.tech_passport_front,
        tech_passport_back: files.tech_passport_back,
        car_images: files.car_images,
      },
      {
        onSuccess: () => {
          toast.success(
            "Vehicle registered successfully and pending approval!",
          );
          handleClose();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to upload images");
        },
      },
    );
  };

  const handleClose = () => {
    setStep("details");
    setVehicleId(null);
    setDetails({
      car_model: "",
      vehicle_number: "",
      car_color_id: "",
      seats: "4",
      tech_passport_number: "",
    });
    setFiles({
      tech_passport_front: null,
      tech_passport_back: null,
      car_images: [],
    });
    onClose();
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleCarImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => ({
        ...prev,
        car_images: [...prev.car_images, ...newFiles],
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Vehicle"
      size="lg"
    >
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
              step === "details"
                ? "bg-primary text-white"
                : "bg-success text-white",
            )}
          >
            {step === "details" ? "1" : <HiCheckCircle className="text-xl" />}
          </div>
          <div className="h-px bg-border flex-1" />
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
              step === "documents"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-400",
            )}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span>Vehicle Details</span>
          <span>Documents & Photos</span>
        </div>
      </div>

      {step === "details" ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Car Model"
              placeholder="e.g. Chevrolet Nexia 3"
              value={details.car_model}
              onChange={(e) =>
                setDetails({ ...details, car_model: e.target.value })
              }
              required
            />
            <Input
              label="Plate Number"
              placeholder="e.g. 01 A 123 AA"
              value={details.vehicle_number}
              onChange={(e) =>
                setDetails({ ...details, vehicle_number: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dropdown
              label="Car Color"
              options={
                colors?.map((c) => ({ id: c.id, name: getColorName(c) })) || []
              }
              value={details.car_color_id}
              onChange={(val) =>
                setDetails({ ...details, car_color_id: String(val) })
              }
              placeholder="Select Color"
            />
            <Input
              label="Available Seats"
              type="number"
              min="1"
              max="8"
              value={details.seats}
              onChange={(e) =>
                setDetails({ ...details, seats: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Tech Passport Number"
            placeholder="e.g. TTR1234567"
            value={details.tech_passport_number}
            onChange={(e) =>
              setDetails({ ...details, tech_passport_number: e.target.value })
            }
            required
          />

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-3"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isAddingVehicle}
              icon={<HiChevronRight className="ml-1" />}
            >
              Next: Documents
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFilesSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">
                Tech Passport (Front)
              </label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer group">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    handleFileChange(
                      "tech_passport_front",
                      e.target.files?.[0] || null,
                    )
                  }
                />
                {files.tech_passport_front ? (
                  <div className="text-success text-sm font-bold flex items-center justify-center">
                    <HiCheckCircle className="mr-2 text-xl" />{" "}
                    {files.tech_passport_front.name}
                  </div>
                ) : (
                  <div className="text-gray-400 py-4">
                    <HiUpload className="mx-auto text-2xl mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Upload Front Side</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">
                Tech Passport (Back)
              </label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer group">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    handleFileChange(
                      "tech_passport_back",
                      e.target.files?.[0] || null,
                    )
                  }
                />
                {files.tech_passport_back ? (
                  <div className="text-success text-sm font-bold flex items-center justify-center">
                    <HiCheckCircle className="mr-2 text-xl" />{" "}
                    {files.tech_passport_back.name}
                  </div>
                ) : (
                  <div className="text-gray-400 py-4">
                    <HiUpload className="mx-auto text-2xl mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Upload Back Side</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400">
              Car Images (Min 1)
            </label>
            <div className="relative border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer group">
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleCarImagesChange}
              />
              <div className="text-gray-400">
                <HiUpload className="mx-auto text-3xl mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold">
                  Drop files here or click to upload
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-1">
                  Exterior, interior, etc.
                </p>
              </div>
            </div>
            {files.car_images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {files.car_images.map((f, i) => (
                  <div
                    key={i}
                    className="bg-light-bg border border-border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center"
                  >
                    <HiCheckCircle className="text-success mr-1.5" />{" "}
                    {f.name.length > 15
                      ? f.name.substring(0, 15) + "..."
                      : f.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("details")}
              disabled={isUploadingImages}
            >
              <HiChevronLeft className="mr-1" /> Back
            </Button>
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                className="mr-3"
                onClick={handleClose}
                disabled={isUploadingImages}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isUploadingImages}>
                Submit Registration
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
