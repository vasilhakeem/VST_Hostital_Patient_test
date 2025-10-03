import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/axios"
import { API_ENDPOINTS } from "../config/api"

export const useNursesStore = defineStore("nurses", () => {
  const nurses = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchNurses() {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.get(API_ENDPOINTS.NURSES)
      nurses.value = response.data.results || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to fetch nurses"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createNurse(nurseData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post(API_ENDPOINTS.NURSES, nurseData)
      nurses.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || "Failed to create nurse"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteNurse(id) {
    isLoading.value = true
    error.value = null

    try {
      await axios.delete(API_ENDPOINTS.NURSE_DETAIL(id))
      nurses.value = nurses.value.filter((n) => n.id !== id)
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete nurse"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    nurses,
    isLoading,
    error,
    fetchNurses,
    createNurse,
    deleteNurse,
  }
})
