import { defineStore } from "pinia"
import { ref, computed } from "vue"
import axios from "../utils/axios"
import { API_ENDPOINTS } from "../config/api"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null)
  const accessToken = ref(localStorage.getItem("accessToken") || null)
  const refreshTokenValue = ref(localStorage.getItem("refreshToken") || null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(username, password) {
    isLoading.value = true
    error.value = null

    try {
      console.log("[v0] Login attempt:", { username })
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      })

      console.log("[v0] Login response:", response.data)

      accessToken.value = response.data.access
      refreshTokenValue.value = response.data.refresh
      user.value = response.data.user

      localStorage.setItem("accessToken", response.data.access)
      localStorage.setItem("refreshToken", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      console.log("[v0] Login successful, tokens stored, isAuthenticated:", isAuthenticated.value)
      return response.data
    } catch (err) {
      console.error("[v0] Login error:", err.response?.data)
      error.value = err.response?.data?.detail || err.response?.data?.error || "Login failed"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(username, email, password, password2, firstName = "", lastName = "") {
    isLoading.value = true
    error.value = null

    try {
      console.log("[v0] Register attempt:", { username, email, firstName, lastName })
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        username,
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
      })

      console.log("[v0] Register response:", response.data)

      if (response.data.access && response.data.refresh) {
        accessToken.value = response.data.access
        refreshTokenValue.value = response.data.refresh
        user.value = response.data.user

        localStorage.setItem("accessToken", response.data.access)
        localStorage.setItem("refreshToken", response.data.refresh)
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      console.log("[v0] Registration successful")
      return response.data
    } catch (err) {
      console.error("[v0] Register error:", err.response?.data)
      error.value = err.response?.data || "Registration failed"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function refreshToken() {
    try {
      const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
        refresh: refreshTokenValue.value,
      })

      accessToken.value = response.data.access
      localStorage.setItem("accessToken", response.data.access)

      return response.data
    } catch (err) {
      logout()
      throw err
    }
  }

  async function fetchProfile() {
    try {
      const response = await axios.get(API_ENDPOINTS.PROFILE)
      user.value = response.data
      return response.data
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      throw err
    }
  }

  function logout() {
    console.log("[v0] Logging out")
    user.value = null
    accessToken.value = null
    refreshTokenValue.value = null
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    refreshToken,
    fetchProfile,
    logout,
  }
})
