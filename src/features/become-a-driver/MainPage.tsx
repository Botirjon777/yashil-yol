"use client";

import React from "react";
import { HiShieldCheck, HiFingerPrint } from "react-icons/hi";
import {
  useBecomeDriver,
  useUploadDocuments,
  useUploadCarImages,
} from "./hooks/useBecomeDriver";
import {
  useAddVehicle,
  useCarColors,
} from "@/src/features/rides/hooks/useVehicles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { StepIndicator } from "./components/StepIndicator";
import { InfoCard } from "./components/InfoCard";
import { InfoStep } from "./sections/InfoStep";
import { DocumentsStep } from "./sections/DocumentsStep";
import { VehicleStep } from "./sections/VehicleStep";
import { CarImagesStep } from "./sections/CarImagesStep";
import { CompleteStep } from "./sections/CompleteStep";

import { useBecomeDriverStore } from "./store/becomeDriverStore";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

const MainPage = () => {
  const {
    currentStep,
    setCurrentStep,
    step1Data,
    setStep1Data,
    step2Data,
    setStep2Data,
    step3Data,
    setStep3Data,
    step4Data,
    setStep4Data,
    generatedVehicleId,
    setGeneratedVehicleId,
    _hasHydrated,
    reset,
  } = useBecomeDriverStore();

  const router = useRouter();
  const { t } = useLanguageStore();

  // Step 1: Basic Info
  const { mutate: becomeDriver, isPending: isStep1Pending } = useBecomeDriver();

  // Step 2: Driver Documents
  const { mutate: uploadDocuments, isPending: isStep2Pending } =
    useUploadDocuments();

  // Step 3: Vehicle Info
  const { mutate: addVehicle, isPending: isStep3Pending } = useAddVehicle();
  const { data: colors } = useCarColors();

  // Step 4: Car Images
  const { mutate: uploadCarImages, isPending: isStep4Pending } =
    useUploadCarImages();

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    becomeDriver(step1Data, {
      onSuccess: () => {
        toast.success(t("becomeDriver", "toasts")?.step1Success);
        setCurrentStep("documents");
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ||
            t("becomeDriver", "toasts")?.step1Error,
        );
      },
    });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !step2Data.driving_licence_front ||
      !step2Data.driving_licence_back ||
      !step2Data.driver_passport_image
    ) {
      toast.error(t("becomeDriver", "toasts")?.step2Warning);
      return;
    }
    uploadDocuments(
      {
        driving_licence_front: step2Data.driving_licence_front,
        driving_licence_back: step2Data.driving_licence_back,
        driver_passport_image: step2Data.driver_passport_image,
      },
      {
        onSuccess: () => {
          toast.success(t("becomeDriver", "toasts")?.step2Success);
          setCurrentStep("vehicle");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message ||
              t("becomeDriver", "toasts")?.step2Error,
          );
        },
      },
    );
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(step3Data, {
      onSuccess: (res) => {
        toast.success(t("becomeDriver", "toasts")?.step3Success);
        if (res.data?.id) {
          setGeneratedVehicleId(res.data.id);
        }
        setCurrentStep("car-images");
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ||
            t("becomeDriver", "toasts")?.step3Error,
        );
      },
    });
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedVehicleId) {
      toast.error(t("becomeDriver", "toasts")?.processError);
      return;
    }
    if (
      !step4Data.tech_passport_front ||
      !step4Data.tech_passport_back ||
      step4Data.car_images.length === 0
    ) {
      toast.error(t("becomeDriver", "toasts")?.step4Warning);
      return;
    }
    uploadCarImages(
      {
        vehicle_id: generatedVehicleId,
        tech_passport_front: step4Data.tech_passport_front,
        tech_passport_back: step4Data.tech_passport_back,
        car_images: step4Data.car_images,
      },
      {
        onSuccess: () => {
          toast.success(t("becomeDriver", "toasts")?.step4Success);
          setCurrentStep("complete");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message ||
              t("becomeDriver", "toasts")?.step4Error,
          );
        },
      },
    );
  };

  const validateAndSetFile = (
    file: File | null,
    callback: (f: File | null) => void,
  ) => {
    if (file && file.size > 1 * 1024 * 1024) {
      toast.error(t("becomeDriver", "toasts")?.fileSizeError);
      return;
    }
    callback(file);
  };

  const handleCarImagesChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((f) => {
      if (f.size > 1 * 1024 * 1024) {
        toast.error(`${f.name} ${t("becomeDriver", "toasts")?.fileSizeError}`);
        return false;
      }
      return true;
    });
    setStep4Data((prev) => ({
      ...prev,
      car_images: [...prev.car_images, ...validFiles],
    }));
  };

  return (
    <div className="bg-light-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-dark-text mb-6">
            {t("becomeDriver", "title")?.split("Qadam")[0]}
            <span className="text-primary">Qadam</span>
            {t("becomeDriver", "title")?.split("Qadam")[1]}
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            {t("becomeDriver", "subtitle")}
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto relative px-4">
          <div className="absolute top-[20px] left-0 w-full h-1 bg-border z-0" />
          <StepIndicator
            step={1}
            active={currentStep === "info"}
            completed={[
              "documents",
              "vehicle",
              "car-images",
              "complete",
            ].includes(currentStep)}
            label={t("becomeDriver", "steps")?.license}
          />
          <StepIndicator
            step={2}
            active={currentStep === "documents"}
            completed={["vehicle", "car-images", "complete"].includes(
              currentStep,
            )}
            label={t("becomeDriver", "steps")?.idPhotos}
          />
          <StepIndicator
            step={3}
            active={currentStep === "vehicle"}
            completed={["car-images", "complete"].includes(currentStep)}
            label={t("becomeDriver", "steps")?.vehicle}
          />
          <StepIndicator
            step={4}
            active={currentStep === "car-images"}
            completed={currentStep === "complete"}
            label={t("becomeDriver", "steps")?.carPhotos}
          />
        </div>

        {currentStep === "complete" ? (
          <CompleteStep
            onGoToDashboard={() => {
              reset();
              router.push("/dashboard");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Info Cards */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              <InfoCard
                icon={<HiShieldCheck className="w-6 h-6 text-secondary" />}
                title={t("becomeDriver", "cards")?.verified?.title}
                description={t("becomeDriver", "cards")?.verified?.desc}
              />
              <InfoCard
                icon={<HiFingerPrint className="w-6 h-6 text-accent" />}
                title={t("becomeDriver", "cards")?.security?.title}
                description={t("becomeDriver", "cards")?.security?.desc}
              />
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-3">
              <div className="premium-card p-8 md:p-10 transition-all duration-500">
                {currentStep === "info" && (
                  <InfoStep
                    data={step1Data}
                    onChange={setStep1Data}
                    onSubmit={handleStep1Submit}
                    isPending={isStep1Pending}
                  />
                )}

                {currentStep === "documents" && (
                  <DocumentsStep
                    data={step2Data}
                    onFileSelect={(field, file) =>
                      validateAndSetFile(file, (f) =>
                        setStep2Data((p) => ({ ...p, [field]: f })),
                      )
                    }
                    onSubmit={handleStep2Submit}
                    onBack={() => setCurrentStep("info")}
                    isPending={isStep2Pending}
                  />
                )}

                {currentStep === "vehicle" && (
                  <VehicleStep
                    data={step3Data}
                    colors={colors}
                    onChange={setStep3Data}
                    onSubmit={handleStep3Submit}
                    onBack={() => setCurrentStep("documents")}
                    isPending={isStep3Pending}
                  />
                )}

                {currentStep === "car-images" && (
                  <CarImagesStep
                    data={step4Data}
                    onFileSelect={(field, file) =>
                      validateAndSetFile(file, (f) =>
                        setStep4Data((p) => ({ ...p, [field]: f })),
                      )
                    }
                    onCarImagesChange={handleCarImagesChange}
                    onRemoveCarImage={(idx) =>
                      setStep4Data((p) => ({
                        ...p,
                        car_images: p.car_images.filter((_, i) => i !== idx),
                      }))
                    }
                    onSubmit={handleStep4Submit}
                    onBack={() => setCurrentStep("vehicle")}
                    isPending={isStep4Pending}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
