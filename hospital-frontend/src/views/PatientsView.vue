<template>
  <div>
    <!-- Header with Create Patient button -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">Patient Management</h1>
        <button
          @click="showCreateModal = true"
          class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-5 h-5 mr-2" />
          Create Patient
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search patients by name, room, or email..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Patients table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nurse</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Loading state -->
            <tr v-if="patientsStore.isLoading">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span class="ml-3">Loading patients...</span>
                </div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-else-if="!patientsStore.isLoading && paginatedPatients.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                No patients found
              </td>
            </tr>
            <!-- Patient rows with inline editing -->
            <tr v-else v-for="patient in paginatedPatients" :key="patient.id" class="hover:bg-gray-50">
              <!-- ID column - never editable -->
              <td class="px-4 py-3 text-sm font-medium text-gray-900">
                {{ patient.id }}
              </td>
              <!-- Name column -->
              <td class="px-4 py-3 text-sm">
                <input
                  v-if="editingId === patient.id"
                  v-model="editForm.name"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span v-else class="text-gray-900">{{ patient.name }}</span>
              </td>
              <!-- Room column -->
              <td class="px-4 py-3 text-sm">
                <input
                  v-if="editingId === patient.id"
                  v-model="editForm.room"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span v-else class="text-gray-900">{{ patient.room }}</span>
              </td>
              <!-- Email column -->
              <td class="px-4 py-3 text-sm">
                <input
                  v-if="editingId === patient.id"
                  v-model="editForm.email"
                  type="email"
                  class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span v-else class="text-gray-900">{{ patient.email }}</span>
              </td>
              <!-- Doctor column -->
              <td class="px-4 py-3 text-sm">
                <select
                  v-if="editingId === patient.id"
                  v-model="editForm.doctor"
                  class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">No Doctor</option>
                  <option v-for="doctor in doctorsStore.doctors" :key="doctor.id" :value="doctor.id">
                    {{ doctor.name }}
                  </option>
                </select>
                <span v-else class="text-gray-900">{{ getDoctorName(patient.doctor) }}</span>
              </td>
              <!-- Nurse column -->
              <td class="px-4 py-3 text-sm">
                <select
                  v-if="editingId === patient.id"
                  v-model="editForm.nurse"
                  class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">No Nurse</option>
                  <option v-for="nurse in nursesStore.nurses" :key="nurse.id" :value="nurse.id">
                    {{ nurse.name }}
                  </option>
                </select>
                <span v-else class="text-gray-900">{{ getNurseName(patient.nurse) }}</span>
              </td>
              <!-- Notes column - icon that opens modal -->
              <td class="px-4 py-3 text-sm">
                <button
                  @click="openNotesModal(patient)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View/Edit Notes"
                >
                  <FileText class="w-5 h-5" />
                </button>
              </td>
              <!-- Actions column -->
              <td class="px-4 py-3 text-sm">
                <div v-if="editingId === patient.id" class="flex items-center gap-2">
                  <button
                    @click="saveEdit"
                    :disabled="patientsStore.isLoading"
                    class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelEdit"
                    :disabled="patientsStore.isLoading"
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-xs disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <button
                    @click="startEdit(patient)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deletePatient(patient.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredPatients.length) }} of {{ filteredPatients.length }} results
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create Patient Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Create New Patient</h2>
        
        <!-- Error message -->
        <div v-if="createError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ createError }}
        </div>
        
        <form @submit.prevent="createPatient" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              v-model="createForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Room *</label>
            <input
              v-model="createForm.room"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="createForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select
              v-model="createForm.doctor"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">No Doctor</option>
              <option v-for="doctor in doctorsStore.doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nurse</label>
            <select
              v-model="createForm.nurse"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">No Nurse</option>
              <option v-for="nurse in nursesStore.nurses" :key="nurse.id" :value="nurse.id">
                {{ nurse.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="createForm.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              :disabled="patientsStore.isLoading"
              class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ patientsStore.isLoading ? 'Creating...' : 'Create Patient' }}
            </button>
            <button
              type="button"
              @click="closeCreateModal"
              :disabled="patientsStore.isLoading"
              class="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Patient Notes</h2>
          <button @click="showNotesModal = false" class="p-1 hover:bg-gray-100 rounded">
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div class="mb-4">
          <p class="text-sm text-gray-600">Patient: <span class="font-medium text-gray-900">{{ selectedPatient?.name }}</span></p>
        </div>
        
        <!-- Error message -->
        <div v-if="notesError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ notesError }}
        </div>
        
        <textarea
          v-model="notesForm"
          rows="8"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter notes for this patient..."
        ></textarea>
        
        <div class="flex gap-3">
          <button
            @click="saveNotes"
            :disabled="patientsStore.isLoading"
            class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ patientsStore.isLoading ? 'Saving...' : 'Save Notes' }}
          </button>
          <button
            @click="showNotesModal = false"
            :disabled="patientsStore.isLoading"
            class="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePatientsStore } from '../stores/patients'
