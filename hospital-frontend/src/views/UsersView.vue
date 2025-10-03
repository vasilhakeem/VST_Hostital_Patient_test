<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Users</h1>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div class="text-center">
        <User class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
        <p class="text-gray-600">
          User management functionality will be implemented here. This would typically include listing all registered users, their roles, and management options.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next'
</script>
