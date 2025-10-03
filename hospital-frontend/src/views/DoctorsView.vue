<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Doctors</h1>
      <button
        @click="showCreateModal = true"
        class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus class="w-5 h-5 mr-2" />
        Add Doctor
      </button>
    </div>

    <!-- Doctors Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="doctorsStore.isLoading">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span class="ml-3">Loading doctors...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="!doctorsStore.isLoading && doctorsStore.doctors.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">No doctors found</td>
            </tr>
            <tr v-else v-for="doctor in doctorsStore.doctors" :key="doctor.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900">{{ doctor.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ doctor.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(doctor.created_at) }}</td>
              <td class="px-6 py-4 text-sm">
                <button
                  @click="deleteDoctor(doctor.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Doctor Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Add New Doctor</h2>
        
        <!-- Error message -->
        <div v-if="createError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ createError }}
        </div>
        
        <form @submit.prevent="createDoctor" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              v-model="createForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="doctorsStore.isLoading"
              class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ doctorsStore.isLoading ? 'Creating...' : 'Create Doctor' }}
            </button>
            <button
              type="button"
              @click="closeCreateModal"
              :disabled="doctorsStore.isLoading"
              class="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDoctorsStore } from '../stores/doctors'
import { Plus, Trash2 } from 'lucide-vue-next'

const doctorsStore = useDoctorsStore()
const showCreateModal = ref(false)
const createForm = ref({ name: '' })
const createError = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const createDoctor = async () => {
  createError.value = null
  console.log('[v0] Creating doctor with data:', createForm.value)
  try {
    const result = await doctorsStore.createDoctor(createForm.value)
    console.log('[v0] Doctor created successfully:', result)
    closeCreateModal()
  } catch (error) {
    console.error('[v0] Create doctor error:', error)
    console.error('[v0] Error response:', error.response?.data)
    createError.value = error.response?.data?.error || error.response?.data?.message || 'Failed to create doctor'
  }
}

const deleteDoctor = async (id) => {
  if (confirm('Are you sure you want to delete this doctor?')) {
    try {
      await doctorsStore.deleteDoctor(id)
    } catch (error) {
      console.error('[v0] Delete doctor error:', error)
      alert('Failed to delete doctor: ' + (error.response?.data?.error || error.response?.data?.message || error.message))
    }
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  createError.value = null
  createForm.value = { name: '' }
}

onMounted(async () => {
  console.log('[v0] Loading doctors...')
  try {
    await doctorsStore.fetchDoctors()
    console.log('[v0] Doctors loaded successfully:', doctorsStore.doctors)
  } catch (error) {
    console.error('[v0] Failed to fetch doctors:', error)
    console.error('[v0] Error details:', error.response?.data)
  }
})
</script>
