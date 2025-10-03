<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Patients Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Patients</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ isLoading ? '...' : patientsStore.patients.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Doctors Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Doctors</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ isLoading ? '...' : doctorsStore.doctors.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Stethoscope class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Nurses Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Nurses</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ isLoading ? '...' : nursesStore.nurses.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UserCog class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <router-link
          to="/patients"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
        >
          <Users class="w-5 h-5 text-primary-600 mr-3" />
          <span class="font-medium text-gray-900">Manage Patients</span>
        </router-link>
        <router-link
          to="/doctors"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
        >
          <Stethoscope class="w-5 h-5 text-primary-600 mr-3" />
          <span class="font-medium text-gray-900">Manage Doctors</span>
        </router-link>
        <router-link
          to="/nurses"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
        >
          <UserCog class="w-5 h-5 text-primary-600 mr-3" />
          <span class="font-medium text-gray-900">Manage Nurses</span>
        </router-link>
        <router-link
          to="/users"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
        >
          <User class="w-5 h-5 text-primary-600 mr-3" />
          <span class="font-medium text-gray-900">View Users</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePatientsStore } from '../stores/patients'
import { useDoctorsStore } from '../stores/doctors'
import { useNursesStore } from '../stores/nurses'
import { Users, Stethoscope, UserCog, User } from 'lucide-vue-next'

const patientsStore = usePatientsStore()
const doctorsStore = useDoctorsStore()
const nursesStore = useNursesStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([
      patientsStore.fetchPatients(),
      doctorsStore.fetchDoctors(),
      nursesStore.fetchNurses()
    ])
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
