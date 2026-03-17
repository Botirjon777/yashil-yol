export interface Region {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const UZBEKISTAN_REGIONS: Region[] = [
  { id: "tashkent_city", name: "Tashkent", lat: 41.2995, lng: 69.2401 },
  { id: "tashkent_region", name: "Tashkent Region", lat: 41.1127, lng: 69.2972 },
  { id: "samarkand", name: "Samarkand", lat: 39.6547, lng: 66.9758 },
  { id: "bukhara", name: "Bukhara", lat: 39.7747, lng: 64.4286 },
  { id: "khorezm", name: "Khorezm", lat: 41.3755, lng: 60.3592 },
  { id: "fergana", name: "Fergana", lat: 40.3834, lng: 71.7878 },
  { id: "andijan", name: "Andijan", lat: 40.7821, lng: 72.3442 },
  { id: "namangan", name: "Namangan", lat: 41.0, lng: 71.6667 },
  { id: "navoi", name: "Navoi", lat: 40.1, lng: 65.3667 },
  { id: "jizzakh", name: "Jizzakh", lat: 40.1158, lng: 67.8422 },
  { id: "syrdarya", name: "Syrdarya", lat: 40.8334, lng: 68.7 },
  { id: "kashkadarya", name: "Kashkadarya", lat: 38.8647, lng: 65.7878 },
  { id: "surkhandarya", name: "Surkhandarya", lat: 37.9358, lng: 67.5686 },
  { id: "karakalpakstan", name: "Karakalpakstan", lat: 43.7667, lng: 59.3833 },
];
