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
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/api/auth/reset-password', { token, new_password: newPassword }),
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
  getReservationDetail: (id: number) =>
    api.get(`/api/admin/reservations/${id}`),
};

// Admin Stats
interface AdminStats {
  total_reservations: number;
  today_reservations: number;
  waiting_count: number;
  called_count: number;
  completed_count: number;
  cancelled_count: number;
  total_doctors: number;
  total_patients: number;
  active_reservations: number;
}

// Admin Reservation Filter
interface AdminReservationFilter {
  status?: 'menunggu' | 'dipanggil' | 'selesai' | 'batal';
  date?: string;
  doctor_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// Reservation with details
interface ReservationWithDetails {
  id: number;
  patient_id: number;
  doctor_id: number;
  schedule_id: number;
  reservation_date: string;
  queue_number: number;
  queue_code: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  doctor_name: string;
  doctor_specialization: string;
  doctor_room: string;
  schedule_start_time: string;
  schedule_end_time: string;
  patient_name?: string;
  patient_phone?: string;
}

// Doctor
interface Doctor {
  id: number;
  user_id: number;
  name: string;
  specialization: string;
  room: string;
  bio: string;
  photo_url: string;
  created_at: string;
}

// Admin API
export const adminAPI = {
  getStats: (): Promise<{ data: AdminStats }> =>
    api.get('/api/admin/stats'),
  getReservations: (params?: AdminReservationFilter) =>
    api.get('/api/admin/reservations', { params }),
  getDoctors: (): Promise<{ data: { doctors: Doctor[] } }> =>
    api.get('/api/admin/doctors'),
  getPatients: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get('/api/admin/patients', { params }),
  updatePatient: (id: number, data: { name: string; phone: string }) =>
    api.put(`/api/admin/patients/${id}`, data),
  deactivatePatient: (id: number) =>
    api.post(`/api/admin/patients/${id}/deactivate`),
  updateDoctor: (id: number, data: { name: string; specialization: string; room: string; bio: string }) =>
    api.put(`/api/admin/doctors/${id}`, data),
  deleteDoctor: (id: number) =>
    api.delete(`/api/admin/doctors/${id}`),
  createSchedule: (doctorId: number, data: { day_of_week: number; start_time: string; end_time: string; max_patients: number; is_active: boolean }) =>
    api.post(`/api/admin/doctors/${doctorId}/schedules`, data),
  updateSchedule: (scheduleId: number, data: { day_of_week: number; start_time: string; end_time: string; max_patients: number; is_active: boolean }) =>
    api.put(`/api/admin/schedules/${scheduleId}`, data),
  deleteSchedule: (scheduleId: number) =>
    api.delete(`/api/admin/schedules/${scheduleId}`),
};

// User API (profile)
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: { name: string; phone: string }) => api.put('/api/users/profile', data),
  changePassword: (data: { old_password: string; new_password: string }) => api.put('/api/users/password', data),
};

export default api;