import axios from "axios"
import { API_BASE_URL } from "../config/api"
import { useAuthStore } from "../stores/auth"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("[v0] Axios request:", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    })

    const authStore = useAuthStore()

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => {
    console.error("[v0] Axios request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("[v0] Axios response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    })
    return response
  },
  async (error) => {
    console.error("[v0] Axios response error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      isNetworkError: !error.response,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      },
    })

    if (!error.response) {
      console.error("[v0] Network Error - Request never reached server")
      console.error("[v0] Possible causes: CORS, server not running, wrong URL")
      console.error("[v0] Check that Django backend is running on:", API_BASE_URL)
    }

    const originalRequest = error.config
    const authStore = useAuthStore()

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await authStore.refreshToken()

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        authStore.logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