import { useDoctorsStore } from '../stores/doctors'
import { useNursesStore } from '../stores/nurses'
import { 
  Plus, Search, Edit, Trash2, X, FileText
} from 'lucide-vue-next'

const patientsStore = usePatientsStore()
const doctorsStore = useDoctorsStore()
const nursesStore = useNursesStore()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modals
const showCreateModal = ref(false)
const showNotesModal = ref(false)
const selectedPatient = ref(null)

const createError = ref(null)
const notesError = ref(null)

// Forms
const createForm = ref({
  name: '',
  room: '',
  email: '',
  doctor: null,
  nurse: null,
  notes: ''
})

const editForm = ref({})
const editingId = ref(null)
const notesForm = ref('')

// Computed properties
const filteredPatients = computed(() => {
  let patients = patientsStore.patients
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    patients = patients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.room.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query)
    )
  }
  
  return patients
})

const totalPages = computed(() => Math.ceil(filteredPatients.value.length / itemsPerPage.value))

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPatients.value.slice(start, end)
})

// Helper functions
const getDoctorName = (doctorId) => {
  if (!doctorId) return 'No Doctor'
  const doctor = doctorsStore.doctors.find(d => d.id === doctorId)
  return doctor ? doctor.name : 'Unknown'
}

const getNurseName = (nurseId) => {
  if (!nurseId) return 'No Nurse'
  const nurse = nursesStore.nurses.find(n => n.id === nurseId)
  return nurse ? nurse.name : 'Unknown'
}

const createPatient = async () => {
  createError.value = null
  console.log('[v0] Creating patient with data:', createForm.value)
  try {
    const result = await patientsStore.createPatient(createForm.value)
    console.log('[v0] Patient created successfully:', result)
    closeCreateModal()
  } catch (error) {
    console.error('[v0] Create patient error:', error)
    console.error('[v0] Error response:', error.response?.data)
    createError.value = error.response?.data?.error || error.response?.data?.message || 'Failed to create patient'
  }
}

const startEdit = (patient) => {
  editingId.value = patient.id
  editForm.value = { ...patient }
}

const saveEdit = async () => {
  try {
    await patientsStore.updatePatient(editingId.value, editForm.value)
    editingId.value = null
    editForm.value = {}
  } catch (error) {
    console.error('[v0] Update patient error:', error)
    alert('Failed to update patient: ' + (error.response?.data?.error || error.response?.data?.message || error.message))
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {}
}

const deletePatient = async (id) => {
  if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
    try {
      await patientsStore.deletePatient(id)
    } catch (error) {
      console.error('[v0] Delete patient error:', error)
      alert('Failed to delete patient: ' + (error.response?.data?.error || error.response?.data?.message || error.message))
    }
  }
}

const openNotesModal = (patient) => {
  selectedPatient.value = patient
  notesForm.value = patient.notes || ''
  showNotesModal.value = true
  notesError.value = null
}

const saveNotes = async () => {
  notesError.value = null
  try {
    await patientsStore.updatePatient(selectedPatient.value.id, {
      ...selectedPatient.value,
      notes: notesForm.value
    })
    selectedPatient.value.notes = notesForm.value
    showNotesModal.value = false
  } catch (error) {
    console.error('[v0] Save notes error:', error)
    notesError.value = error.response?.data?.error || error.response?.data?.message || 'Failed to save notes'
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  createError.value = null
  resetCreateForm()
}

const resetCreateForm = () => {
  createForm.value = {
    name: '',
    room: '',
    email: '',
    doctor: null,
    nurse: null,
    notes: ''
  }
}

onMounted(async () => {
  console.log('[v0] Loading initial data...')
  try {
    await Promise.all([
      patientsStore.fetchPatients(),
      doctorsStore.fetchDoctors(),
      nursesStore.fetchNurses()
    ])
    console.log('[v0] Initial data loaded successfully')
    console.log('[v0] Patients:', patientsStore.patients)
    console.log('[v0] Doctors:', doctorsStore.doctors)
    console.log('[v0] Nurses:', nursesStore.nurses)
  } catch (error) {
    console.error('[v0] Failed to load initial data:', error)
    console.error('[v0] Error details:', error.response?.data)
  }
})
</script>
