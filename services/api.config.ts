
/**
 * API Configuration - MUST BE PROMINENTLY COMMENTED
 * ================================================
 * Base URL configuration for SpringBoot backend
 */
export const API_CONFIG = {
  // Replace with actual deployment URL (e.g., https://api.luxecut.com/api)
  BASE_URL: 'http://localhost:8080/api', 
  ENDPOINTS: {
    APPOINTMENTS: '/appointments',
    SERVICES: '/services',
    STYLISTS: '/stylists',
    AVAILABILITY: '/availability',
    CUSTOMERS: '/customers',
    AUTH: '/auth'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * Utility to construct full API URLs
 */
export const getUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => 
  `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;

/**
 * Centralized Error Handler
 */
export const handleApiError = (error: any) => {
  console.error('[API Error]:', error);
  // In a real app, this might trigger a global toast or redirect
  const message = error?.response?.data?.message || 'A network error occurred. Please try again.';
  return { success: false, message };
};
