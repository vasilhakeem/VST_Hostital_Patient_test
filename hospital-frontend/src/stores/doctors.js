import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/axios"
import { API_ENDPOINTS } from "../config/api"

export const useDoctorsStore = defineStore("doctors", () => {
  const doctors = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchDoctors() {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.get(API_ENDPOINTS.DOCTORS)
      doctors.value = response.data.results || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to fetch doctors"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createDoctor(doctorData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post(API_ENDPOINTS.DOCTORS, doctorData)
      doctors.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || "Failed to create doctor"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteDoctor(id) {
    isLoading.value = true
    error.value = null

    try {
      await axios.delete(API_ENDPOINTS.DOCTOR_DETAIL(id))
      doctors.value = doctors.value.filter((d) => d.id !== id)
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete doctor"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    doctors,
    isLoading,
    error,
    fetchDoctors,
    createDoctor,
    deleteDoctor,
  }
})
