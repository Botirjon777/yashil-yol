export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const PASSENGER_OPTIONS = [
  { value: "1", label: "1 passenger" },
  { value: "2", label: "2 passengers" },
  { value: "3", label: "3 passengers" },
  { value: "4", label: "4 passengers" },
];

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
