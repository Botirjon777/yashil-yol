export type Step = "info" | "documents" | "vehicle" | "car-images" | "complete";

export interface Step1Data {
  driving_license_number: string;
  driving_license_expiration_date: string;
  birthday: string;
}

export interface Step2Data {
  driving_licence_front: File | null;
  driving_licence_back: File | null;
  driver_passport_image: File | null;
}

export interface Step3Data {
  vehicle_number: string;
  seats: string;
  car_color_id: string;
  tech_passport_number: string;
  car_model: string;
}

export interface Step4Data {
  tech_passport_front: File | null;
  tech_passport_back: File | null;
  car_images: File[];
}
