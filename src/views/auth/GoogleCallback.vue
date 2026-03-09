<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p class="text-lg text-gray-600">{{ $t('auth.processing') }}...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-600 text-xl">❌</div>
        <p class="text-lg text-red-600">{{ error }}</p>
        <button @click="goToLogin" class="btn btn-primary">
          {{ $t('auth.backToLogin') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const token = route.query.token
    const userJson = route.query.user
    const errorParam = route.query.error

    if (errorParam) {
      error.value = decodeURIComponent(errorParam)
      loading.value = false
      return
    }

    if (!token || !userJson) {
      error.value = 'Invalid authentication response'
      loading.value = false
      return
    }

    // Parse user data
    const user = JSON.parse(decodeURIComponent(userJson))

    // Store token and user in auth store
    authStore.token = token
    authStore.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Redirect based on role
    setTimeout(() => {
      if (user.role === 'admin') {
        router.push({ name: 'admin-dashboard' })
      } else if (user.role === 'merchant') {
        router.push({ name: 'merchant-dashboard' })
      } else {
        router.push({ name: 'user-dashboard' })
      }
    }, 500)
  } catch (err) {
    error.value = 'Failed to process authentication'
    loading.value = false
  }
})

const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>
