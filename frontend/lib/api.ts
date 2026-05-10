import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const storage = localStorage.getItem('auth-storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const url = error.config?.url || '';

        // Skip redirect for auth endpoints
        if (url.includes('/auth/login') || url.includes('/auth/register')) {
          return Promise.reject(error);
        }

        // For other endpoints, clear auth and redirect
        try {
          const storage = localStorage.getItem('auth-storage');
          if (storage) {
            const parsed = JSON.parse(storage);
            const wasAuthenticated = parsed.state?.isAuthenticated;

            if (wasAuthenticated) {
              localStorage.removeItem('auth-storage');
              window.location.href = '/login';
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getProfile: () =>
    api.get('/api/auth/me'),
};

// Hospital API
export const hospitalAPI = {
  getInfo: () =>
    api.get('/api/hospital/info'),
};

// Doctors API
export const doctorsAPI = {
  getAll: (params?: { search?: string; specialization?: string }) =>
    api.get('/api/doctors', { params }),
  getById: (id: number) =>
    api.get(`/api/doctors/${id}`),
  getSchedules: (id: number) =>
    api.get(`/api/doctors/${id}/schedules`),
  getSpecializations: () =>
    api.get('/api/doctors/specializations'),
};

// Reservations API
export const reservationsAPI = {
  create: (data: { doctor_id: number; schedule_id: number; date: string; notes?: string }) =>
    api.post('/api/reservations', data),
  getMyReservations: () =>
    api.get('/api/reservations/me'),
  getByCode: (code: string) =>
    api.get(`/api/reservations/${code}`),
  updateStatus: (code: string, status: string) =>
    api.patch(`/api/reservations/${code}/status`, { status }),
};

export default api;