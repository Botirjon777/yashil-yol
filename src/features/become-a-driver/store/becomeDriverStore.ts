import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Step, Step1Data, Step2Data, Step3Data, Step4Data } from "../types";

interface BecomeDriverState {
  currentStep: Step;
  step1Data: Step1Data;
  step2Data: Step2Data;
  step3Data: Step3Data;
  step4Data: Step4Data;
  generatedVehicleId: number | string | null;
  _hasHydrated: boolean;
  
  setCurrentStep: (step: Step) => void;
  setStep1Data: (data: Step1Data | ((prev: Step1Data) => Step1Data)) => void;
  setStep2Data: (data: Step2Data | ((prev: Step2Data) => Step2Data)) => void;
  setStep3Data: (data: Step3Data | ((prev: Step3Data) => Step3Data)) => void;
  setStep4Data: (data: Step4Data | ((prev: Step4Data) => Step4Data)) => void;
  setGeneratedVehicleId: (id: number | string | null) => void;
  reset: () => void;
}

export const useBecomeDriverStore = create<BecomeDriverState>()(
  persist(
    (set) => ({
      currentStep: "info",
      step1Data: {
        driving_license_number: "",
        driving_license_expiration_date: "",
        birthday: "",
      },
      step2Data: {
        driving_licence_front: null,
        driving_licence_back: null,
        driver_passport_image: null,
      },
      step3Data: {
        vehicle_number: "",
        seats: "4",
        car_color_id: "",
        tech_passport_number: "",
        car_model: "",
      },
      step4Data: {
        tech_passport_front: null,
        tech_passport_back: null,
        car_images: [],
      },
      generatedVehicleId: null,
      _hasHydrated: false,

      setCurrentStep: (step) => set({ currentStep: step }),
      setStep1Data: (data) => 
        set((state) => ({ 
          step1Data: typeof data === 'function' ? data(state.step1Data) : data 
        })),
      setStep2Data: (data) => 
        set((state) => ({ 
          step2Data: typeof data === 'function' ? data(state.step2Data) : data 
        })),
      setStep3Data: (data) => 
        set((state) => ({ 
          step3Data: typeof data === 'function' ? data(state.step3Data) : data 
        })),
      setStep4Data: (data) => 
        set((state) => ({ 
          step4Data: typeof data === 'function' ? data(state.step4Data) : data 
        })),
      setGeneratedVehicleId: (id) => set({ generatedVehicleId: id }),
      reset: () => set({
        currentStep: "info",
        step1Data: { driving_license_number: "", driving_license_expiration_date: "", birthday: "" },
        step2Data: { driving_licence_front: null, driving_licence_back: null, driver_passport_image: null },
        step3Data: { vehicle_number: "", seats: "4", car_color_id: "", tech_passport_number: "", car_model: "" },
        step4Data: { tech_passport_front: null, tech_passport_back: null, car_images: [] },
        generatedVehicleId: null,
      }),
    }),
    {
      name: "become-driver-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);
