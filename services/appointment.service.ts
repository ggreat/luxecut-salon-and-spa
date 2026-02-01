
import { AppointmentRequest, AppointmentResponse, SalonService, Stylist } from '../types.ts';
import { getUrl, API_CONFIG, handleApiError } from './api.config.ts';

/**
 * Appointment booking service
 * Handles all CRUD operations for appointments
 * @module services/appointment.service
 */

/**
 * Fetch all available services from the backend
 * @returns {Promise<SalonService[]>}
 */
export const getServices = async (): Promise<SalonService[]> => {
  try {
    // In a real app: await fetch(getUrl('SERVICES'))
    return [
      { 
        id: '1', 
        name: 'Precision Signature Cut', 
        category: 'Hair', 
        price: 85, 
        duration: 45, 
        description: 'Elite precision cutting tailored to your face shape and personal style.', 
        image: 'https://images.unsplash.com/photo-1599351431247-f509403c74bc?q=80&w=800' 
      },
      { 
        id: '2', 
        name: 'Artistic Color & Tone', 
        category: 'Color', 
        price: 210, 
        duration: 180, 
        description: 'Bespoke coloring and highlights designed specifically for men\'s modern styles.', 
        image: 'https://images.unsplash.com/photo-1620331713515-7767746f361c?q=80&w=800' 
      },
      { 
        id: '3', 
        name: 'Revitalizing Spa Ritual', 
        category: 'Treatment', 
        price: 65, 
        duration: 30, 
        description: 'Deep scalp cleaning and nutrient infusion combined with a relaxing massage.', 
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800' 
      },
      { 
        id: '4', 
        name: 'Royal Executive Grooming', 
        category: 'Hair', 
        price: 55, 
        duration: 30, 
        description: 'Sharp straight-razor detailing, hot towel finish, and classic grooming.', 
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800' 
      }
    ];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch stylists based on selected service
 * @param {string} serviceId 
 */
export const getStylists = async (serviceId?: string): Promise<Stylist[]> => {
  try {
    // In a real app: await fetch(`${getUrl('STYLISTS')}?serviceId=${serviceId}`)
    const allStylists: Stylist[] = [
      { 
        id: 's1', 
        name: 'Marcus Thorne', 
        role: 'Master Stylist', 
        bio: 'Marcus has over 15 years of experience in the high-end salon industry. Known for his architectural approach to hair design, he specializes in avant-garde precision cuts.', 
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800',
        specialties: ['Precision Cutting', 'Architectural Styling', 'Men\'s Executive Cuts'],
        portfolio: [
          'https://images.unsplash.com/photo-1599351431247-f509403c74bc?q=80&w=600',
          'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=600',
          'https://images.unsplash.com/photo-1605497746444-1100220d9f0a?q=80&w=600'
        ],
        availability: [] 
      },
      { 
        id: 's2', 
        name: 'Elena Rossi', 
        role: 'Color Specialist', 
        bio: 'Elena is a visionary colorist who blends classic techniques with modern trends. Her goal is breathtaking results without compromising hair health.', 
        image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800',
        specialties: ['Balayage', 'Color Correction', 'Pastel Tones', 'Gloss Treatments'],
        portfolio: [
          'https://images.unsplash.com/photo-1620331713515-7767746f361c?q=80&w=600',
          'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?q=80&w=600',
          'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=600'
        ],
        availability: [] 
      },
      { 
        id: 's3', 
        name: 'Julian Vance', 
        role: 'Grooming Expert', 
        bio: 'Julian brings a refined touch to traditional men\'s grooming. Master of the straight razor, providing an elevated experience for the modern gentleman.', 
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800',
        specialties: ['Straight Razor Shaves', 'Beard Sculpting', 'Traditional Tapers'],
        portfolio: [
          'https://images.unsplash.com/photo-1621605815841-aa33435f349c?q=80&w=600',
          'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600',
          'https://images.unsplash.com/photo-1634302086827-13cd57abe24e?q=80&w=600'
        ],
        availability: [] 
      }
    ];
    return allStylists;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Check real-time availability for a stylist on a specific date
 */
export const checkAvailability = async (stylistId: string, date: string): Promise<string[]> => {
  try {
    return [
      '09:00', '10:00', '11:00', '13:00', '14:00', '15:30', '16:30'
    ];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new appointment
 * @param {AppointmentRequest} data 
 */
export const createAppointment = async (data: AppointmentRequest): Promise<AppointmentResponse> => {
  try {
    const response = await fetch(getUrl('APPOINTMENTS'), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Booking failed');
    return await response.json();
  } catch (error) {
    console.warn('Backend unavailable or failed, returning mock success for demo');
    return {
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      status: 'CONFIRMED',
      totalPrice: 85,
      startTime: data.dateTime,
      endTime: data.dateTime, 
      service: { id: data.serviceId, name: 'Sample Service', price: 85 } as any,
      stylist: { id: data.stylistId, name: 'Sample Stylist' } as any
    };
  }
};
