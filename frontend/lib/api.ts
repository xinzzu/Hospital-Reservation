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

// FHIR Types
export interface FHIRPatient {
  id: number;
  user_id: number;
  identifier: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface FHIRCondition {
  id: number;
  patient_id: number;
  clinicalStatus: string;
  verificationStatus: string;
  category: string;
  severity: string;
  codeSystem: string;
  codeCode: string;
  codeDisplay: string;
  onsetDateTime: string;
  abatementDateTime: string;
  recorderId: number;
  note: string;
  fhir_id: string;
  created_at: string;
  updated_at: string;
}

export interface FHIRObservation {
  id: number;
  patient_id: number;
  status: string;
  category: string;
  codeSystem: string;
  codeCode: string;
  codeDisplay: string;
  valueType: string;
  valueQuantity: number;
  valueQuantityUnit: string;
  valueString: string;
  effectiveDateTime: string;
  interpretation: string;
  referenceRangeLow: number;
  referenceRangeHigh: number;
  referenceRangeText: string;
  componentJSON: string;
  encounterId: number;
  fhir_id: string;
  created_at: string;
  updated_at: string;
}

export interface FHIRMedicationRequest {
  id: number;
  patient_id: number;
  status: string;
  intent: string;
  medicationSystem: string;
  medicationCode: string;
  medicationDisplay: string;
  authoredOn: string;
  requesterId: number;
  dosageText: string;
  dosageRoute: string;
  dosageFrequency: number;
  dosagePeriod: number;
  dosagePeriodUnit: string;
  dispenseQuantity: number;
  dispenseUnit: string;
  note: string;
  fhir_id: string;
  created_at: string;
  updated_at: string;
}

export interface FHIRAllergyIntolerance {
  id: number;
  patient_id: number;
  clinicalStatus: string;
  type: string;
  category: string;
  criticality: string;
  substanceSystem: string;
  substanceCode: string;
  substanceDisplay: string;
  reactionManifestation: string;
  reactionSeverity: string;
  note: string;
  fhir_id: string;
  created_at: string;
  updated_at: string;
}

export interface PatientHealthSummary {
  patient: FHIRPatient;
  conditions: FHIRCondition[];
  observations: FHIRObservation[];
  medications: FHIRMedicationRequest[];
  allergies: FHIRAllergyIntolerance[];
  recentEncounters: ReservationWithDetails[];
}

// FHIR API
export const fhirAPI = {
  // Patient summary
  getPatientSummary: (): Promise<{ data: PatientHealthSummary }> =>
    api.get('/api/fhir/me'),

  // Conditions
  getConditions: (): Promise<{ data: { entry: FHIRCondition[]; total: number } }> =>
    api.get('/api/fhir/conditions'),
  createCondition: (data: {
    clinicalStatus?: string;
    verificationStatus?: string;
    category?: string;
    severity?: string;
    codeSystem?: string;
    codeCode?: string;
    codeDisplay?: string;
    onsetDate?: string;
    note?: string;
  }) => api.post('/api/fhir/conditions', data),

  // Observations
  getObservations: (category?: string): Promise<{ data: { entry: FHIRObservation[]; total: number } }> =>
    api.get('/api/fhir/observations', { params: { category } }),
  createObservation: (data: {
    status?: string;
    category: string;
    codeSystem?: string;
    codeCode?: string;
    codeDisplay?: string;
    valueType?: string;
    valueQuantity?: string;
    valueQuantityUnit?: string;
    valueString?: string;
    effectiveDate?: string;
    interpretation?: string;
    referenceRangeLow?: number;
    referenceRangeHigh?: number;
    referenceRangeText?: string;
  }) => api.post('/api/fhir/observations', data),

  // Medications
  getMedications: (): Promise<{ data: { entry: FHIRMedicationRequest[]; total: number } }> =>
    api.get('/api/fhir/medications'),
  createMedication: (data: {
    status?: string;
    intent?: string;
    medicationSystem?: string;
    medicationCode?: string;
    medicationDisplay: string;
    dosageText?: string;
    dosageRoute?: string;
    dosageFrequency?: number;
    dosagePeriod?: number;
    dosagePeriodUnit?: string;
    note?: string;
  }) => api.post('/api/fhir/medications', data),

  // Allergies
  getAllergies: (): Promise<{ data: { entry: FHIRAllergyIntolerance[]; total: number } }> =>
    api.get('/api/fhir/allergies'),
  createAllergy: (data: {
    clinicalStatus?: string;
    type?: string;
    category?: string;
    criticality?: string;
    substanceSystem?: string;
    substanceCode?: string;
    substanceDisplay: string;
    reactionManifestation?: string;
    reactionSeverity?: string;
    note?: string;
  }) => api.post('/api/fhir/allergies', data),
};

// Admin EHR API
export const adminEHRAPI = {
  // Get single patient EHR
  getPatientEHR: (patientId: number): Promise<{ data: PatientHealthSummary }> =>
    api.get(`/api/admin/patients/${patientId}/ehr`),

  // Create condition for patient
  createCondition: (patientId: number, data: {
    clinicalStatus?: string;
    verificationStatus?: string;
    category?: string;
    severity?: string;
    codeSystem?: string;
    codeCode?: string;
    codeDisplay?: string;
    onsetDate?: string;
    note?: string;
  }) => api.post(`/api/admin/patients/${patientId}/conditions`, data),

  // Create observation for patient
  createObservation: (patientId: number, data: {
    status?: string;
    category: string;
    codeSystem?: string;
    codeCode?: string;
    codeDisplay?: string;
    valueType?: string;
    valueQuantity?: string;
    valueQuantityUnit?: string;
    valueString?: string;
    effectiveDate?: string;
    interpretation?: string;
    referenceRangeLow?: number;
    referenceRangeHigh?: number;
    referenceRangeText?: string;
  }) => api.post(`/api/admin/patients/${patientId}/observations`, data),

  // Create medication for patient
  createMedication: (patientId: number, data: {
    status?: string;
    intent?: string;
    medicationSystem?: string;
    medicationCode?: string;
    medicationDisplay: string;
    dosageText?: string;
    dosageRoute?: string;
    dosageFrequency?: number;
    dosagePeriod?: number;
    dosagePeriodUnit?: string;
    note?: string;
  }) => api.post(`/api/admin/patients/${patientId}/medications`, data),

  // Create allergy for patient
  createAllergy: (patientId: number, data: {
    clinicalStatus?: string;
    type?: string;
    category?: string;
    criticality?: string;
    substanceSystem?: string;
    substanceCode?: string;
    substanceDisplay: string;
    reactionManifestation?: string;
    reactionSeverity?: string;
    note?: string;
  }) => api.post(`/api/admin/patients/${patientId}/allergies`, data),

  // Update medication status
  updateMedicationStatus: (medicationId: number, status: string) =>
    api.patch(`/api/admin/medications/${medicationId}/status`, { status }),

  // Update allergy status
  updateAllergyStatus: (allergyId: number, status: string) =>
    api.patch(`/api/admin/allergies/${allergyId}/status`, { clinicalStatus: status }),
};

export default api;