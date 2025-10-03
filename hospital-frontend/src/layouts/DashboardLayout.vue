<template>
  <div class="min-h-screen bg-gray-50">
    <aside class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-10">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-center h-16 border-b border-gray-200">
          <Activity class="w-8 h-8 text-primary-600" />
          <h1 class="ml-2 text-xl font-bold text-gray-900">Hospital MS</h1>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
            :class="isActive(item.path) 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-700 hover:bg-gray-100'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
        </nav>

        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User class="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.username || 'User' }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user?.email || '' }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut class="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </aside>

    <div class="pl-64">
      <main class="p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Activity, LayoutDashboard, Users, Stethoscope, UserCog, User, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Doctors', path: '/doctors', icon: Stethoscope },
  { name: 'Nurses', path: '/nurses', icon: UserCog },
  { name: 'Users', path: '/users', icon: User },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
