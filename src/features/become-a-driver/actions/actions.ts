import api from "@/src/lib/axios";
import {
  BecomeDriverRequest,
  UploadDocumentsRequest,
  UploadCarImagesRequest,
} from "../../auth/types";

/** POST /auth/become-a-driver */
export const becomeDriver = async (data: BecomeDriverRequest): Promise<{ status: string; message: string }> => {
  const res = await api.post("/auth/become-a-driver", data);
  return res.data;
};

/** POST /auth/upload-driver-passport-driving-licence */
export const uploadDriverDocuments = async (data: UploadDocumentsRequest): Promise<{ status: string; message: string }> => {
  const formData = new FormData();
  formData.append("driving_licence_front", data.driving_licence_front);
  formData.append("driving_licence_back", data.driving_licence_back);
  formData.append("driver_passport_image", data.driver_passport_image);

  const res = await api.post("/auth/upload-driver-passport-driving-licence", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/** POST /auth/upload-car-images */
export const uploadCarImages = async (data: UploadCarImagesRequest): Promise<{ status: string; message: string }> => {
  const formData = new FormData();
  formData.append("vehicle_id", String(data.vehicle_id));
  formData.append("tech_passport_front", data.tech_passport_front);
  formData.append("tech_passport_back", data.tech_passport_back);
  
  data.car_images.forEach((image, index) => {
    formData.append(`car_images[${index}]`, image);
  });

  const res = await api.post("/auth/upload-car-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
