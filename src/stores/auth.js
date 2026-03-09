import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios'

export const useAuthStore = defineStore('auth', () => {
  // Initialize from localStorage
  const storedUser = localStorage.getItem('user')
  const user = ref(storedUser ? JSON.parse(storedUser) : null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMerchant = computed(() => user.value?.role === 'merchant')
  const isUser = computed(() => user.value?.role === 'user')

  async function login(credentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      throw error
    }
  }

  async function register(userData) {
    try {
      const response = await axios.post('/api/auth/register', userData)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      throw error
    }
  }

  async function loginWithGoogle(googleToken) {
    try {
      const response = await axios.post('/api/auth/google', { token: googleToken })
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      throw error
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get('/api/auth/user')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isMerchant,
    isUser,
    login,
    register,
    loginWithGoogle,
    fetchUser,
    logout
  }
})
