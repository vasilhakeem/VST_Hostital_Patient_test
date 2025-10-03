<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <Activity class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Hospital Management</h1>
        <p class="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="font-medium text-blue-600 hover:text-blue-700">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Activity } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  isLoading.value = true
  error.value = null

  try {
    console.log("[v0] LoginView: Attempting login with:", { username: formData.value.username })
    const result = await authStore.login(formData.value.username, formData.value.password)
    console.log("[v0] LoginView: Login result:", result)
    console.log("[v0] LoginView: isAuthenticated:", authStore.isAuthenticated)
    console.log("[v0] LoginView: Navigating to dashboard...")
    await router.push('/')
    console.log("[v0] LoginView: Navigation complete")
  } catch (err) {
    console.error("[v0] LoginView: Login failed with error:", err)
    console.error("[v0] LoginView: Error response:", err.response)
    console.error("[v0] LoginView: Error data:", err.response?.data)
    
    error.value = err.response?.data?.detail 
      || err.response?.data?.error 
      || err.response?.data?.message
      || err.message
      || 'Invalid credentials. Please try again.'
    
    console.error("[v0] LoginView: Displaying error:", error.value)
  } finally {
    isLoading.value = false
  }
}
</script>
