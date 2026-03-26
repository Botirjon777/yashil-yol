"use client";

import React, { useState, useEffect } from "react";
import { 
  HiCheckCircle, 
  HiShieldCheck, 
  HiFingerPrint, 
  HiClipboardList, 
  HiUpload, 
  HiCamera, 
  HiTruck,
  HiChevronRight,
  HiChevronLeft,
  HiPhotograph
} from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import { useBecomeDriver, useUploadDocuments, useUploadCarImages } from "@/src/features/auth/hooks/useAuth";
import { useAddVehicle, useCarColors } from "@/src/features/rides/hooks/useVehicles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

type Step = "info" | "documents" | "vehicle" | "car-images" | "complete";

const BecomeDriverPage = () => {
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const router = useRouter();

  // Step 1: Basic Info
  const { mutate: becomeDriver, isPending: isStep1Pending } = useBecomeDriver();
  const [step1Data, setStep1Data] = useState({
    driving_license_number: "",
    driving_license_expiration_date: "",
    birthday: "",
  });

  // Step 2: Driver Documents
  const { mutate: uploadDocuments, isPending: isStep2Pending } = useUploadDocuments();
  const [step2Data, setStep2Data] = useState<{
    driving_licence_front: File | null;
    driving_licence_back: File | null;
    driver_passport_image: File | null;
  }>({
    driving_licence_front: null,
    driving_licence_back: null,
    driver_passport_image: null,
  });

  // Step 3: Vehicle Info
  const { mutate: addVehicle, isPending: isStep3Pending } = useAddVehicle();
  const { data: colors } = useCarColors();
  const [step3Data, setStep3Data] = useState({
    vehicle_number: "",
    seats: "4",
    car_color_id: "",
    tech_passport_number: "",
    car_model: "",
  });
  const [generatedVehicleId, setGeneratedVehicleId] = useState<number | string | null>(null);

  // Step 4: Car Images
  const { mutate: uploadCarImages, isPending: isStep4Pending } = useUploadCarImages();
  const [step4Data, setStep4Data] = useState<{
    tech_passport_front: File | null;
    tech_passport_back: File | null;
    car_images: File[];
  }>({
    tech_passport_front: null,
    tech_passport_back: null,
    car_images: [],
  });

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    becomeDriver(step1Data, {
      onSuccess: () => {
        toast.success("License info saved!");
        setCurrentStep("documents");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to save license info");
      },
    });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Data.driving_licence_front || !step2Data.driving_licence_back || !step2Data.driver_passport_image) {
      toast.error("Please upload all required documents");
      return;
    }
    uploadDocuments({
      driving_licence_front: step2Data.driving_licence_front,
      driving_licence_back: step2Data.driving_licence_back,
      driver_passport_image: step2Data.driver_passport_image,
    }, {
      onSuccess: () => {
        toast.success("Documents uploaded successfully!");
        setCurrentStep("vehicle");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to upload documents");
      },
    });
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(step3Data, {
      onSuccess: (res) => {
        toast.success("Vehicle registered!");
        if (res.data?.id) {
          setGeneratedVehicleId(res.data.id);
        }
        setCurrentStep("car-images");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to register vehicle");
      },
    });
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedVehicleId) {
      toast.error("Process error: missing vehicle ID");
      return;
    }
    if (!step4Data.tech_passport_front || !step4Data.tech_passport_back || step4Data.car_images.length === 0) {
      toast.error("Please upload all required vehicle documents and at least one car image");
      return;
    }
    uploadCarImages({
      vehicle_id: generatedVehicleId,
      tech_passport_front: step4Data.tech_passport_front,
      tech_passport_back: step4Data.tech_passport_back,
      car_images: step4Data.car_images,
    }, {
      onSuccess: () => {
        toast.success("All information submitted! Welcome aboard.");
        setCurrentStep("complete");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to upload vehicle images");
      },
    });
  };

  const validateAndSetFile = (file: File | null, callback: (f: File | null) => void) => {
    if (file && file.size > 1 * 1024 * 1024) {
      toast.error("File size exceeds 1MB limit");
      return;
    }
    callback(file);
  };

  const handleCarImagesChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(f => {
      if (f.size > 1 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 1MB limit`);
        return false;
      }
      return true;
    });
    setStep4Data(prev => ({ ...prev, car_images: [...prev.car_images, ...validFiles] }));
  };

  return (
    <div className="bg-light-bg min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-dark-text mb-6">
            Become a <span className="text-primary">Qadam</span> Driver
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Complete these 4 steps to start earning with us.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto relative px-4">
          <div className="absolute top-[20px] left-0 w-full h-1 bg-border -z-0" />
          <StepIndicator 
            step={1} 
            active={currentStep === "info"} 
            completed={["documents", "vehicle", "car-images", "complete"].includes(currentStep)} 
            label="License" 
          />
          <StepIndicator 
            step={2} 
            active={currentStep === "documents"} 
            completed={["vehicle", "car-images", "complete"].includes(currentStep)} 
            label="ID Photos" 
          />
          <StepIndicator 
            step={3} 
            active={currentStep === "vehicle"} 
            completed={["car-images", "complete"].includes(currentStep)} 
            label="Vehicle" 
          />
          <StepIndicator 
            step={4} 
            active={currentStep === "car-images"} 
            completed={currentStep === "complete"} 
            label="Car Photos" 
          />
        </div>

        {currentStep === "complete" ? (
          <div className="premium-card p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
              <HiCheckCircle />
            </div>
            <h2 className="text-3xl font-black text-dark-text mb-4">You're all set!</h2>
            <p className="text-gray-500 font-medium mb-8">
              We've received your application and vehicle details. Our team will review them shortly. 
              You can track your status on the dashboard.
            </p>
            <Button size="lg" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Info Cards */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              <InfoCard
                icon={<HiShieldCheck className="w-6 h-6 text-secondary" />}
                title="Verified Only"
                description="Safety is our top priority for everyone."
              />
              <InfoCard
                icon={<HiFingerPrint className="w-6 h-6 text-accent" />}
                title="Data Security"
                description="Your data is encrypted and safe."
              />
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-3">
              <div className="premium-card p-8 md:p-10 transition-all duration-500">
                {currentStep === "info" && (
                  <form onSubmit={handleStep1Submit} className="space-y-6 animate-in slide-in-from-right duration-500">
                    <h2 className="text-2xl font-black text-dark-text mb-2">Driver License Info</h2>
                    <p className="text-gray-500 text-sm font-medium mb-6">Enter your basic document details to start.</p>
                    
                    <Input
                      label="Driving License Number"
                      placeholder="e.g. AB1234567"
                      value={step1Data.driving_license_number}
                      onChange={(e) => setStep1Data({...step1Data, driving_license_number: e.target.value})}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Expiration Date"
                        placeholder="DD.MM.YYYY"
                        value={step1Data.driving_license_expiration_date}
                        onChange={(e) => setStep1Data({...step1Data, driving_license_expiration_date: e.target.value})}
                        required
                      />
                      <Input
                        label="Birthday"
                        placeholder="DD.MM.YYYY"
                        value={step1Data.birthday}
                        onChange={(e) => setStep1Data({...step1Data, birthday: e.target.value})}
                        required
                      />
                    </div>
                    <div className="pt-6">
                      <Button type="submit" fullWidth size="lg" loading={isStep1Pending} icon={<HiChevronRight className="order-last ml-2" />}>
                        Next: ID Photos
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === "documents" && (
                  <form onSubmit={handleStep2Submit} className="space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-dark-text">Document Photos</h2>
                      <button type="button" onClick={() => setCurrentStep("info")} className="text-gray-400 hover:text-dark-text transition-colors flex items-center text-sm font-bold">
                        <HiChevronLeft className="mr-1" /> Back
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Clear photos of your driver's license and passport.</p>
                    
                    <div className="space-y-6">
                      <FileUploader
                        label="Driving License (Front)"
                        onFileSelect={(f) => validateAndSetFile(f, (file) => setStep2Data(p => ({...p, driving_licence_front: file})))}
                        selectedFile={step2Data.driving_licence_front}
                      />
                      <FileUploader
                        label="Driving License (Back)"
                        onFileSelect={(f) => validateAndSetFile(f, (file) => setStep2Data(p => ({...p, driving_licence_back: file})))}
                        selectedFile={step2Data.driving_licence_back}
                      />
                      <FileUploader
                        label="Passport Photo"
                        onFileSelect={(f) => validateAndSetFile(f, (file) => setStep2Data(p => ({...p, driver_passport_image: file})))}
                        selectedFile={step2Data.driver_passport_image}
                      />
                    </div>

                    <div className="pt-6">
                      <Button type="submit" fullWidth size="lg" loading={isStep2Pending} icon={<HiChevronRight className="order-last ml-2" />}>
                        Next: Vehicle Details
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === "vehicle" && (
                  <form onSubmit={handleStep3Submit} className="space-y-6 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-dark-text">Vehicle Registration</h2>
                      <button type="button" onClick={() => setCurrentStep("documents")} className="text-gray-400 hover:text-dark-text transition-colors flex items-center text-sm font-bold">
                        <HiChevronLeft className="mr-1" /> Back
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Basic info about your car.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Car Model"
                        placeholder="e.g. Chevrolet Nexia 3"
                        value={step3Data.car_model}
                        onChange={(e) => setStep3Data({...step3Data, car_model: e.target.value})}
                        required
                      />
                      <Input
                        label="Plate Number"
                        placeholder="e.g. 01 A 123 AA"
                        value={step3Data.vehicle_number}
                        onChange={(e) => setStep3Data({...step3Data, vehicle_number: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="w-full">
                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Car Color</label>
                        <select
                          className="w-full px-5 py-4 bg-light-bg border border-border rounded-lg outline-none transition-all font-semibold text-base mt-1"
                          value={step3Data.car_color_id}
                          onChange={(e) => setStep3Data({...step3Data, car_color_id: e.target.value})}
                          required
                        >
                          <option value="">Select Color</option>
                          {colors?.map(color => (
                            <option key={color.id} value={color.id}>{color.name}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Available Seats"
                        type="number"
                        min="1"
                        max="8"
                        value={step3Data.seats}
                        onChange={(e) => setStep3Data({...step3Data, seats: e.target.value})}
                        required
                      />
                    </div>

                    <Input
                      label="Tech Passport Number"
                      placeholder="e.g. TTR1234567"
                      value={step3Data.tech_passport_number}
                      onChange={(e) => setStep3Data({...step3Data, tech_passport_number: e.target.value})}
                      required
                    />

                    <div className="pt-6">
                      <Button type="submit" fullWidth size="lg" loading={isStep3Pending} icon={<HiChevronRight className="order-last ml-2" />}>
                        Next: Car Photos
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === "car-images" && (
                  <form onSubmit={handleStep4Submit} className="space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-dark-text">Vehicle Photos</h2>
                      <button type="button" onClick={() => setCurrentStep("vehicle")} className="text-gray-400 hover:text-dark-text transition-colors flex items-center text-sm font-bold">
                        <HiChevronLeft className="mr-1" /> Back
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Photos of your car and tech passport.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileUploader
                        label="Tech Passport (Front)"
                        onFileSelect={(f) => validateAndSetFile(f, (file) => setStep4Data(p => ({...p, tech_passport_front: file})))}
                        selectedFile={step4Data.tech_passport_front}
                      />
                      <FileUploader
                        label="Tech Passport (Back)"
                        onFileSelect={(f) => validateAndSetFile(f, (file) => setStep4Data(p => ({...p, tech_passport_back: file})))}
                        selectedFile={step4Data.tech_passport_back}
                      />
                    </div>

                    <div className="w-full">
                      <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Car Images (Multiple)</label>
                      <div className="mt-1.5 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {step4Data.car_images.map((file, idx) => (
                          <div key={idx} className="aspect-square bg-success/5 border-2 border-success rounded-2xl flex flex-col items-center justify-center text-success relative overflow-hidden group">
                            <HiPhotograph className="w-8 h-8 mb-1" />
                            <span className="text-[10px] font-bold px-2 truncate w-full text-center">{file.name}</span>
                            <button 
                              type="button" 
                              onClick={() => setStep4Data(p => ({...p, car_images: p.car_images.filter((_, i) => i !== idx)}))}
                              className="absolute inset-0 bg-error/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs"
                            >
                              REMOVE
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-all group">
                          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleCarImagesChange(e.target.files)} />
                          <HiUpload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase">Add More</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button type="submit" fullWidth size="lg" loading={isStep4Pending}>
                        Complete Application
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function StepIndicator({ step, active, completed, label }: { step: number; active: boolean; completed: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center z-10">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-4",
        active ? "bg-white border-primary text-primary scale-110 shadow-lg" : 
        completed ? "bg-primary border-primary text-white" : "bg-white border-border text-gray-400"
      )}>
        {completed ? <HiCheckCircle className="w-6 h-6" /> : step}
      </div>
      <span className={cn(
        "mt-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors text-center max-w-[60px]",
        active ? "text-primary" : completed ? "text-dark-text" : "text-gray-400"
      )}>
        {label}
      </span>
    </div>
  );
}

function FileUploader({ label, onFileSelect, selectedFile }: { label: string; onFileSelect: (f: File | null) => void; selectedFile: File | null }) {
  return (
    <div className="w-full">
      <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="mt-1.5 relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`file-${label}`}
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
        <label
          htmlFor={`file-${label}`}
          className={cn(
            "flex flex-col items-center justify-center w-full min-h-[100px] rounded-2xl border-2 border-dashed transition-all cursor-pointer group",
            selectedFile ? "border-success bg-success/5" : "border-border hover:border-primary hover:bg-primary/5"
          )}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center text-success animate-in fade-in zoom-in duration-300">
              <HiCheckCircle className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold truncate max-w-[150px]">{selectedFile.name}</span>
            </div>
          ) : (
            <>
              <HiCamera className="w-6 h-6 text-gray-400 mb-1 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary transition-colors text-center px-4">Select photo</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="premium-card p-6 border-none shadow-none bg-white/50">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-black text-dark-text">{title}</h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default BecomeDriverPage;
