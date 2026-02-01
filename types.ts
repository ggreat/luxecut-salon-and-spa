
export enum BookingStep {
  SERVICE = 'service',
  STYLIST = 'stylist',
  DATETIME = 'datetime',
  INFO = 'info',
  CONFIRMATION = 'confirmation'
}

export interface SalonService {
  id: string;
  name: string;
  category: 'Hair' | 'Spa' | 'Color' | 'Treatment';
  price: number;
  duration: number; // in minutes
  description: string;
  image: string;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  portfolio: string[];
  availability: string[]; // e.g. ["2024-05-20T10:00:00", ...]
}

export interface AppointmentRequest {
  serviceId: string;
  stylistId: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  startTime: string;
  endTime: string;
  service: SalonService;
  stylist: Stylist;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  token: string;
}
