import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/axios"
import { API_ENDPOINTS } from "../config/api"

export const usePatientsStore = defineStore("patients", () => {
  const patients = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchPatients() {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.get(API_ENDPOINTS.PATIENTS)
      patients.value = response.data.results || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to fetch patients"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createPatient(patientData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post(API_ENDPOINTS.PATIENTS, patientData)
      patients.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || "Failed to create patient"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updatePatient(id, patientData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.put(API_ENDPOINTS.PATIENT_DETAIL(id), patientData)
      const index = patients.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        patients.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || "Failed to update patient"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deletePatient(id) {
    isLoading.value = true
    error.value = null

    try {
      await axios.delete(API_ENDPOINTS.PATIENT_DETAIL(id))
      patients.value = patients.value.filter((p) => p.id !== id)
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete patient"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    patients,
    isLoading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  }
})
