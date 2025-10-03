const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
console.log("[v0] API Base URL:", baseURL)

export const API_BASE_URL = baseURL

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login/",
  REGISTER: "/api/auth/register/",
  REFRESH_TOKEN: "/api/auth/token/refresh/",
  PROFILE: "/api/auth/profile/",

  // Patients
  PATIENTS: "/api/patients/list/",
  PATIENT_DETAIL: (id) => `/api/patients/list/${id}/`,

  // Doctors
  DOCTORS: "/api/patients/doctors/",
  DOCTOR_DETAIL: (id) => `/api/patients/doctors/${id}/`,

  // Nurses
  NURSES: "/api/patients/nurses/",
  NURSE_DETAIL: (id) => `/api/patients/nurses/${id}/`,
}

console.log("[v0] API Endpoints:", API_ENDPOINTS)
