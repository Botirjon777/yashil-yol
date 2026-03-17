export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  email: string;
  balance: number;
  cards: Card[];
  avatar?: string;
}

export interface Card {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Ride {
  id: string;
  driver: Driver;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  carModel: string;
  carColor?: string;
  rating: number;
  reviewCount: number;
}

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
}

export interface RideSearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  fatherName?: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyPayload {
  email: string;
  code: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
